const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { createHmsStore } = require('../libs/common/src/store');

describe('HMS integration (TP-002, TP-003, TP-004)', () => {
  it('registers patient and books appointment', () => {
    const hms = createHmsStore();
    const patient = hms.registerPatient(
      {
        firstName: 'Jane',
        lastName: 'Doe',
        dateOfBirth: '1990-01-15',
        phone: '+911234567890',
        branchId: 'b1',
      },
      'clerk-1',
    );
    assert.match(patient.uhid, /^HMS-BRN-\d{6}$/);
    const appt = hms.bookAppointment(
      {
        patientUhid: patient.uhid,
        doctorId: 'd1',
        slotStart: '2026-08-02T09:00:00Z',
        slotEnd: '2026-08-02T09:15:00Z',
        type: 'scheduled',
      },
      'clerk-1',
    );
    assert.equal(appt.status, 'confirmed');
    const emr = hms.getEmr(patient.uhid);
    assert.equal(emr.visits.length, 1);
  });

  it('returns 409 on double-book same slot', () => {
    const hms = createHmsStore();
    const patient = hms.registerPatient(
      { firstName: 'A', lastName: 'B', dateOfBirth: '1990-01-01', phone: '+911111111111', branchId: 'b1' },
      'clerk-1',
    );
    const slot = { patientUhid: patient.uhid, doctorId: 'd1', slotStart: '2026-08-02T10:00:00Z', slotEnd: '2026-08-02T10:15:00Z', type: 'scheduled' };
    hms.bookAppointment(slot, 'clerk-1');
    assert.throws(() => hms.bookAppointment(slot, 'clerk-1'), (e) => e.code === 'CONFLICT');
  });

  it('appends clinical note with author and timestamp', () => {
    const hms = createHmsStore();
    const patient = hms.registerPatient(
      { firstName: 'C', lastName: 'D', dateOfBirth: '1985-05-20', phone: '+912222222222', branchId: 'b1' },
      'clerk-1',
    );
    const note = hms.addClinicalNote(patient.uhid, { authorId: 'doc-1', text: 'Patient stable' });
    assert.equal(note.authorId, 'doc-1');
    assert.ok(note.createdAt);
    assert.equal(hms.getEmr(patient.uhid).notes.length, 1);
  });
});
