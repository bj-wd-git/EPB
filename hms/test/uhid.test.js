const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { formatUhid, createSequenceStore, detectDuplicate } = require('../libs/common/src/uhid');

describe('UHID generation (TP-001)', () => {
  it('formats UHID with branch code and padded sequence', () => {
    assert.equal(formatUhid('brn', 1), 'HMS-BRN-000001');
    assert.equal(formatUhid('MAIN', 42), 'HMS-MAIN-000042');
  });

  it('generates unique sequential UHIDs per branch', () => {
    const store = createSequenceStore();
    const a = store.next('BRN');
    const b = store.next('BRN');
    const c = store.next('OTH');
    assert.equal(a, 'HMS-BRN-000001');
    assert.equal(b, 'HMS-BRN-000002');
    assert.equal(c, 'HMS-OTH-000001');
  });

  it('detects duplicate patients', () => {
    const existing = [{ phone: '+911234567890', firstName: 'Jane', lastName: 'Doe', dateOfBirth: '1990-01-15' }];
    const dup = detectDuplicate(existing, {
      phone: '+911234567890',
      firstName: 'jane',
      lastName: 'doe',
      dateOfBirth: '1990-01-15',
    });
    assert.ok(dup);
    const unique = detectDuplicate(existing, {
      phone: '+919999999999',
      firstName: 'John',
      lastName: 'Smith',
      dateOfBirth: '1985-05-20',
    });
    assert.equal(unique, undefined);
  });
});
