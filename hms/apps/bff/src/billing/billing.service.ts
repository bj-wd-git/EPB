import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from '../entities/invoice.entity';
import { Patient } from '../entities/patient.entity';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { AuditService } from '../common/audit.service';

@Injectable()
export class BillingService {
  constructor(
    @InjectRepository(Invoice) private readonly invoiceRepo: Repository<Invoice>,
    @InjectRepository(Patient) private readonly patientRepo: Repository<Patient>,
    private readonly audit: AuditService,
  ) {}

  async createInvoice(dto: CreateInvoiceDto, actorId: string) {
    const patient = await this.patientRepo.findOne({ where: { uhid: dto.patientUhid } });
    if (!patient) throw new NotFoundException('Patient not found');
    const total = dto.lines.reduce((sum, l) => sum + Number(l.amount), 0);
    const invoice = await this.invoiceRepo.save(
      this.invoiceRepo.create({ patientId: patient.id, lines: dto.lines, total, status: 'draft' }),
    );
    await this.audit.publish({ actorId, action: 'billing.invoice', resource: 'invoice', resourceId: invoice.id, branchId: patient.branchId });
    return { invoiceId: invoice.id, total: invoice.total, status: invoice.status, lines: invoice.lines };
  }

  async listByPatient(uhid: string) {
    const patient = await this.patientRepo.findOne({ where: { uhid } });
    if (!patient) throw new NotFoundException('Patient not found');
    return this.invoiceRepo.find({ where: { patientId: patient.id }, order: { createdAt: 'DESC' } });
  }

  async pay(id: string, actorId: string) {
    const invoice = await this.invoiceRepo.findOne({ where: { id } });
    if (!invoice) throw new NotFoundException('Invoice not found');
    if (invoice.status === 'paid') throw new BadRequestException('Already paid');
    invoice.status = 'paid';
    await this.invoiceRepo.save(invoice);
    await this.audit.publish({ actorId, action: 'billing.pay', resource: 'invoice', resourceId: id });
    return { invoiceId: id, status: invoice.status, total: invoice.total };
  }
}
