import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { Appointment } from '../entities/appointment.entity';
import { LabOrder } from '../entities/lab-order.entity';
import { TeleconsultSession } from '../entities/teleconsult-session.entity';
import { EmrService } from '../emr/emr.service';
import { DoctorNoteDto } from './dto/doctor-portal.dto';
import { AuditService } from '../common/audit.service';

@Injectable()
export class DoctorPortalService {
  constructor(
    @InjectRepository(Appointment) private readonly apptRepo: Repository<Appointment>,
    @InjectRepository(LabOrder) private readonly labRepo: Repository<LabOrder>,
    @InjectRepository(TeleconsultSession) private readonly teleRepo: Repository<TeleconsultSession>,
    private readonly emrService: EmrService,
    private readonly audit: AuditService,
  ) {}

  async schedule(doctorId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const appts = await this.apptRepo.find({
      where: { doctorId, slotStart: MoreThanOrEqual(today) },
      order: { slotStart: 'ASC' },
      relations: ['patient'],
    });
    const teleconsults = await this.teleRepo.find({
      where: { doctorId, status: 'scheduled', scheduledAt: MoreThanOrEqual(today) },
      order: { scheduledAt: 'ASC' },
    });
    return {
      appointments: appts.map((a) => ({
        appointmentId: a.id,
        patientUhid: a.patient?.uhid,
        slotStart: a.slotStart,
        slotEnd: a.slotEnd,
        status: a.status,
      })),
      teleconsults: teleconsults.map((t) => ({
        sessionId: t.id,
        patientId: t.patientId,
        scheduledAt: t.scheduledAt,
        status: t.status,
      })),
    };
  }

  async labQueue(doctorId: string) {
    const pending = await this.labRepo.find({
      where: { status: 'ordered' },
      order: { createdAt: 'ASC' },
      relations: ['patient'],
    });
    return pending.map((o) => ({
      orderId: o.id,
      patientUhid: o.patient?.uhid,
      testCodes: o.testCodes,
      status: o.status,
      createdAt: o.createdAt,
    }));
  }

  async addNote(doctorId: string, dto: DoctorNoteDto) {
    const note = await this.emrService.addNote(dto.patientUhid, { authorId: doctorId, text: dto.text });
    await this.audit.publish({ actorId: doctorId, action: 'portal.doctor.note', resource: 'clinical_note', resourceId: dto.patientUhid });
    return note;
  }
}
