import { Body, Controller, Get, Headers, Param, Post, UseGuards } from '@nestjs/common';
import { EmrService } from './emr.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { RolesGuard } from '../common/roles.guard';
import { RequirePermission } from '../common/roles.decorator';

@Controller('patients/:uhid/emr')
@UseGuards(RolesGuard)
export class EmrController {
  constructor(private readonly emrService: EmrService) {}

  @Get()
  @RequirePermission('emr:read')
  get(@Param('uhid') uhid: string) {
    return this.emrService.getByUhid(uhid);
  }

  @Post('notes')
  @RequirePermission('emr:write')
  addNote(@Param('uhid') uhid: string, @Body() dto: CreateNoteDto) {
    return this.emrService.addNote(uhid, dto);
  }
}
