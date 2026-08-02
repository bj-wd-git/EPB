import { Controller, Get } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Branch } from '../entities/branch.entity';

export const SEED_BRANCH_ID = '00000000-0000-0000-0000-000000000001';
export const SEED_DOCTOR_ID = '00000000-0000-0000-0000-000000000002';

@Controller()
export class ConfigController {
  constructor(@InjectRepository(Branch) private readonly branchRepo: Repository<Branch>) {}

  @Get('branches')
  async branches() {
    return this.branchRepo.find({ select: ['id', 'code', 'name'] });
  }

  @Get('doctors')
  doctors() {
    return [
      { id: SEED_DOCTOR_ID, name: 'Dr. Smith', department: 'General', branchId: SEED_BRANCH_ID },
      { id: '00000000-0000-0000-0000-000000000003', name: 'Dr. Ananya Rao', department: 'Surgery', branchId: SEED_BRANCH_ID },
    ];
  }
}
