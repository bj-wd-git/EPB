/** Phase 5 in-memory logic for tests (mirrors BFF domain rules) */
function createPhase5Store(baseStore) {
  const notifications = [];
  const teleconsults = [];

  return {
    notifications,
    teleconsults,

    patientDashboard(patientUhid) {
      const patient = baseStore.patients.find((p) => p.uhid === patientUhid);
      if (!patient) throw Object.assign(new Error('Patient not found'), { code: 'NOT_FOUND' });
      const appts = baseStore.appointments.filter((a) => a.patientUhid === patientUhid);
      return {
        uhid: patientUhid,
        upcomingAppointments: appts.filter((a) => a.status === 'confirmed').length,
        totalAppointments: appts.length,
        pendingBills: 0,
        prescriptions: 0,
        labReports: 0,
        scheduledTeleconsults: teleconsults.filter((t) => t.patientUhid === patientUhid && t.status === 'scheduled').length,
      };
    },

    bookTeleconsult(patientUhid, doctorId, scheduledAt, actorId) {
      const patient = baseStore.patients.find((p) => p.uhid === patientUhid);
      if (!patient) throw Object.assign(new Error('Patient not found'), { code: 'NOT_FOUND' });
      const session = { id: `tc-${teleconsults.length + 1}`, patientUhid, doctorId, scheduledAt, status: 'scheduled' };
      teleconsults.push(session);
      baseStore.audit.publish({ actorId, action: 'portal.teleconsult', resource: 'teleconsult_session', resourceId: session.id });
      return session;
    },

    doctorSchedule(doctorId) {
      const appts = baseStore.appointments.filter((a) => a.doctorId === doctorId);
      const tcs = teleconsults.filter((t) => t.doctorId === doctorId && t.status === 'scheduled');
      return { appointments: appts, teleconsults: tcs };
    },

    sendMessage(channel, recipient, body, actorId) {
      const msg = { id: `msg-${notifications.length + 1}`, channel, recipient, body, status: 'sent' };
      notifications.push(msg);
      baseStore.audit.publish({ actorId, action: 'comms.send', resource: 'notification', resourceId: msg.id });
      return msg;
    },

    appointmentReminder(appointmentId, actorId) {
      const appt = baseStore.appointments.find((a) => a.id === appointmentId);
      if (!appt) throw new Error('Not found');
      return this.sendMessage('sms', `patient:${appt.patientUhid}`, `Reminder for appointment ${appointmentId}`, actorId);
    },
  };
}

module.exports = { createPhase5Store };
