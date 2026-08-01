import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LabTest } from '../entities/lab-test.entity';
import { LabOrder } from '../entities/lab-order.entity';
import { Patient } from '../entities/patient.entity';
import { CreateLabOrderDto, UpdateLabResultsDto } from './dto/create-lab-order.dto';
import { AuditService } from '../common/audit.service';

@Injectable()
export class LaboratoryService {
  constructor(
    @InjectRepository(LabTest) private readonly testRepo: Repository<LabTest>,
    @InjectRepository(LabOrder) private readonly orderRepo: Repository<LabOrder>,
    @InjectRepository(Patient) private readonly patientRepo: Repository<Patient>,
    private readonly audit: AuditService,
  ) {}

  listTests() {
    return this.testRepo.find();
  }

  async createOrder(dto: CreateLabOrderDto, actorId: string) {
    const patient = await this.patientRepo.findOne({ where: { uhid: dto.patientUhid } });
    if (!patient) throw new NotFoundException('Patient not found');
    const order = await this.orderRepo.save(
      this.orderRepo.create({ patientId: patient.id, testCodes: dto.testCodes, status: 'ordered' }),
    );
    await this.audit.publish({ actorId, action: 'lab.order', resource: 'lab_order', resourceId: order.id, branchId: patient.branchId });
    return { orderId: order.id, status: order.status, testCodes: order.testCodes };
  }

  async getOrder(id: string) {
    const order = await this.orderRepo.findOne({ where: { id }, relations: ['patient'] });
    if (!order) throw new NotFoundException('Lab order not found');
    return order;
  }

  async updateResults(id: string, dto: UpdateLabResultsDto, actorId: string) {
    const order = await this.getOrder(id);
    order.results = dto.results;
    order.status = 'completed';
    await this.orderRepo.save(order);
    await this.audit.publish({ actorId, action: 'lab.results', resource: 'lab_order', resourceId: id });
    return { orderId: id, status: order.status, results: order.results };
  }
}
