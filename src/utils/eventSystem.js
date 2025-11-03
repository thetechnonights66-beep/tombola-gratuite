// src/utils/eventSystem.js
// Système d'événements pour la communication entre composants

export const EventSystem = {
  // Événements disponibles
  EVENTS: {
    TICKETS_UPDATED: 'ticketsUpdated',
    WINNERS_UPDATED: 'winnersUpdated', 
    PARTICIPANTS_UPDATED: 'participantsUpdated',
    REFERRALS_UPDATED: 'referralsUpdated',
    DRAW_RESET: 'drawReset',
    PARTICIPANTS_RESET: 'participantsReset',
    PRIZES_UPDATED: 'prizesUpdated'
  },

  // Émettre un événement
  emit(eventName, data = null) {
    if (typeof window !== 'undefined') {
      console.log(`🎯 EventSystem: Emitting ${eventName}`, data);
      window.dispatchEvent(new CustomEvent(eventName, { detail: data }));
    }
  },

  // Écouter un événement
  on(eventName, callback) {
    if (typeof window !== 'undefined') {
      console.log(`🎯 EventSystem: Listening to ${eventName}`);
      window.addEventListener(eventName, callback);
    }
  },

  // Arrêter d'écouter un événement
  off(eventName, callback) {
    if (typeof window !== 'undefined') {
      console.log(`🎯 EventSystem: Stopped listening to ${eventName}`);
      window.removeEventListener(eventName, callback);
    }
  },

  // Émettre un événement de mise à jour des tickets
  emitTicketsUpdated(ticketsCount = null) {
    this.emit(this.EVENTS.TICKETS_UPDATED, { count: ticketsCount, timestamp: new Date().toISOString() });
  },

  // Émettre un événement de mise à jour des gagnants
  emitWinnersUpdated(winnersCount = null) {
    this.emit(this.EVENTS.WINNERS_UPDATED, { count: winnersCount, timestamp: new Date().toISOString() });
  },

  // Émettre un événement de mise à jour des participants
  emitParticipantsUpdated(participantsCount = null) {
    this.emit(this.EVENTS.PARTICIPANTS_UPDATED, { count: participantsCount, timestamp: new Date().toISOString() });
  },

  // Émettre un événement de mise à jour des parrainages
  emitReferralsUpdated(referralsCount = null) {
    this.emit(this.EVENTS.REFERRALS_UPDATED, { count: referralsCount, timestamp: new Date().toISOString() });
  },

  // Émettre un événement de réinitialisation du tirage
  emitDrawReset(reason = 'manual') {
    this.emit(this.EVENTS.DRAW_RESET, { reason, timestamp: new Date().toISOString() });
  },

  // Émettre un événement de réinitialisation des participants
  emitParticipantsReset(reason = 'manual') {
    this.emit(this.EVENTS.PARTICIPANTS_RESET, { reason, timestamp: new Date().toISOString() });
  },

  // Émettre un événement de mise à jour des lots
  emitPrizesUpdated(prizesCount = null) {
    this.emit(this.EVENTS.PRIZES_UPDATED, { count: prizesCount, timestamp: new Date().toISOString() });
  }
};
