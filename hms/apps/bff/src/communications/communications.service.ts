import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../entities/notification.entity';
import { Appointment } from '../entities/appointment.entity';
import { Patient } from '../entities/patient.entity';
import { SendMessageDto, AppointmentReminderDto } from './dto/communications.dto';
import { AuditService } from '../common/audit.service';

@Injectable()
export class CommunicationsService {
  constructor(
    @InjectRepository(Notification) private readonly notifRepo: Repository<Notification>,
    @InjectRepository(Appointment) private readonly apptRepo: Repository<Appointment>,
    @InjectRepository(Patient) private readonly patientRepo: Repository<Patient>,
    private readonly audit: AuditService,
  ) {}

  async send(dto: SendMessageDto, actorId: string) {
    const notification = await this.notifRepo.save(
      this.notifRepo.create({
        channel: dto.channel,
        recipient: dto.recipient,
        subject: dto.subject || null,
        body: dto.body,
        referenceId: dto.referenceId || null,
        status: 'sent',
        sentAt: new Date(),
      }),
    );
    await this.audit.publish({ actorId, action: 'comms.send', resource: 'notification', resourceId: notification.id });
    return { messageId: notification.id, channel: notification.channel, status: notification.status };
  }

  async listRecent() {
    return this.notifRepo.find({ order: { createdAt: 'DESC' }, take: 50 });
  }

  async appointmentReminder(dto: AppointmentReminderDto, actorId: string) {
    const appt = await this.apptRepo.findOne({ where: { id: dto.appointmentId }, relations: ['patient'] });
    if (!appt) throw new NotFoundException('Appointment not found');
    const patient = appt.patient || await this.patientRepo.findOne({ where: { id: appt.patientId } });
    const body = `Reminder: Your appointment is scheduled for ${appt.slotStart.toISOString().slice(0, 16).replace('T', ' ')}.`;
    const recipient = patient ? `patient:${patient.uhid}` : `appointment:${appt.id}`;
    return this.send(
      { channel: 'sms', recipient, subject: 'Appointment Reminder', body, referenceId: appt.id },
      actorId,
    );
  }
}
