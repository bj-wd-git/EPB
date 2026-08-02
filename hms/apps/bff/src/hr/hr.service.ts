import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from '../entities/employee.entity';
import { LeaveRequest } from '../entities/leave-request.entity';
import { CreateEmployeeDto, CreateLeaveDto } from './dto/hr.dto';
import { AuditService } from '../common/audit.service';

@Injectable()
export class HrService {
  constructor(
    @InjectRepository(Employee) private readonly employeeRepo: Repository<Employee>,
    @InjectRepository(LeaveRequest) private readonly leaveRepo: Repository<LeaveRequest>,
    private readonly audit: AuditService,
  ) {}

  listEmployees() {
    return this.employeeRepo.find({ where: { status: 'active' }, order: { employeeCode: 'ASC' } });
  }

  async createEmployee(dto: CreateEmployeeDto, actorId: string) {
    const existing = await this.employeeRepo.findOne({ where: { employeeCode: dto.employeeCode } });
    if (existing) throw new BadRequestException('Employee code already exists');
    const employee = await this.employeeRepo.save(this.employeeRepo.create(dto));
    await this.audit.publish({ actorId, action: 'hr.employee.create', resource: 'employee', resourceId: employee.id });
    return { employeeId: employee.id, employeeCode: employee.employeeCode, name: `${employee.firstName} ${employee.lastName}` };
  }

  async requestLeave(dto: CreateLeaveDto, actorId: string) {
    const employee = await this.employeeRepo.findOne({ where: { id: dto.employeeId } });
    if (!employee) throw new NotFoundException('Employee not found');
    const leave = await this.leaveRepo.save(
      this.leaveRepo.create({ ...dto, status: 'pending' }),
    );
    await this.audit.publish({ actorId, action: 'hr.leave.request', resource: 'leave_request', resourceId: leave.id });
    return { leaveId: leave.id, status: leave.status, leaveType: leave.leaveType };
  }

  async approveLeave(id: string, actorId: string) {
    const leave = await this.leaveRepo.findOne({ where: { id } });
    if (!leave) throw new NotFoundException('Leave request not found');
    if (leave.status !== 'pending') throw new BadRequestException('Not pending');
    leave.status = 'approved';
    await this.leaveRepo.save(leave);
    await this.audit.publish({ actorId, action: 'hr.leave.approve', resource: 'leave_request', resourceId: id });
    return { leaveId: id, status: leave.status };
  }

  async listPendingLeave() {
    return this.leaveRepo.find({ where: { status: 'pending' }, relations: ['employee'], order: { requestedAt: 'ASC' } });
  }
}
