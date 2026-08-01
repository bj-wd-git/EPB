import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthModule } from './health/health.module';
import { PatientsModule } from './patients/patients.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { EmrModule } from './emr/emr.module';
import { ConfigModule as HmsConfigModule } from './config/config.module';
import { LaboratoryModule } from './laboratory/laboratory.module';
import { RadiologyModule } from './radiology/radiology.module';
import { PharmacyModule } from './pharmacy/pharmacy.module';
import { BillingModule } from './billing/billing.module';
import { LabTest } from './entities/lab-test.entity';
import { LabOrder } from './entities/lab-order.entity';
import { RadiologyOrder } from './entities/radiology-order.entity';
import { Prescription } from './entities/prescription.entity';
import { Invoice } from './entities/invoice.entity';
import { Branch } from './entities/branch.entity';
import { Patient } from './entities/patient.entity';
import { UhidSequence } from './entities/uhid-sequence.entity';
import { Appointment } from './entities/appointment.entity';
import { ClinicalNote } from './entities/clinical-note.entity';
import { AuditEvent } from './entities/audit-event.entity';
import { DatabaseSeedService } from './common/database-seed.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env', '../../.env'] }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get('MYSQL_HOST', 'localhost'),
        port: config.get<number>('MYSQL_PORT', 3306),
        username: config.get('MYSQL_USER', 'hms'),
        password: config.get('MYSQL_PASSWORD', 'hms'),
        database: config.get('MYSQL_DATABASE', 'hms'),
        entities: [
          Branch, Patient, UhidSequence, Appointment, ClinicalNote, AuditEvent,
          LabTest, LabOrder, RadiologyOrder, Prescription, Invoice,
        ],
        synchronize: config.get('NODE_ENV') !== 'production',
        logging: config.get('DB_LOGGING') === 'true',
      }),
    }),
    TypeOrmModule.forFeature([Branch, LabTest]),
    HealthModule,
    PatientsModule,
    AppointmentsModule,
    EmrModule,
    HmsConfigModule,
    LaboratoryModule,
    RadiologyModule,
    PharmacyModule,
    BillingModule,
  ],
  providers: [DatabaseSeedService],
})
export class AppModule {}
