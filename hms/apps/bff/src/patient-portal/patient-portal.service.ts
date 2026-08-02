import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from '../entities/patient.entity';
import { Appointment } from '../entities/appointment.entity';
import { Invoice } from '../entities/invoice.entity';
import { Prescription } from '../entities/prescription.entity';
import { LabOrder } from '../entities/lab-order.entity';
import { TeleconsultSession } from '../entities/teleconsult-session.entity';
import { AppointmentsService } from '../appointments/appointments.service';
import { PortalBookAppointmentDto, PortalTeleconsultDto } from './dto/patient-portal.dto';
import { AuditService } from '../common/audit.service';

@Injectable()
export class PatientPortalService {
  constructor(
    @InjectRepository(Patient) private readonly patientRepo: Repository<Patient>,
    @InjectRepository(Appointment) private readonly apptRepo: Repository<Appointment>,
    @InjectRepository(Invoice) private readonly invoiceRepo: Repository<Invoice>,
    @InjectRepository(Prescription) private readonly rxRepo: Repository<Prescription>,
    @InjectRepository(LabOrder) private readonly labRepo: Repository<LabOrder>,
    @InjectRepository(TeleconsultSession) private readonly teleRepo: Repository<TeleconsultSession>,
    private readonly appointmentsService: AppointmentsService,
    private readonly audit: AuditService,
  ) {}

  private async resolvePatient(uhid: string) {
    const patient = await this.patientRepo.findOne({ where: { uhid } });
    if (!patient) throw new NotFoundException('Patient not found');
    return patient;
  }

  async dashboard(uhid: string) {
    const patient = await this.resolvePatient(uhid);
    const [appointments, invoices, prescriptions, labOrders, teleconsults] = await Promise.all([
      this.apptRepo.count({ where: { patientId: patient.id } }),
      this.invoiceRepo.find({ where: { patientId: patient.id } }),
      this.rxRepo.count({ where: { patientId: patient.id } }),
      this.labRepo.count({ where: { patientId: patient.id, status: 'completed' } }),
      this.teleRepo.count({ where: { patientId: patient.id, status: 'scheduled' } }),
    ]);
    const pendingBills = invoices.filter((i) => i.status === 'draft');
    return {
      uhid: patient.uhid,
      upcomingAppointments: await this.apptRepo.count({ where: { patientId: patient.id, status: 'confirmed' } }),
      totalAppointments: appointments,
      pendingBills: pendingBills.length,
      pendingAmount: pendingBills.reduce((s, i) => s + Number(i.total), 0),
      prescriptions,
      labReports: labOrders,
      scheduledTeleconsults: teleconsults,
    };
  }

  async appointments(uhid: string) {
    const patient = await this.resolvePatient(uhid);
    const appts = await this.apptRepo.find({ where: { patientId: patient.id }, order: { slotStart: 'DESC' } });
    return appts.map((a) => ({
      appointmentId: a.id,
      doctorId: a.doctorId,
      slotStart: a.slotStart,
      slotEnd: a.slotEnd,
      status: a.status,
    }));
  }

  async bills(uhid: string) {
    const patient = await this.resolvePatient(uhid);
    const invoices = await this.invoiceRepo.find({ where: { patientId: patient.id }, order: { createdAt: 'DESC' } });
    return invoices.map((i) => ({ invoiceId: i.id, total: i.total, status: i.status, createdAt: i.createdAt }));
  }

  async prescriptions(uhid: string) {
    const patient = await this.resolvePatient(uhid);
    const rx = await this.rxRepo.find({ where: { patientId: patient.id }, order: { createdAt: 'DESC' } });
    return rx.map((r) => ({ prescriptionId: r.id, items: r.items, status: r.status, createdAt: r.createdAt }));
  }

  async labReports(uhid: string) {
    const patient = await this.resolvePatient(uhid);
    const orders = await this.labRepo.find({ where: { patientId: patient.id, status: 'completed' }, order: { createdAt: 'DESC' } });
    return orders.map((o) => ({ orderId: o.id, testCodes: o.testCodes, results: o.results, createdAt: o.createdAt }));
  }

  async bookAppointment(uhid: string, dto: PortalBookAppointmentDto, actorId: string) {
    return this.appointmentsService.book(
      { patientUhid: uhid, doctorId: dto.doctorId, slotStart: dto.slotStart, slotEnd: dto.slotEnd, type: 'scheduled' },
      actorId,
    );
  }

  async bookTeleconsult(uhid: string, dto: PortalTeleconsultDto, actorId: string) {
    const patient = await this.resolvePatient(uhid);
    const session = await this.teleRepo.save(
      this.teleRepo.create({
        patientId: patient.id,
        doctorId: dto.doctorId,
        scheduledAt: new Date(dto.scheduledAt),
        status: 'scheduled',
      }),
    );
    await this.audit.publish({ actorId, action: 'portal.teleconsult', resource: 'teleconsult_session', resourceId: session.id, branchId: patient.branchId });
    return { sessionId: session.id, doctorId: session.doctorId, scheduledAt: session.scheduledAt, status: session.status };
  }
}
