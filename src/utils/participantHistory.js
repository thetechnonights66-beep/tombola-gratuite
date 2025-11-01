// Système de sauvegarde et d'historique des participants
export const ParticipantHistory = {
  
  // ✅ SAUVEGARDER LES PARTICIPANTS AVANT RÉINITIALISATION
  saveParticipantsSnapshot(participants, winners, reason = 'reset_manual') {
    const snapshot = {
      id: `snapshot_${Date.now()}`,
      timestamp: new Date().toISOString(),
      reason: reason,
      totalParticipants: participants.length,
      totalTickets: participants.reduce((sum, p) => sum + p.tickets, 0),
      totalRevenue: participants.reduce((sum, p) => sum + p.totalSpent, 0),
      winnersCount: winners.length,
      participants: participants.map(p => ({
        id: p.id,
        name: p.name,
        email: p.email,
        tickets: p.tickets,
        ticketNumbers: p.ticketNumbers,
        totalSpent: p.totalSpent,
        firstPurchase: p.firstPurchase
      })),
      winners: winners.map(w => ({
        participant: w.participant,
        ticketNumber: w.ticketNumber,
        prize: w.prize,
        time: w.time
      }))
    };

    // Récupérer les snapshots existants
    const existingSnapshots = this.getSnapshots();
    existingSnapshots.push(snapshot);
    
    // Garder seulement les 10 derniers snapshots
    const recentSnapshots = existingSnapshots.slice(-10);
    
    localStorage.setItem('tombolaSnapshots', JSON.stringify(recentSnapshots));
    
    console.log('💾 Snapshot sauvegardé:', snapshot.id);
    return snapshot.id;
  },

  // ✅ RÉCUPÉRER TOUS LES SNAPSHOTS
  getSnapshots() {
    const snapshots = localStorage.getItem('tombolaSnapshots');
    return snapshots ? JSON.parse(snapshots) : [];
  },

  // ✅ RÉCUPÉRER UN SNAPSHOT SPÉCIFIQUE
  getSnapshot(snapshotId) {
    const snapshots = this.getSnapshots();
    return snapshots.find(s => s.id === snapshotId);
  },

  // ✅ RESTAURER UN SNAPSHOT
  restoreSnapshot(snapshotId) {
    const snapshot = this.getSnapshot(snapshotId);
    if (!snapshot) {
      throw new Error('Snapshot non trouvé');
    }

    // Restaurer les tickets
    const tickets = [];
    snapshot.participants.forEach(participant => {
      participant.ticketNumbers.forEach(ticketNumber => {
        tickets.push({
          id: `${participant.id}_${ticketNumber}`,
          number: ticketNumber,
          purchaseDate: participant.firstPurchase,
          price: 5,
          participant: participant.name,
          email: participant.email,
          isDrawn: false,
          drawResult: null
        });
      });
    });

    localStorage.setItem('tombolaTickets', JSON.stringify(tickets));

    // Restaurer les gagnants
    localStorage.setItem('tombolaWinners', JSON.stringify(snapshot.winners));

    console.log('🔄 Snapshot restauré:', snapshotId);
    return snapshot;
  },

  // ✅ GÉNÉRER UN RAPPORT DÉTAILLÉ
  generateReport(snapshotId) {
    const snapshot = this.getSnapshot(snapshotId);
    if (!snapshot) return null;

    return {
      ...snapshot,
      report: {
        participantsByTickets: snapshot.participants.reduce((acc, p) => {
          acc[p.tickets] = (acc[p.tickets] || 0) + 1;
          return acc;
        }, {}),
        topSpenders: snapshot.participants
          .sort((a, b) => b.totalSpent - a.totalSpent)
          .slice(0, 5),
        ticketsPerParticipant: {
          min: Math.min(...snapshot.participants.map(p => p.tickets)),
          max: Math.max(...snapshot.participants.map(p => p.tickets)),
          average: (snapshot.totalTickets / snapshot.participants.length).toFixed(2)
        }
      }
    };
  },

  // ✅ EXPORTER EN CSV
  exportToCSV(snapshotId) {
    const snapshot = this.getSnapshot(snapshotId);
    if (!snapshot) return null;

    let csv = 'Nom,Email,Tickets Achetés,Total Dépensé,Numéros de Tickets,Premier Achat\n';
    
    snapshot.participants.forEach(participant => {
      csv += `"${participant.name}","${participant.email}",${participant.tickets},${participant.totalSpent},"${participant.ticketNumbers.join(', ')}","${new Date(participant.firstPurchase).toLocaleDateString()}"\n`;
    });

    return csv;
  },

  // ✅ SUPPRIMER UN SNAPSHOT
  deleteSnapshot(snapshotId) {
    const snapshots = this.getSnapshots();
    const filteredSnapshots = snapshots.filter(s => s.id !== snapshotId);
    localStorage.setItem('tombolaSnapshots', JSON.stringify(filteredSnapshots));
    return filteredSnapshots;
  }
};
