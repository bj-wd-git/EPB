/**
 * HMS UHID generator — ADR-011
 * Format: HMS-{branchCode}-{sequence}
 */
function formatUhid(branchCode, sequence) {
  const code = String(branchCode).toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
  if (!code) throw new Error('Invalid branch code');
  const seq = Number(sequence);
  if (!Number.isInteger(seq) || seq < 1) throw new Error('Invalid sequence');
  return `HMS-${code}-${String(seq).padStart(6, '0')}`;
}

function createSequenceStore() {
  const counters = new Map();
  return {
    next(branchCode) {
      const key = String(branchCode).toUpperCase();
      const current = counters.get(key) || 0;
      const next = current + 1;
      counters.set(key, next);
      return formatUhid(key, next);
    },
  };
}

function detectDuplicate(candidates, { phone, firstName, lastName, dateOfBirth }) {
  const norm = (s) => String(s || '').trim().toLowerCase();
  const name = `${norm(firstName)} ${norm(lastName)}`;
  return candidates.find(
    (p) =>
      norm(p.phone) === norm(phone) &&
      norm(`${p.firstName} ${p.lastName}`) === name &&
      p.dateOfBirth === dateOfBirth,
  );
}

module.exports = { formatUhid, createSequenceStore, detectDuplicate };
