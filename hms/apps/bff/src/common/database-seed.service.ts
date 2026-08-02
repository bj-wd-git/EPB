import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Branch } from '../entities/branch.entity';
import { LabTest } from '../entities/lab-test.entity';
import { Ward } from '../entities/ward.entity';
import { Bed } from '../entities/bed.entity';
import { Employee } from '../entities/employee.entity';
import { InventoryItem } from '../entities/inventory-item.entity';
import { Patient } from '../entities/patient.entity';
import { UhidSequence } from '../entities/uhid-sequence.entity';
import { Appointment } from '../entities/appointment.entity';
import { ClinicalNote } from '../entities/clinical-note.entity';
import { LabOrder } from '../entities/lab-order.entity';
import { RadiologyOrder } from '../entities/radiology-order.entity';
import { Prescription } from '../entities/prescription.entity';
import { Invoice } from '../entities/invoice.entity';
import { Admission } from '../entities/admission.entity';
import { OtBooking } from '../entities/ot-booking.entity';
import { ErVisit } from '../entities/er-visit.entity';
import { InsurancePolicy } from '../entities/insurance-policy.entity';
import { InsuranceClaim } from '../entities/insurance-claim.entity';
import { LeaveRequest } from '../entities/leave-request.entity';
import { StockMovement } from '../entities/stock-movement.entity';
import { Notification } from '../entities/notification.entity';
import { TeleconsultSession } from '../entities/teleconsult-session.entity';
import { ComplianceIncident } from '../entities/compliance-incident.entity';
import { ConsentRecord } from '../entities/consent-record.entity';
import { CapaAction } from '../entities/capa-action.entity';
import { MobileDevice } from '../entities/mobile-device.entity';
import { SEED_BRANCH_ID, SEED_DOCTOR_ID } from '../config/config.controller';

export const SEED_BRANCH_EAST_ID = '00000000-0000-0000-0000-000000000010';
export const SEED_DOCTOR_2_ID = '00000000-0000-0000-0000-000000000003';

const DEMO_PATIENTS = [
  {
    id: '10000000-0000-0000-0000-000000000001',
    uhid: 'BRN000001',
    firstName: 'Arjun',
    lastName: 'Mehta',
    dateOfBirth: '1988-04-12',
    phone: '+919876543210',
    email: 'arjun.mehta@example.com',
  },
  {
    id: '10000000-0000-0000-0000-000000000002',
    uhid: 'BRN000002',
    firstName: 'Kavya',
    lastName: 'Reddy',
    dateOfBirth: '1992-09-03',
    phone: '+919876543211',
    email: 'kavya.reddy@example.com',
  },
  {
    id: '10000000-0000-0000-0000-000000000003',
    uhid: 'BRN000003',
    firstName: 'Vikram',
    lastName: 'Singh',
    dateOfBirth: '1975-01-22',
    phone: '+919876543212',
    email: 'vikram.singh@example.com',
  },
  {
    id: '10000000-0000-0000-0000-000000000004',
    uhid: 'BRN000004',
    firstName: 'Sneha',
    lastName: 'Patel',
    dateOfBirth: '1998-11-15',
    phone: '+919876543213',
    email: 'sneha.patel@example.com',
  },
  {
    id: '10000000-0000-0000-0000-000000000005',
    uhid: 'BRN000005',
    firstName: 'Rahul',
    lastName: 'Nair',
    dateOfBirth: '1983-06-28',
    phone: '+919876543214',
    email: 'rahul.nair@example.com',
  },
];

const SEED_LAB_TESTS = [
  { code: 'CBC', name: 'Complete Blood Count', price: 350 },
  { code: 'LFT', name: 'Liver Function Test', price: 800 },
  { code: 'RBS', name: 'Random Blood Sugar', price: 120 },
  { code: 'LIPID', name: 'Lipid Profile', price: 600 },
  { code: 'TFT', name: 'Thyroid Function Test', price: 750 },
  { code: 'HBA1C', name: 'HbA1c', price: 550 },
];

const SEED_WARDS = [
  { name: 'General Ward', beds: ['A1', 'A2', 'A3', 'A4'] },
  { name: 'ICU', beds: ['ICU-1', 'ICU-2', 'ICU-3'] },
  { name: 'Maternity', beds: ['M1', 'M2'] },
];

