import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Branch } from '../entities/branch.entity';
import { LabTest } from '../entities/lab-test.entity';
import { Ward } from '../entities/ward.entity';
import { Bed } from '../entities/bed.entity';
import { Employee } from '../entities/employee.entity';
import { InventoryItem } from '../entities/inventory-item.entity';
import { SEED_BRANCH_ID } from '../config/config.controller';

const SEED_LAB_TESTS = [
  { code: 'CBC', name: 'Complete Blood Count', price: 350 },
  { code: 'LFT', name: 'Liver Function Test', price: 800 },
  { code: 'RBS', name: 'Random Blood Sugar', price: 120 },
];

const SEED_WARDS = [
  { name: 'General Ward', beds: ['A1', 'A2', 'A3'] },
  { name: 'ICU', beds: ['ICU-1', 'ICU-2'] },
];

const SEED_EMPLOYEES = [
  { employeeCode: 'EMP-001', firstName: 'Priya', lastName: 'Sharma', department: 'Nursing', designation: 'Staff Nurse' },
  { employeeCode: 'EMP-002', firstName: 'Raj', lastName: 'Kumar', department: 'Admin', designation: 'Front Desk' },
  { employeeCode: 'EMP-003', firstName: 'Anita', lastName: 'Desai', department: 'Pharmacy', designation: 'Pharmacist' },
];

const SEED_INVENTORY = [
  { sku: 'SYR-10ML', name: 'Syringe 10ml', category: 'Consumables', unit: 'box', quantity: 50, reorderLevel: 20 },
  { sku: 'GLV-M', name: 'Gloves Medium', category: 'Consumables', unit: 'box', quantity: 30, reorderLevel: 15 },
  { sku: 'BND-ROLL', name: 'Bandage Roll', category: 'Consumables', unit: 'pack', quantity: 5, reorderLevel: 10 },
];

@Injectable()
export class DatabaseSeedService implements OnModuleInit {
  constructor(
    @InjectRepository(Branch) private readonly branchRepo: Repository<Branch>,
    @InjectRepository(LabTest) private readonly labTestRepo: Repository<LabTest>,
    @InjectRepository(Ward) private readonly wardRepo: Repository<Ward>,
    @InjectRepository(Bed) private readonly bedRepo: Repository<Bed>,
    @InjectRepository(Employee) private readonly employeeRepo: Repository<Employee>,
    @InjectRepository(InventoryItem) private readonly itemRepo: Repository<InventoryItem>,
  ) {}

  async onModuleInit() {
    const branchCount = await this.branchRepo.count();
    if (branchCount === 0) {
      await this.branchRepo.save({ id: SEED_BRANCH_ID, code: 'BRN', name: 'Main Branch' });
    }
    const testCount = await this.labTestRepo.count();
    if (testCount === 0) {
      await this.labTestRepo.save(SEED_LAB_TESTS);
    }
    const wardCount = await this.wardRepo.count();
    if (wardCount === 0) {
      for (const w of SEED_WARDS) {
        const ward = await this.wardRepo.save({ name: w.name, branchId: SEED_BRANCH_ID });
        await this.bedRepo.save(w.beds.map((code) => ({ wardId: ward.id, code, status: 'available' })));
      }
    }
    const employeeCount = await this.employeeRepo.count();
    if (employeeCount === 0) {
      await this.employeeRepo.save(SEED_EMPLOYEES);
    }
    const itemCount = await this.itemRepo.count();
    if (itemCount === 0) {
      await this.itemRepo.save(SEED_INVENTORY);
    }
  }
}
