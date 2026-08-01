import { IsString } from 'class-validator';

export class CreateNoteDto {
  @IsString()
  authorId: string;

  @IsString()
  text: string;
}
