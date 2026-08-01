import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from '../entities/patient.entity';
import { ClinicalNote } from '../entities/clinical-note.entity';
import { Appointment } from '../entities/appointment.entity';
import { CreateNoteDto } from './dto/create-note.dto';

@Injectable()
export class EmrService {
  constructor(
    @InjectRepository(Patient) private readonly patientRepo: Repository<Patient>,
    @InjectRepository(ClinicalNote) private readonly noteRepo: Repository<ClinicalNote>,
    @InjectRepository(Appointment) private readonly apptRepo: Repository<Appointment>,
  ) {}

  async getByUhid(uhid: string) {
    const patient = await this.patientRepo.findOne({ where: { uhid } });
    if (!patient) throw new NotFoundException('Patient not found');

    const notes = await this.noteRepo.find({ where: { patientId: patient.id }, order: { createdAt: 'DESC' } });
    const appointments = await this.apptRepo.find({ where: { patientId: patient.id } });

    return {
      uhid: patient.uhid,
      allergies: [],
      vitals: [],
      diagnoses: [],
      notes: notes.map((n) => ({ authorId: n.authorId, text: n.text, createdAt: n.createdAt })),
      visits: appointments.map((a) => ({ appointmentId: a.id, date: a.slotStart.toISOString().slice(0, 10) })),
    };
  }

  async addNote(uhid: string, dto: CreateNoteDto) {
    const patient = await this.patientRepo.findOne({ where: { uhid } });
    if (!patient) throw new NotFoundException('Patient not found');

    const note = await this.noteRepo.save(
      this.noteRepo.create({ patientId: patient.id, authorId: dto.authorId, text: dto.text }),
    );
    return { authorId: note.authorId, text: note.text, createdAt: note.createdAt };
  }
}
