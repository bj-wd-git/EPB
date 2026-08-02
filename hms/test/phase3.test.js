const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { createHmsStore } = require('../libs/common/src/store');
const { createPhase3Store } = require('../libs/common/src/phase3');

describe('HMS Phase 3 (Ward, IPD, OT, Emergency)', () => {
  function setup() {
    const hms = createHmsStore();
    const p3 = createPhase3Store(hms);
    const patient = hms.registerPatient(
      { firstName: 'Phase', lastName: 'Three', dateOfBirth: '1985-03-15', phone: '+914444444444', branchId: 'b1' },
      'clerk-1',
    );
    return { hms, p3, patient };
  }

  it('tracks ward occupancy', () => {
    const { p3 } = setup();
    const occ = p3.occupancy();
    assert.equal(occ.total, 3);
    assert.equal(occ.occupied, 0);
  });

  it('admits patient and discharges', () => {
    const { p3, patient } = setup();
    const adm = p3.admit(patient.uhid, 'b1', 'nurse-1');
    assert.equal(adm.status, 'admitted');
    assert.equal(p3.occupancy().occupied, 1);
    const out = p3.discharge(adm.admissionId, 'nurse-1');
    assert.equal(out.status, 'discharged');
  });

  it('transfers patient to new bed', () => {
    const { p3, patient } = setup();
    const adm = p3.admit(patient.uhid, 'b1', 'nurse-1');
    const xfer = p3.transfer(adm.admissionId, 'b2', 'nurse-1');
    assert.equal(xfer.bedCode, 'A2');
  });

  it('books and completes OT procedure', () => {
    const { p3, patient } = setup();
    const booking = p3.bookOt(patient.uhid, 'd1', 'Appendectomy', '2026-08-10T10:00:00Z', 'doc-1');
    assert.equal(booking.status, 'scheduled');
    const done = p3.completeOt(booking.id);
    assert.equal(done.status, 'completed');
  });

  it('registers ER visit and triages', () => {
    const { p3, patient } = setup();
    const visit = p3.registerEr({ patientUhid: patient.uhid, chiefComplaint: 'Chest pain' }, 'clerk-1');
    assert.equal(visit.triageLevel, 'pending');
    const triaged = p3.triageEr(visit.id, '2', 'nurse-1');
    assert.equal(triaged.triageLevel, '2');
  });

  it('registers walk-in ER visit', () => {
    const { p3 } = setup();
    const visit = p3.registerEr({ walkInName: 'John Doe', chiefComplaint: 'Fall injury' }, 'clerk-1');
    assert.equal(visit.walkInName, 'John Doe');
    assert.equal(visit.status, 'active');
  });
});
