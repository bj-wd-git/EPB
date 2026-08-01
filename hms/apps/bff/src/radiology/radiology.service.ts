import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RadiologyOrder } from '../entities/radiology-order.entity';
import { Patient } from '../entities/patient.entity';
import { CreateRadiologyOrderDto, UpdateRadiologyReportDto } from './dto/create-radiology-order.dto';
import { AuditService } from '../common/audit.service';

@Injectable()
export class RadiologyService {
  constructor(
    @InjectRepository(RadiologyOrder) private readonly orderRepo: Repository<RadiologyOrder>,
    @InjectRepository(Patient) private readonly patientRepo: Repository<Patient>,
    private readonly audit: AuditService,
  ) {}

  async createOrder(dto: CreateRadiologyOrderDto, actorId: string) {
    const patient = await this.patientRepo.findOne({ where: { uhid: dto.patientUhid } });
    if (!patient) throw new NotFoundException('Patient not found');
    const order = await this.orderRepo.save(
      this.orderRepo.create({ patientId: patient.id, modality: dto.modality, status: 'ordered' }),
    );
    await this.audit.publish({ actorId, action: 'radiology.order', resource: 'radiology_order', resourceId: order.id, branchId: patient.branchId });
    return { orderId: order.id, modality: order.modality, status: order.status };
  }

  async getOrder(id: string) {
    const order = await this.orderRepo.findOne({ where: { id } });
    if (!order) throw new NotFoundException('Radiology order not found');
    return order;
  }

  async updateReport(id: string, dto: UpdateRadiologyReportDto, actorId: string) {
    const order = await this.getOrder(id);
    order.report = dto.report;
    order.status = 'completed';
    await this.orderRepo.save(order);
    await this.audit.publish({ actorId, action: 'radiology.report', resource: 'radiology_order', resourceId: id });
    return { orderId: id, status: order.status, report: order.report };
  }
}
