export function formatUhid(branchCode: string, sequence: number): string {
  const code = String(branchCode).toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
  if (!code) throw new Error('Invalid branch code');
  if (!Number.isInteger(sequence) || sequence < 1) throw new Error('Invalid sequence');
  return `HMS-${code}-${String(sequence).padStart(6, '0')}`;
}

export function normalizeName(firstName: string, lastName: string): string {
  const norm = (s: string) => String(s || '').trim().toLowerCase();
  return `${norm(firstName)} ${norm(lastName)}`;
}
