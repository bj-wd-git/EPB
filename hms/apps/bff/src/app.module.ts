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
import { WardModule } from './ward/ward.module';
import { IpdModule } from './ipd/ipd.module';
import { OtModule } from './ot/ot.module';
import { EmergencyModule } from './emergency/emergency.module';
import { InsuranceModule } from './insurance/insurance.module';
import { HrModule } from './hr/hr.module';
import { InventoryModule } from './inventory/inventory.module';
import { ReportsModule } from './reports/reports.module';
import { PatientPortalModule } from './patient-portal/patient-portal.module';
import { DoctorPortalModule } from './doctor-portal/doctor-portal.module';
import { CommunicationsModule } from './communications/communications.module';
import { ComplianceModule } from './compliance/compliance.module';
import { SecurityModule } from './security/security.module';
import { MobileModule } from './mobile/mobile.module';
import { LabTest } from './entities/lab-test.entity';
import { LabOrder } from './entities/lab-order.entity';
import { RadiologyOrder } from './entities/radiology-order.entity';
import { Prescription } from './entities/prescription.entity';
import { Invoice } from './entities/invoice.entity';
import { Ward } from './entities/ward.entity';
import { Bed } from './entities/bed.entity';
import { Admission } from './entities/admission.entity';
import { OtBooking } from './entities/ot-booking.entity';
import { ErVisit } from './entities/er-visit.entity';
import { InsurancePolicy } from './entities/insurance-policy.entity';
import { InsuranceClaim } from './entities/insurance-claim.entity';
import { Employee } from './entities/employee.entity';
import { LeaveRequest } from './entities/leave-request.entity';
import { InventoryItem } from './entities/inventory-item.entity';
import { StockMovement } from './entities/stock-movement.entity';
import { Notification } from './entities/notification.entity';
import { TeleconsultSession } from './entities/teleconsult-session.entity';
import { ComplianceIncident } from './entities/compliance-incident.entity';
import { ConsentRecord } from './entities/consent-record.entity';
import { CapaAction } from './entities/capa-action.entity';
import { ApiKey } from './entities/api-key.entity';
import { AccessLog } from './entities/access-log.entity';
import { MobileDevice } from './entities/mobile-device.entity';
import { SecuritySession } from './entities/security-session.entity';
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
          Ward, Bed, Admission, OtBooking, ErVisit,
          InsurancePolicy, InsuranceClaim, Employee, LeaveRequest, InventoryItem, StockMovement,
          Notification, TeleconsultSession,
          ComplianceIncident, ConsentRecord, CapaAction, ApiKey, AccessLog, MobileDevice, SecuritySession,
        ],
        synchronize: config.get('NODE_ENV') !== 'production',
        logging: config.get('DB_LOGGING') === 'true',
      }),
    }),
    TypeOrmModule.forFeature([
      Branch, LabTest, Ward, Bed, Employee, InventoryItem,
      Patient, UhidSequence, Appointment, ClinicalNote,
      LabOrder, RadiologyOrder, Prescription, Invoice,
      Admission, OtBooking, ErVisit,
      InsurancePolicy, InsuranceClaim, LeaveRequest, StockMovement,
      Notification, TeleconsultSession,
      ComplianceIncident, ConsentRecord, CapaAction, MobileDevice,
    ]),
    HealthModule,
    PatientsModule,
    AppointmentsModule,
    EmrModule,
    HmsConfigModule,
    LaboratoryModule,
    RadiologyModule,
    PharmacyModule,
    BillingModule,
    WardModule,
    IpdModule,
    OtModule,
    EmergencyModule,
    InsuranceModule,
    HrModule,
    InventoryModule,
    ReportsModule,
    PatientPortalModule,
    DoctorPortalModule,
    CommunicationsModule,
    ComplianceModule,
    SecurityModule,
    MobileModule,
  ],
  providers: [DatabaseSeedService],
})
export class AppModule {}
