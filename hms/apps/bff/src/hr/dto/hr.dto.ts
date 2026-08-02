import { IsDateString, IsString } from 'class-validator';

export class CreateEmployeeDto {
  @IsString()
  employeeCode: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  department: string;

  @IsString()
  designation: string;
}

export class CreateLeaveDto {
  @IsString()
  employeeId: string;

  @IsString()
  leaveType: string;

  @IsDateString()
  fromDate: string;

  @IsDateString()
  toDate: string;
}
