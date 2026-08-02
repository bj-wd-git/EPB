import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmrController } from './emr.controller';
import { EmrService } from './emr.service';
import { Patient } from '../entities/patient.entity';
import { ClinicalNote } from '../entities/clinical-note.entity';
import { Appointment } from '../entities/appointment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Patient, ClinicalNote, Appointment])],
  controllers: [EmrController],
  providers: [EmrService],
  exports: [EmrService],
})
export class EmrModule {}
