const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { createHmsStore } = require('../libs/common/src/store');
const { createPhase2Store } = require('../libs/common/src/phase2');

describe('HMS Phase 2 (Lab, Radiology, Pharmacy, Billing)', () => {
  function setup() {
    const hms = createHmsStore();
    const p2 = createPhase2Store(hms);
    const patient = hms.registerPatient(
      { firstName: 'Phase', lastName: 'Two', dateOfBirth: '1990-06-01', phone: '+913333333333', branchId: 'b1' },
      'clerk-1',
    );
    return { hms, p2, patient };
  }

  it('orders lab tests and records results', () => {
    const { p2, patient } = setup();
    const order = p2.orderLab(patient.uhid, ['CBC', 'LFT'], 'doc-1');
    assert.equal(order.status, 'ordered');
    const done = p2.completeLab(order.id, { CBC: '12.5', LFT: 'normal' });
    assert.equal(done.status, 'completed');
    assert.ok(done.results.CBC);
  });

  it('creates radiology order', () => {
    const { p2, patient } = setup();
    const order = p2.orderRadiology(patient.uhid, 'xray', 'doc-1');
    assert.equal(order.modality, 'xray');
  });

  it('prescribes and dispenses medication', () => {
    const { p2, patient } = setup();
    const rx = p2.prescribe(patient.uhid, [{ drug: 'Paracetamol', dose: '500mg', frequency: 'TDS' }], 'doc-1');
    assert.equal(rx.status, 'prescribed');
    const disp = p2.dispense(rx.id);
    assert.equal(disp.status, 'dispensed');
  });

  it('creates and pays invoice', () => {
    const { p2, patient } = setup();
    const inv = p2.createInvoice(patient.uhid, [{ description: 'Consultation', amount: 500 }], 'clerk-1');
    assert.equal(inv.total, 500);
    assert.equal(inv.status, 'draft');
    const paid = p2.payInvoice(inv.id);
    assert.equal(paid.status, 'paid');
  });
});
