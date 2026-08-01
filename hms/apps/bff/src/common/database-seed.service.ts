import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Branch } from '../entities/branch.entity';
import { SEED_BRANCH_ID } from '../config/config.controller';

@Injectable()
export class DatabaseSeedService implements OnModuleInit {
  constructor(@InjectRepository(Branch) private readonly branchRepo: Repository<Branch>) {}

  async onModuleInit() {
    const count = await this.branchRepo.count();
    if (count === 0) {
      await this.branchRepo.save({ id: SEED_BRANCH_ID, code: 'BRN', name: 'Main Branch' });
    }
  }
}