const SEED_EMPLOYEES = [
  { employeeCode: 'EMP-001', firstName: 'Priya', lastName: 'Sharma', department: 'Nursing', designation: 'Staff Nurse' },
  { employeeCode: 'EMP-002', firstName: 'Raj', lastName: 'Kumar', department: 'Admin', designation: 'Front Desk' },
  { employeeCode: 'EMP-003', firstName: 'Anita', lastName: 'Desai', department: 'Pharmacy', designation: 'Pharmacist' },
  { employeeCode: 'EMP-004', firstName: 'Suresh', lastName: 'Iyer', department: 'Laboratory', designation: 'Lab Technician' },
  { employeeCode: 'EMP-005', firstName: 'Meera', lastName: 'Joshi', department: 'HR', designation: 'HR Executive' },
  { employeeCode: 'EMP-006', firstName: 'Karthik', lastName: 'Rao', department: 'Nursing', designation: 'ICU Nurse' },
];

const SEED_INVENTORY = [
  { sku: 'SYR-10ML', name: 'Syringe 10ml', category: 'Consumables', unit: 'box', quantity: 50, reorderLevel: 20 },
  { sku: 'GLV-M', name: 'Gloves Medium', category: 'Consumables', unit: 'box', quantity: 30, reorderLevel: 15 },
  { sku: 'BND-ROLL', name: 'Bandage Roll', category: 'Consumables', unit: 'pack', quantity: 5, reorderLevel: 10 },
  { sku: 'IV-SET', name: 'IV Infusion Set', category: 'Consumables', unit: 'box', quantity: 40, reorderLevel: 15 },
  { sku: 'PARA-500', name: 'Paracetamol 500mg', category: 'Pharmacy', unit: 'strip', quantity: 200, reorderLevel: 50 },
  { sku: 'AMOX-250', name: 'Amoxicillin 250mg', category: 'Pharmacy', unit: 'strip', quantity: 8, reorderLevel: 25 },
];

@Injectable()
export class DatabaseSeedService implements OnModuleInit {
  private readonly log = new Logger(DatabaseSeedService.name);

  constructor(
    @InjectRepository(Branch) private readonly branchRepo: Repository<Branch>,
    @InjectRepository(LabTest) private readonly labTestRepo: Repository<LabTest>,
    @InjectRepository(Ward) private readonly wardRepo: Repository<Ward>,
    @InjectRepository(Bed) private readonly bedRepo: Repository<Bed>,
    @InjectRepository(Employee) private readonly employeeRepo: Repository<Employee>,
    @InjectRepository(InventoryItem) private readonly itemRepo: Repository<InventoryItem>,
    @InjectRepository(Patient) private readonly patientRepo: Repository<Patient>,
    @InjectRepository(UhidSequence) private readonly uhidRepo: Repository<UhidSequence>,
    @InjectRepository(Appointment) private readonly appointmentRepo: Repository<Appointment>,
    @InjectRepository(ClinicalNote) private readonly noteRepo: Repository<ClinicalNote>,
    @InjectRepository(LabOrder) private readonly labOrderRepo: Repository<LabOrder>,
    @InjectRepository(RadiologyOrder) private readonly radiologyRepo: Repository<RadiologyOrder>,
    @InjectRepository(Prescription) private readonly rxRepo: Repository<Prescription>,
    @InjectRepository(Invoice) private readonly invoiceRepo: Repository<Invoice>,
    @InjectRepository(Admission) private readonly admissionRepo: Repository<Admission>,
    @InjectRepository(OtBooking) private readonly otRepo: Repository<OtBooking>,
    @InjectRepository(ErVisit) private readonly erRepo: Repository<ErVisit>,
    @InjectRepository(InsurancePolicy) private readonly policyRepo: Repository<InsurancePolicy>,
    @InjectRepository(InsuranceClaim) private readonly claimRepo: Repository<InsuranceClaim>,
    @InjectRepository(LeaveRequest) private readonly leaveRepo: Repository<LeaveRequest>,
    @InjectRepository(StockMovement) private readonly stockRepo: Repository<StockMovement>,
    @InjectRepository(Notification) private readonly notifRepo: Repository<Notification>,
    @InjectRepository(TeleconsultSession) private readonly teleRepo: Repository<TeleconsultSession>,
    @InjectRepository(ComplianceIncident) private readonly incidentRepo: Repository<ComplianceIncident>,
    @InjectRepository(ConsentRecord) private readonly consentRepo: Repository<ConsentRecord>,
    @InjectRepository(CapaAction) private readonly capaRepo: Repository<CapaAction>,
    @InjectRepository(MobileDevice) private readonly deviceRepo: Repository<MobileDevice>,
  ) {}

