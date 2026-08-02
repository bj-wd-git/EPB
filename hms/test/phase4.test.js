const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { createHmsStore } = require('../libs/common/src/store');
const { createPhase2Store } = require('../libs/common/src/phase2');
const { createPhase4Store } = require('../libs/common/src/phase4');

describe('HMS Phase 4 (Insurance, HR, Inventory, Reporting)', () => {
  function setup() {
    const hms = createHmsStore();
    const p2 = createPhase2Store(hms);
    const p4 = createPhase4Store(hms);
    const patient = hms.registerPatient(
      { firstName: 'Phase', lastName: 'Four', dateOfBirth: '1992-11-20', phone: '+915555555555', branchId: 'b1' },
      'clerk-1',
    );
    return { hms, p2, p4, patient };
  }

  it('creates insurance policy and submits claim', () => {
    const { p4, patient } = setup();
    const policy = p4.createPolicy(patient.uhid, 'Star Health', 'POL-12345', 500000, 'clerk-1');
    assert.equal(policy.status, 'active');
    const claim = p4.submitClaim(patient.uhid, policy.id, 15000, 'clerk-1');
    assert.equal(claim.status, 'submitted');
    const settled = p4.settleClaim(claim.id);
    assert.equal(settled.status, 'settled');
  });

  it('manages employee leave workflow', () => {
    const { p4 } = setup();
    const emp = p4.createEmployee({ employeeCode: 'EMP-099', firstName: 'Test', lastName: 'User', department: 'IT', designation: 'Developer' });
    const leave = p4.requestLeave(emp.id, 'casual', '2026-08-10', '2026-08-12', 'emp-1');
    assert.equal(leave.status, 'pending');
    const approved = p4.approveLeave(leave.id);
    assert.equal(approved.status, 'approved');
  });

  it('receives and consumes inventory stock', () => {
    const { p4 } = setup();
    const item = p4.receiveStock('i1', 10, 'admin-1');
    assert.equal(item.quantity, 60);
    const consumed = p4.consumeStock('i1', 5, 'nurse-1');
    assert.equal(consumed.quantity, 55);
  });

  it('flags low stock items', () => {
    const { p4 } = setup();
    const low = p4.lowStock();
    assert.ok(low.some((i) => i.sku === 'BND-ROLL'));
  });

  it('generates operational and financial reports', () => {
    const { hms, p2, p4, patient } = setup();
    const inv = p2.createInvoice(patient.uhid, [{ description: 'Consultation', amount: 500 }], 'clerk-1');
    p2.payInvoice(inv.id);
    const ops = p4.operationalReport();
    assert.equal(ops.totalPatients, 1);
    const fin = p4.financialReport(p2.invoices);
    assert.equal(fin.totalRevenue, 500);
  });
});
