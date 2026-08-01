import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthModule } from './health/health.module';
import { PatientsModule } from './patients/patients.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { EmrModule } from './emr/emr.module';
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
        entities: [Branch, Patient, UhidSequence, Appointment, ClinicalNote, AuditEvent],
        synchronize: config.get('NODE_ENV') !== 'production',
        logging: config.get('DB_LOGGING') === 'true',
      }),
    }),
    TypeOrmModule.forFeature([Branch]),
    HealthModule,
    PatientsModule,
    AppointmentsModule,
    EmrModule,
  ],
  providers: [DatabaseSeedService],
})
export class AppModule {}
