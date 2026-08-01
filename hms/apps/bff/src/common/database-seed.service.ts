import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Branch } from '../entities/branch.entity';
import { LabTest } from '../entities/lab-test.entity';
import { SEED_BRANCH_ID } from '../config/config.controller';

const SEED_LAB_TESTS = [
  { code: 'CBC', name: 'Complete Blood Count', price: 350 },
  { code: 'LFT', name: 'Liver Function Test', price: 800 },
  { code: 'RBS', name: 'Random Blood Sugar', price: 120 },
];

@Injectable()
export class DatabaseSeedService implements OnModuleInit {
  constructor(
    @InjectRepository(Branch) private readonly branchRepo: Repository<Branch>,
    @InjectRepository(LabTest) private readonly labTestRepo: Repository<LabTest>,
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
  }
}
