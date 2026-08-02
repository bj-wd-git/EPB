import { IsIn, IsOptional, IsString } from 'class-validator';
import { createHash, randomBytes } from 'crypto';

export class CreateSessionDto {
  @IsString()
  actorId: string;

  @IsString()
  role: string;
}

export class CreateApiKeyDto {
  @IsString()
  name: string;

  @IsString()
  role: string;
}

export class LogAccessDto {
  @IsString()
  actorId: string;

  @IsString()
  method: string;

  @IsString()
  path: string;

  @IsOptional()
  @IsString()
  ip?: string;
}

export function generateApiKey(): { token: string; prefix: string; hash: string } {
  const token = `hms_${randomBytes(24).toString('hex')}`;
  const prefix = token.slice(-8);
  const hash = createHash('sha256').update(token).digest('hex');
  return { token, prefix, hash };
}
