/** Phase 3 in-memory logic for tests (mirrors BFF domain rules) */
function createPhase3Store(baseStore) {
  const wards = [
    { id: 'w1', name: 'General Ward', branchId: 'b1' },
    { id: 'w2', name: 'ICU', branchId: 'b1' },
  ];
  const beds = [
    { id: 'b1', wardId: 'w1', code: 'A1', status: 'available' },
    { id: 'b2', wardId: 'w1', code: 'A2', status: 'available' },
    { id: 'b3', wardId: 'w2', code: 'ICU-1', status: 'available' },
  ];
  const admissions = [];
  const otBookings = [];
  const erVisits = [];

  return {
    wards,
    beds,
    admissions,
    otBookings,
    erVisits,

    occupancy() {
      const total = beds.length;
      const occupied = beds.filter((b) => b.status === 'occupied').length;
      return { total, occupied, available: total - occupied, occupancyRate: total ? Math.round((occupied / total) * 100) : 0 };
    },

    admit(patientUhid, bedId, actorId) {
      const patient = baseStore.patients.find((p) => p.uhid === patientUhid);
      if (!patient) throw Object.assign(new Error('Patient not found'), { code: 'NOT_FOUND' });
      const bed = beds.find((b) => b.id === bedId);
      if (!bed) throw Object.assign(new Error('Bed not found'), { code: 'NOT_FOUND' });
      if (bed.status !== 'available') throw Object.assign(new Error('Bed not available'), { code: 'CONFLICT' });
      bed.status = 'occupied';
      const admission = { id: `adm-${admissions.length + 1}`, patientUhid, bedId, status: 'admitted', admittedAt: new Date().toISOString() };
      admissions.push(admission);
      baseStore.audit.publish({ actorId, action: 'ipd.admit', resource: 'admission', resourceId: admission.id });
      return { admissionId: admission.id, bedCode: bed.code, status: admission.status };
    },

    discharge(admissionId, actorId) {
      const admission = admissions.find((a) => a.id === admissionId);
      if (!admission) throw new Error('Not found');
      if (admission.status === 'discharged') throw Object.assign(new Error('Already discharged'), { code: 'BAD_REQUEST' });
      admission.status = 'discharged';
      admission.dischargedAt = new Date().toISOString();
      const bed = beds.find((b) => b.id === admission.bedId);
      if (bed) bed.status = 'cleaning';
      baseStore.audit.publish({ actorId, action: 'ipd.discharge', resource: 'admission', resourceId: admissionId });
      return { admissionId, status: admission.status };
    },

    transfer(admissionId, newBedId, actorId) {
      const admission = admissions.find((a) => a.id === admissionId);
      if (!admission || admission.status !== 'admitted') throw Object.assign(new Error('Not admitted'), { code: 'BAD_REQUEST' });
      const newBed = beds.find((b) => b.id === newBedId);
      if (!newBed || newBed.status !== 'available') throw Object.assign(new Error('Target bed unavailable'), { code: 'CONFLICT' });
      const oldBed = beds.find((b) => b.id === admission.bedId);
      if (oldBed) oldBed.status = 'cleaning';
      newBed.status = 'occupied';
      admission.bedId = newBedId;
      baseStore.audit.publish({ actorId, action: 'ipd.transfer', resource: 'admission', resourceId: admissionId });
      return { admissionId, bedId: newBedId, bedCode: newBed.code };
    },

    bookOt(patientUhid, surgeonId, procedure, scheduledAt, actorId) {
      const patient = baseStore.patients.find((p) => p.uhid === patientUhid);
      if (!patient) throw Object.assign(new Error('Patient not found'), { code: 'NOT_FOUND' });
      const booking = { id: `ot-${otBookings.length + 1}`, patientUhid, surgeonId, procedure, scheduledAt, status: 'scheduled' };
      otBookings.push(booking);
      baseStore.audit.publish({ actorId, action: 'ot.book', resource: 'ot_booking', resourceId: booking.id });
      return booking;
    },

    completeOt(id) {
      const booking = otBookings.find((b) => b.id === id);
      if (!booking) throw new Error('Not found');
      booking.status = 'completed';
      return booking;
    },

    registerEr({ patientUhid, walkInName, chiefComplaint }, actorId) {
      if (!patientUhid && !walkInName) throw Object.assign(new Error('patientUhid or walkInName required'), { code: 'BAD_REQUEST' });
      if (patientUhid) {
        const patient = baseStore.patients.find((p) => p.uhid === patientUhid);
        if (!patient) throw Object.assign(new Error('Patient not found'), { code: 'NOT_FOUND' });
      }
      const visit = { id: `er-${erVisits.length + 1}`, patientUhid: patientUhid || null, walkInName: walkInName || null, chiefComplaint, triageLevel: 'pending', status: 'active' };
      erVisits.push(visit);
      baseStore.audit.publish({ actorId, action: 'er.register', resource: 'er_visit', resourceId: visit.id });
      return visit;
    },

    triageEr(id, triageLevel, actorId) {
      const visit = erVisits.find((v) => v.id === id);
      if (!visit) throw new Error('Not found');
      visit.triageLevel = triageLevel;
      baseStore.audit.publish({ actorId, action: 'er.triage', resource: 'er_visit', resourceId: id });
      return visit;
    },
  };
}

module.exports = { createPhase3Store };
