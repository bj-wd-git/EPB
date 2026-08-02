import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InsurancePolicy } from '../entities/insurance-policy.entity';
import { InsuranceClaim } from '../entities/insurance-claim.entity';
import { Patient } from '../entities/patient.entity';
import { CreatePolicyDto, CreatePreAuthDto, CreateClaimDto } from './dto/insurance.dto';
import { AuditService } from '../common/audit.service';

@Injectable()
export class InsuranceService {
  constructor(
    @InjectRepository(InsurancePolicy) private readonly policyRepo: Repository<InsurancePolicy>,
    @InjectRepository(InsuranceClaim) private readonly claimRepo: Repository<InsuranceClaim>,
    @InjectRepository(Patient) private readonly patientRepo: Repository<Patient>,
    private readonly audit: AuditService,
  ) {}

  async createPolicy(dto: CreatePolicyDto, actorId: string) {
    const patient = await this.patientRepo.findOne({ where: { uhid: dto.patientUhid } });
    if (!patient) throw new NotFoundException('Patient not found');
    const policy = await this.policyRepo.save(
      this.policyRepo.create({
        patientId: patient.id,
        provider: dto.provider,
        policyNumber: dto.policyNumber,
        coverageLimit: dto.coverageLimit,
        status: 'active',
      }),
    );
    await this.audit.publish({ actorId, action: 'insurance.policy', resource: 'insurance_policy', resourceId: policy.id, branchId: patient.branchId });
    return { policyId: policy.id, provider: policy.provider, policyNumber: policy.policyNumber, coverageLimit: policy.coverageLimit };
  }

  async listPolicies(uhid: string) {
    const patient = await this.patientRepo.findOne({ where: { uhid } });
    if (!patient) throw new NotFoundException('Patient not found');
    return this.policyRepo.find({ where: { patientId: patient.id, status: 'active' } });
  }

  async preAuth(dto: CreatePreAuthDto, actorId: string) {
    const patient = await this.patientRepo.findOne({ where: { uhid: dto.patientUhid } });
    if (!patient) throw new NotFoundException('Patient not found');
    const policy = await this.policyRepo.findOne({ where: { id: dto.policyId, patientId: patient.id } });
    if (!policy) throw new NotFoundException('Policy not found');
    if (Number(dto.estimatedAmount) > Number(policy.coverageLimit)) {
      throw new BadRequestException('Amount exceeds coverage limit');
    }
    const preAuthId = `PA-${Date.now()}`;
    await this.audit.publish({ actorId, action: 'insurance.preauth', resource: 'insurance_policy', resourceId: policy.id, branchId: patient.branchId });
    return { preAuthId, policyId: policy.id, procedure: dto.procedure, approvedAmount: dto.estimatedAmount, status: 'approved' };
  }

  async submitClaim(dto: CreateClaimDto, actorId: string) {
    const patient = await this.patientRepo.findOne({ where: { uhid: dto.patientUhid } });
    if (!patient) throw new NotFoundException('Patient not found');
    const policy = await this.policyRepo.findOne({ where: { id: dto.policyId, patientId: patient.id } });
    if (!policy) throw new NotFoundException('Policy not found');
    const claim = await this.claimRepo.save(
      this.claimRepo.create({
        patientId: patient.id,
        policyId: policy.id,
        amount: dto.amount,
        invoiceId: dto.invoiceId || null,
        status: 'submitted',
      }),
    );
    await this.audit.publish({ actorId, action: 'insurance.claim', resource: 'insurance_claim', resourceId: claim.id, branchId: patient.branchId });
    return { claimId: claim.id, amount: claim.amount, status: claim.status };
  }

  async settleClaim(id: string, actorId: string) {
    const claim = await this.claimRepo.findOne({ where: { id } });
    if (!claim) throw new NotFoundException('Claim not found');
    if (claim.status === 'settled') throw new BadRequestException('Already settled');
    claim.status = 'settled';
    await this.claimRepo.save(claim);
    await this.audit.publish({ actorId, action: 'insurance.settle', resource: 'insurance_claim', resourceId: id });
    return { claimId: id, status: claim.status, amount: claim.amount };
  }
}
