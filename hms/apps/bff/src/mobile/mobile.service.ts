import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MobileDevice } from '../entities/mobile-device.entity';
import { Patient } from '../entities/patient.entity';
import { Appointment } from '../entities/appointment.entity';
import { Bed } from '../entities/bed.entity';
import { ErVisit } from '../entities/er-visit.entity';
import { LabOrder } from '../entities/lab-order.entity';
import { Invoice } from '../entities/invoice.entity';
import { RegisterDeviceDto } from './dto/mobile.dto';
import { AuditService } from '../common/audit.service';

@Injectable()
export class MobileService {
  constructor(
    @InjectRepository(MobileDevice) private readonly deviceRepo: Repository<MobileDevice>,
    @InjectRepository(Patient) private readonly patientRepo: Repository<Patient>,
    @InjectRepository(Appointment) private readonly apptRepo: Repository<Appointment>,
    @InjectRepository(Bed) private readonly bedRepo: Repository<Bed>,
    @InjectRepository(ErVisit) private readonly erRepo: Repository<ErVisit>,
    @InjectRepository(LabOrder) private readonly labRepo: Repository<LabOrder>,
    @InjectRepository(Invoice) private readonly invoiceRepo: Repository<Invoice>,
    private readonly audit: AuditService,
  ) {}

  async registerDevice(dto: RegisterDeviceDto, actorId: string) {
    const device = await this.deviceRepo.save(
      this.deviceRepo.create({ ...dto, status: 'active' }),
    );
    await this.audit.publish({ actorId, action: 'mobile.register', resource: 'mobile_device', resourceId: device.id });
    return { deviceId: device.id, appType: device.appType, platform: device.platform };
  }

  async patientSync(uhid: string) {
    const patient = await this.patientRepo.findOne({ where: { uhid } });
    if (!patient) throw new NotFoundException('Patient not found');
    const [appointments, invoices] = await Promise.all([
      this.apptRepo.find({ where: { patientId: patient.id }, order: { slotStart: 'DESC' }, take: 10 }),
      this.invoiceRepo.find({ where: { patientId: patient.id }, order: { createdAt: 'DESC' }, take: 5 }),
    ]);
    return {
      app: 'patient',
      uhid: patient.uhid,
      appointments: appointments.map((a) => ({ id: a.id, slotStart: a.slotStart, status: a.status })),
      bills: invoices.map((i) => ({ id: i.id, total: i.total, status: i.status })),
      syncedAt: new Date().toISOString(),
    };
  }

  async doctorSync(doctorId: string) {
    const appointments = await this.apptRepo.find({
      where: { doctorId },
      order: { slotStart: 'ASC' },
      take: 20,
      relations: ['patient'],
    });
    const labQueue = await this.labRepo.find({ where: { status: 'ordered' }, order: { createdAt: 'ASC' }, take: 20, relations: ['patient'] });
    return {
      app: 'doctor',
      doctorId,
      schedule: appointments.map((a) => ({ id: a.id, patientUhid: a.patient?.uhid, slotStart: a.slotStart, status: a.status })),
      labQueue: labQueue.map((o) => ({ id: o.id, patientUhid: o.patient?.uhid, testCodes: o.testCodes })),
      syncedAt: new Date().toISOString(),
    };
  }

  async nurseSync() {
    const beds = await this.bedRepo.find();
    const erVisits = await this.erRepo.find({ where: { status: 'active' }, order: { arrivedAt: 'ASC' } });
    const occupied = beds.filter((b) => b.status === 'occupied').length;
    return {
      app: 'nurse',
      ward: { totalBeds: beds.length, occupied, available: beds.length - occupied },
      erQueue: erVisits.map((v) => ({ id: v.id, triageLevel: v.triageLevel, chiefComplaint: v.chiefComplaint })),
      syncedAt: new Date().toISOString(),
    };
  }

  listDevices() {
    return this.deviceRepo.find({ where: { status: 'active' }, order: { registeredAt: 'DESC' } });
  }
}
