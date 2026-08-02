import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ward } from '../entities/ward.entity';
import { Bed } from '../entities/bed.entity';
import { AuditService } from '../common/audit.service';

@Injectable()
export class WardService {
  constructor(
    @InjectRepository(Ward) private readonly wardRepo: Repository<Ward>,
    @InjectRepository(Bed) private readonly bedRepo: Repository<Bed>,
    private readonly audit: AuditService,
  ) {}

  listWards() {
    return this.wardRepo.find();
  }

  async listBeds(wardId: string) {
    return this.bedRepo.find({ where: { wardId } });
  }

  async occupancy() {
    const beds = await this.bedRepo.find({ relations: ['ward'] });
    const total = beds.length;
    const occupied = beds.filter((b) => b.status === 'occupied').length;
    return { total, occupied, available: total - occupied, occupancyRate: total ? Math.round((occupied / total) * 100) : 0 };
  }
}
