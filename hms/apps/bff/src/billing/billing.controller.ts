import { Body, Controller, Get, Headers, Param, Post, UseGuards } from '@nestjs/common';
import { BillingService } from './billing.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { RolesGuard } from '../common/roles.guard';
import { RequirePermission } from '../common/roles.decorator';

@Controller('billing')
@UseGuards(RolesGuard)
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Post('invoices')
  @RequirePermission('billing:write')
  create(@Body() dto: CreateInvoiceDto, @Headers('x-actor-id') actorId = 'system') {
    return this.billingService.createInvoice(dto, actorId);
  }

  @Get('invoices/patient/:uhid')
  @RequirePermission('billing:read')
  list(@Param('uhid') uhid: string) {
    return this.billingService.listByPatient(uhid);
  }

  @Post('invoices/:id/pay')
  @RequirePermission('billing:write')
  pay(@Param('id') id: string, @Headers('x-actor-id') actorId = 'system') {
    return this.billingService.pay(id, actorId);
  }
}
