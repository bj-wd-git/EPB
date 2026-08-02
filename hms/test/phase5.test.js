const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { createHmsStore } = require('../libs/common/src/store');
const { createPhase5Store } = require('../libs/common/src/phase5');

describe('HMS Phase 5 (Patient Portal, Doctor Portal, Communications)', () => {
  function setup() {
    const hms = createHmsStore();
    const p5 = createPhase5Store(hms);
    const patient = hms.registerPatient(
      { firstName: 'Phase', lastName: 'Five', dateOfBirth: '1988-07-22', phone: '+916666666666', branchId: 'b1' },
      'clerk-1',
    );
    const appt = hms.bookAppointment(
      { patientUhid: patient.uhid, doctorId: 'd1', slotStart: '2026-08-15T09:00:00Z', slotEnd: '2026-08-15T09:15:00Z', type: 'scheduled' },
      'clerk-1',
    );
    return { hms, p5, patient, appt };
  }

  it('returns patient portal dashboard', () => {
    const { p5, patient } = setup();
    const dash = p5.patientDashboard(patient.uhid);
    assert.equal(dash.uhid, patient.uhid);
    assert.equal(dash.totalAppointments, 1);
  });

  it('books teleconsult session', () => {
    const { p5, patient } = setup();
    const session = p5.bookTeleconsult(patient.uhid, 'd1', '2026-08-16T10:00:00Z', 'patient-1');
    assert.equal(session.status, 'scheduled');
    assert.equal(p5.patientDashboard(patient.uhid).scheduledTeleconsults, 1);
  });

  it('returns doctor schedule with appointments', () => {
    const { p5 } = setup();
    const schedule = p5.doctorSchedule('d1');
    assert.equal(schedule.appointments.length, 1);
  });

  it('sends communication message', () => {
    const { p5 } = setup();
    const msg = p5.sendMessage('sms', '+919999999999', 'Test message', 'admin-1');
    assert.equal(msg.status, 'sent');
    assert.equal(msg.channel, 'sms');
  });

  it('sends appointment reminder', () => {
    const { p5, appt } = setup();
    const msg = p5.appointmentReminder(appt.id, 'clerk-1');
    assert.equal(msg.channel, 'sms');
    assert.ok(msg.body.includes(appt.id));
  });
});
