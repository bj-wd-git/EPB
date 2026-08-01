import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Branch } from '../entities/branch.entity';

@Injectable()
export class DatabaseSeedService implements OnModuleInit {
  constructor(@InjectRepository(Branch) private readonly branchRepo: Repository<Branch>) {}

  async onModuleInit() {
    const count = await this.branchRepo.count();
    if (count === 0) {
      await this.branchRepo.save({ code: 'BRN', name: 'Main Branch' });
    }
  }
}
