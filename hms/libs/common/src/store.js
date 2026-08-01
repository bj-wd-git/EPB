/**
 * HMS Phase 1 in-memory domain store (scaffold for NestJS services)
 * Maps to services: registration, appointment, emr, configuration
 */
const { createSequenceStore, detectDuplicate } = require('./uhid');
const { createAuditPublisher } = require('./audit');

function createHmsStore() {
  const uhidSeq = createSequenceStore();
  const audit = createAuditPublisher();
  const patients = [];
  const appointments = [];
  const emrProfiles = new Map();
  const branches = [{ id: 'b1', code: 'BRN', name: 'Main Branch' }];
  const doctors = [{ id: 'd1', branchId: 'b1', name: 'Dr. Smith', department: 'General' }];

  return {
    branches,
    doctors,
    patients,
    appointments,
    audit,

    registerPatient(input, actorId) {
      const dup = detectDuplicate(patients, input);
      if (dup && !input.overrideDuplicate) {
        const err = new Error('Duplicate patient detected');
        err.code = 'DUPLICATE';
        err.existingUhid = dup.uhid;
        throw err;
      }
      const branch = branches.find((b) => b.id === input.branchId);
      if (!branch) throw Object.assign(new Error('Branch not found'), { code: 'NOT_FOUND' });
      const uhid = uhidSeq.next(branch.code);
      const patient = {
        id: `p-${patients.length + 1}`,
        uhid,
        ...input,
        createdAt: new Date().toISOString(),
      };
      patients.push(patient);
      emrProfiles.set(uhid, { uhid, allergies: [], vitals: [], diagnoses: [], notes: [], visits: [] });
      audit.publish({ actorId, action: 'patient.create', resource: 'patient', resourceId: patient.id, branchId: branch.id });
      return patient;
    },

    bookAppointment(input, actorId) {
      const patient = patients.find((p) => p.uhid === input.patientUhid);
      if (!patient) throw Object.assign(new Error('Patient not found'), { code: 'NOT_FOUND' });
      const conflict = appointments.find(
        (a) => a.doctorId === input.doctorId && a.slotStart === input.slotStart && a.status !== 'cancelled',
      );
      if (conflict) {
        const err = new Error('Slot conflict');
        err.code = 'CONFLICT';
        err.appointmentId = conflict.id;
        throw err;
      }
      const appt = {
        id: `a-${appointments.length + 1}`,
        patientId: patient.id,
        status: 'confirmed',
        queuePosition: input.type === 'walk-in' ? appointments.length + 1 : null,
        ...input,
      };
      appointments.push(appt);
      const emr = emrProfiles.get(patient.uhid);
      emr.visits.push({ appointmentId: appt.id, date: input.slotStart.slice(0, 10) });
      audit.publish({ actorId, action: 'appointment.book', resource: 'appointment', resourceId: appt.id, branchId: patient.branchId });
      return appt;
    },

    getEmr(uhid) {
      const profile = emrProfiles.get(uhid);
      if (!profile) throw Object.assign(new Error('Patient not found'), { code: 'NOT_FOUND' });
      return profile;
    },

    addClinicalNote(uhid, { authorId, text }) {
      const profile = emrProfiles.get(uhid);
      if (!profile) throw Object.assign(new Error('Patient not found'), { code: 'NOT_FOUND' });
      const note = { authorId, text, createdAt: new Date().toISOString() };
      profile.notes.push(note);
      return note;
    },
  };
}

module.exports = { createHmsStore };
