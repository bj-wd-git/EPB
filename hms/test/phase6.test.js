const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { createHmsStore } = require('../libs/common/src/store');
const { createPhase6Store } = require('../libs/common/src/phase6');

describe('HMS Phase 6 (Compliance, Security, Mobile)', () => {
  function setup() {
    const hms = createHmsStore();
    const p6 = createPhase6Store(hms);
    const patient = hms.registerPatient(
      { firstName: 'Phase', lastName: 'Six', dateOfBirth: '1991-12-05', phone: '+917777777777', branchId: 'b1' },
      'clerk-1',
    );
    return { hms, p6, patient };
  }

  it('reports and resolves compliance incident', () => {
    const { p6 } = setup();
    const incident = p6.reportIncident('Medication error', 'Wrong dose administered', 'high', 'nurse-1');
    assert.equal(incident.status, 'open');
    const resolved = p6.resolveIncident(incident.id, 'admin-1');
    assert.equal(resolved.status, 'resolved');
  });

  it('records patient consent and creates CAPA', () => {
    const { p6, patient } = setup();
    const consent = p6.recordConsent(patient.uhid, 'surgery', 'clerk-1');
    assert.equal(consent.status, 'signed');
    const incident = p6.reportIncident('Near miss', 'Slip hazard', 'low', 'nurse-1');
    const capa = p6.createCapa(incident.id, 'Install signage', 'facilities', 'admin-1');
    assert.equal(capa.status, 'open');
  });

  it('returns compliance audit summary', () => {
    const { p6 } = setup();
    p6.reportIncident('Test', 'Desc', 'low', 'nurse-1');
    const summary = p6.auditSummary();
    assert.ok(summary.standards.length > 0);
    assert.equal(summary.incidents.open, 1);
  });

  it('creates security session and API key', () => {
    const { p6 } = setup();
    const session = p6.createSession('doc-1', 'doctor');
    assert.equal(session.valid, true);
    const key = p6.createApiKey('Mobile BFF', 'doctor', 'admin-1');
    assert.ok(key.token.startsWith('hms_'));
  });

  it('logs access and registers mobile device', () => {
    const { p6, patient } = setup();
    const log = p6.logAccess('doc-1', 'GET', '/api/v1/patients');
    assert.equal(log.method, 'GET');
    const device = p6.registerDevice(patient.uhid, 'patient', 'ios', 'token-abc', 'patient-1');
    assert.equal(device.appType, 'patient');
  });

  it('syncs patient and nurse mobile data', () => {
    const { p6, patient } = setup();
    const sync = p6.patientSync(patient.uhid);
    assert.equal(sync.app, 'patient');
    const beds = [{ status: 'occupied' }, { status: 'available' }, { status: 'occupied' }];
    const nurse = p6.nurseSync(beds);
    assert.equal(nurse.ward.occupied, 2);
  });
});
