import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from '../entities/patient.entity';
import { Invoice } from '../entities/invoice.entity';
import { Admission } from '../entities/admission.entity';
import { Bed } from '../entities/bed.entity';
import { ErVisit } from '../entities/er-visit.entity';
import { LabOrder } from '../entities/lab-order.entity';
import { InventoryItem } from '../entities/inventory-item.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Patient) private readonly patientRepo: Repository<Patient>,
    @InjectRepository(Invoice) private readonly invoiceRepo: Repository<Invoice>,
    @InjectRepository(Admission) private readonly admissionRepo: Repository<Admission>,
    @InjectRepository(Bed) private readonly bedRepo: Repository<Bed>,
    @InjectRepository(ErVisit) private readonly erRepo: Repository<ErVisit>,
    @InjectRepository(LabOrder) private readonly labOrderRepo: Repository<LabOrder>,
    @InjectRepository(InventoryItem) private readonly itemRepo: Repository<InventoryItem>,
  ) {}

  async operational() {
    const beds = await this.bedRepo.find();
    const totalBeds = beds.length;
    const occupiedBeds = beds.filter((b) => b.status === 'occupied').length;
    const activeAdmissions = await this.admissionRepo.count({ where: { status: 'admitted' } });
    const activeErVisits = await this.erRepo.count({ where: { status: 'active' } });
    const totalPatients = await this.patientRepo.count();
    return {
      beds: { total: totalBeds, occupied: occupiedBeds, available: totalBeds - occupiedBeds, occupancyRate: totalBeds ? Math.round((occupiedBeds / totalBeds) * 100) : 0 },
      activeAdmissions,
      activeErVisits,
      totalPatients,
    };
  }

  async financial() {
    const invoices = await this.invoiceRepo.find();
    const paid = invoices.filter((i) => i.status === 'paid');
    const draft = invoices.filter((i) => i.status === 'draft');
    const totalRevenue = paid.reduce((sum, i) => sum + Number(i.total), 0);
    const pendingAmount = draft.reduce((sum, i) => sum + Number(i.total), 0);
    return {
      totalInvoices: invoices.length,
      paidInvoices: paid.length,
      draftInvoices: draft.length,
      totalRevenue,
      pendingAmount,
    };
  }

  async clinical() {
    const labOrders = await this.labOrderRepo.find();
    const completed = labOrders.filter((o) => o.status === 'completed').length;
    const pending = labOrders.filter((o) => o.status === 'ordered').length;
    return {
      totalLabOrders: labOrders.length,
      completedLabOrders: completed,
      pendingLabOrders: pending,
    };
  }

  async inventory() {
    const items = await this.itemRepo.find();
    const lowStock = items.filter((i) => i.quantity <= i.reorderLevel);
    const totalItems = items.length;
    const totalUnits = items.reduce((sum, i) => sum + i.quantity, 0);
    return { totalItems, totalUnits, lowStockCount: lowStock.length, lowStockItems: lowStock.map((i) => ({ sku: i.sku, name: i.name, quantity: i.quantity })) };
  }
}