  async onModuleInit() {
    await this.seedReferenceData();
    const demoEnabled = process.env.HMS_SEED_DEMO !== 'false' && process.env.NODE_ENV !== 'production';
    if (demoEnabled) {
      await this.seedDemoClinicalData();
    }
  }

  private async seedReferenceData() {
    if ((await this.branchRepo.count()) === 0) {
      await this.branchRepo.save([
        { id: SEED_BRANCH_ID, code: 'BRN', name: 'Main Branch' },
        { id: SEED_BRANCH_EAST_ID, code: 'EST', name: 'East Clinic' },
      ]);
    } else if (!(await this.branchRepo.findOneBy({ id: SEED_BRANCH_EAST_ID }))) {
      await this.branchRepo.save({ id: SEED_BRANCH_EAST_ID, code: 'EST', name: 'East Clinic' });
    }

    for (const t of SEED_LAB_TESTS) {
      if (!(await this.labTestRepo.findOneBy({ code: t.code }))) {
        await this.labTestRepo.save(t);
      }
    }

    if ((await this.wardRepo.count()) === 0) {
      for (const w of SEED_WARDS) {
        const ward = await this.wardRepo.save({ name: w.name, branchId: SEED_BRANCH_ID });
        await this.bedRepo.save(w.beds.map((code) => ({ wardId: ward.id, code, status: 'available' })));
      }
    } else {
      for (const w of SEED_WARDS) {
        let ward = await this.wardRepo.findOneBy({ name: w.name, branchId: SEED_BRANCH_ID });
        if (!ward) {
          ward = await this.wardRepo.save({ name: w.name, branchId: SEED_BRANCH_ID });
        }
        for (const code of w.beds) {
          const exists = await this.bedRepo.findOneBy({ wardId: ward.id, code });
          if (!exists) {
            await this.bedRepo.save({ wardId: ward.id, code, status: 'available' });
          }
        }
      }
    }

    for (const e of SEED_EMPLOYEES) {
      if (!(await this.employeeRepo.findOneBy({ employeeCode: e.employeeCode }))) {
        await this.employeeRepo.save(e);
      }
    }

    for (const item of SEED_INVENTORY) {
      if (!(await this.itemRepo.findOneBy({ sku: item.sku }))) {
        await this.itemRepo.save(item);
      }
    }

    this.log.log('Reference catalogs ensured (branches, labs, wards, HR, inventory)');
  }

