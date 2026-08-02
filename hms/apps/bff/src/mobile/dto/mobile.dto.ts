import { IsIn, IsString } from 'class-validator';

export class RegisterDeviceDto {
  @IsString()
  userId: string;

  @IsIn(['patient', 'doctor', 'nurse', 'admin'])
  appType: string;

  @IsIn(['ios', 'android', 'web'])
  platform: string;

  @IsString()
  deviceToken: string;
}