  private async seedDemoClinicalData() {
    if (await this.patientRepo.findOneBy({ id: DEMO_PATIENTS[0].id })) {
      this.log.log('Demo clinical data skipped (already seeded)');
      return;
    }

    const patients = await this.patientRepo.save(
      DEMO_PATIENTS.map((p) => ({ ...p, branchId: SEED_BRANCH_ID })),
    );
    const [arjun, kavya, vikram, sneha, rahul] = patients;

    await this.uhidRepo.save({ branchCode: 'BRN', lastSequence: DEMO_PATIENTS.length });

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const slot = (h: number, m: number) => {
      const start = new Date(tomorrow);
      start.setHours(h, m, 0, 0);
      const end = new Date(start);
      end.setMinutes(end.getMinutes() + 15);
      return { slotStart: start, slotEnd: end };
    };

    await this.appointmentRepo.save([
      { patientId: arjun.id, doctorId: SEED_DOCTOR_ID, ...slot(9, 0), status: 'confirmed', queuePosition: 1 },
      { patientId: kavya.id, doctorId: SEED_DOCTOR_ID, ...slot(9, 15), status: 'confirmed', queuePosition: 2 },
      { patientId: sneha.id, doctorId: SEED_DOCTOR_2_ID, ...slot(10, 0), status: 'confirmed', queuePosition: 1 },
      { patientId: rahul.id, doctorId: SEED_DOCTOR_ID, ...slot(10, 30), status: 'checked-in', queuePosition: 3 },
    ]);

    await this.noteRepo.save([
      {
        patientId: arjun.id,
        authorId: SEED_DOCTOR_ID,
        text: 'OP review: mild hypertension. Continue amlodipine 5mg OD. Follow-up in 2 weeks.',
      },
      {
        patientId: kavya.id,
        authorId: SEED_DOCTOR_ID,
        text: 'Antenatal visit (G2P1). BP normal. Next visit scheduled in 4 weeks.',
      },
      {
        patientId: vikram.id,
        authorId: SEED_DOCTOR_2_ID,
        text: 'Pre-op assessment for laparoscopic cholecystectomy. Fit for surgery under GA.',
      },
    ]);

    await this.labOrderRepo.save([
      {
        patientId: arjun.id,
        testCodes: ['CBC', 'LIPID', 'RBS'],
        status: 'completed',
        results: { CBC: 'WNL', LIPID: 'LDL 142 mg/dL', RBS: '118 mg/dL' },
      },
      { patientId: kavya.id, testCodes: ['CBC', 'TFT'], status: 'ordered', results: null },
      {
        patientId: vikram.id,
        testCodes: ['LFT', 'HBA1C'],
        status: 'completed',
        results: { LFT: 'Mild elev. ALT', HBA1C: '6.2%' },
      },
    ]);

    await this.radiologyRepo.save([
      { patientId: vikram.id, modality: 'USG Abdomen', status: 'reported', report: 'Multiple gallstones; CBD clear.' },
      { patientId: rahul.id, modality: 'Chest X-Ray', status: 'ordered', report: null },
    ]);

    await this.rxRepo.save([
      {
        patientId: arjun.id,
        items: [
          { drug: 'Amlodipine', dose: '5mg', frequency: 'OD' },
          { drug: 'Aspirin', dose: '75mg', frequency: 'OD' },
        ],
        status: 'dispensed',
      },
      {
        patientId: sneha.id,
        items: [{ drug: 'Paracetamol', dose: '500mg', frequency: 'SOS' }],
        status: 'prescribed',
      },
    ]);

    const invoice = await this.invoiceRepo.save({
      patientId: arjun.id,
      lines: [
        { description: 'OP Consultation', amount: 500, source: 'op' },
        { description: 'CBC + Lipid + RBS', amount: 1070, source: 'lab' },
      ],
      total: 1570,
      status: 'paid',
    });
    await this.invoiceRepo.save({
      patientId: rahul.id,
      lines: [
        { description: 'ER Visit', amount: 800, source: 'er' },
        { description: 'Chest X-Ray', amount: 450, source: 'radiology' },
      ],
      total: 1250,
      status: 'draft',
    });

    const general = await this.wardRepo.findOneBy({ name: 'General Ward', branchId: SEED_BRANCH_ID });
    const bedA1 = general
      ? await this.bedRepo.findOneBy({ wardId: general.id, code: 'A1' })
      : null;
    if (bedA1) {
      await this.bedRepo.update(bedA1.id, { status: 'occupied' });
      await this.admissionRepo.save({
        patientId: vikram.id,
        bedId: bedA1.id,
        status: 'admitted',
        dischargedAt: null,
      });
    }

    const otAt = new Date();
    otAt.setDate(otAt.getDate() + 2);
    otAt.setHours(11, 0, 0, 0);
    await this.otRepo.save({
      patientId: vikram.id,
      surgeonId: SEED_DOCTOR_2_ID,
      procedure: 'Laparoscopic cholecystectomy',
      scheduledAt: otAt,
      status: 'scheduled',
    });

    await this.erRepo.save([
      {
        patientId: rahul.id,
        walkInName: null,
        triageLevel: '3',
        status: 'active',
        chiefComplaint: 'Acute abdominal pain',
      },
      {
        patientId: null,
        walkInName: 'Unknown Male',
        triageLevel: '2',
        status: 'active',
        chiefComplaint: 'Road traffic injury — left arm',
      },
    ]);

    const policy = await this.policyRepo.save({
      patientId: arjun.id,
      provider: 'Star Health',
      policyNumber: 'SH-DEMO-1001',
      coverageLimit: 500000,
      status: 'active',
    });
    await this.claimRepo.save({
      patientId: arjun.id,
      policyId: policy.id,
      amount: 1570,
      invoiceId: invoice.id,
      status: 'submitted',
    });
    await this.policyRepo.save({
      patientId: kavya.id,
      provider: 'HDFC Ergo',
      policyNumber: 'HE-DEMO-2044',
      coverageLimit: 300000,
      status: 'active',
    });

    const emp = await this.employeeRepo.findOneBy({ employeeCode: 'EMP-001' });
    if (emp) {
      await this.leaveRepo.save({
        employeeId: emp.id,
        leaveType: 'casual',
        fromDate: '2026-08-10',
        toDate: '2026-08-11',
        status: 'pending',
      });
    }
    const empHr = await this.employeeRepo.findOneBy({ employeeCode: 'EMP-005' });
    if (empHr) {
      await this.leaveRepo.save({
        employeeId: empHr.id,
        leaveType: 'annual',
        fromDate: '2026-08-18',
        toDate: '2026-08-22',
        status: 'approved',
      });
    }

    const bandage = await this.itemRepo.findOneBy({ sku: 'BND-ROLL' });
    if (bandage) {
      await this.stockRepo.save({
        itemId: bandage.id,
        quantity: 10,
        type: 'receive',
        reference: 'PO-DEMO-001',
      });
      await this.stockRepo.save({
        itemId: bandage.id,
        quantity: 2,
        type: 'consume',
        reference: 'WARD-GENERAL',
      });
    }

    const teleAt = new Date();
    teleAt.setDate(teleAt.getDate() + 1);
    teleAt.setHours(16, 0, 0, 0);
    await this.teleRepo.save({
      patientId: sneha.id,
      doctorId: SEED_DOCTOR_ID,
      scheduledAt: teleAt,
      status: 'scheduled',
    });

    await this.notifRepo.save([
      {
        channel: 'sms',
        recipient: arjun.phone,
        subject: 'Appointment reminder',
        body: `Reminder: OP with Dr. Smith tomorrow 09:00. UHID ${arjun.uhid}`,
        status: 'sent',
        referenceId: arjun.id,
        sentAt: new Date(),
      },
      {
        channel: 'whatsapp',
        recipient: kavya.phone,
        subject: null,
        body: 'Your lab order CBC/TFT is ready for sample collection.',
        status: 'queued',
        referenceId: kavya.id,
        sentAt: null,
      },
      {
        channel: 'email',
        recipient: vikram.email!,
        subject: 'OT booking confirmed',
        body: 'Laparoscopic cholecystectomy scheduled in 2 days at 11:00.',
        status: 'sent',
        referenceId: vikram.id,
        sentAt: new Date(),
      },
    ]);

    const incident = await this.incidentRepo.save({
      title: 'Near-miss medication labeling',
      description: 'Look-alike ampoule placed in wrong bin; caught before administration.',
      severity: 'medium',
      status: 'open',
      reportedBy: 'nurse-1',
      resolvedAt: null,
    });
    await this.capaRepo.save({
      incidentId: incident.id,
      action: 'Segregate look-alike drugs; add shelf labels; retrain ward staff',
      assignedTo: 'EMP-001',
      status: 'open',
      dueDate: '2026-08-15',
    });
    await this.consentRepo.save([
      {
        patientId: vikram.id,
        formType: 'surgical',
        status: 'signed',
        signedAt: new Date(),
      },
      {
        patientId: sneha.id,
        formType: 'teleconsult',
        status: 'pending',
        signedAt: null,
      },
    ]);

    await this.deviceRepo.save([
      {
        userId: arjun.id,
        appType: 'patient',
        platform: 'android',
        deviceToken: 'demo-token-patient-arjun',
        status: 'active',
      },
      {
        userId: SEED_DOCTOR_ID,
        appType: 'doctor',
        platform: 'ios',
        deviceToken: 'demo-token-doctor-smith',
        status: 'active',
      },
      {
        userId: 'EMP-001',
        appType: 'nurse',
        platform: 'android',
        deviceToken: 'demo-token-nurse-priya',
        status: 'active',
      },
    ]);

    this.log.log(
      `Demo clinical data seeded: ${patients.length} patients (UHID BRN000001–BRN000005), appointments, IPD/OT/ER, portals & compliance`,
    );
  }
}
