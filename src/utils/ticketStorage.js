// Gestion du stockage des tickets dans le localStorage
export const TicketStorage = {
  // Récupérer tous les tickets
  getTickets() {
    const tickets = localStorage.getItem('tombolaTickets');
    return tickets ? JSON.parse(tickets) : [];
  },

  // Ajouter un nouveau ticket
  addTicket(ticketData) {
    const tickets = this.getTickets();
    const newTicket = {
      id: Date.now() + Math.random(),
      number: ticketData.number,
      purchaseDate: new Date().toISOString(),
      price: ticketData.price,
      participant: ticketData.participant || 'Anonyme',
      email: ticketData.email || '',
      isDrawn: false,
      drawResult: null
    };
    
    tickets.push(newTicket);
    localStorage.setItem('tombolaTickets', JSON.stringify(tickets));
    return newTicket;
  },

  // Marquer un ticket comme tiré
  markAsDrawn(ticketNumber, result) {
    const tickets = this.getTickets();
    const updatedTickets = tickets.map(ticket => {
      if (ticket.number === ticketNumber) {
        return {
          ...ticket,
          isDrawn: true,
          drawResult: result,
          drawDate: new Date().toISOString()
        };
      }
      return ticket;
    });
    localStorage.setItem('tombolaTickets', JSON.stringify(updatedTickets));
  },

  // Récupérer les tickets d'un participant
  getParticipantTickets(email) {
    const tickets = this.getTickets();
    return tickets.filter(ticket => ticket.email === email);
  },

  // ✅ NOUVELLE FONCTION : Récupérer tous les participants uniques
  getAllParticipants() {
    const tickets = this.getTickets();
    const participantsMap = new Map();
    
    tickets.forEach(ticket => {
      if (ticket.email && ticket.participant && ticket.participant !== 'Anonyme') {
        const key = `${ticket.email}-${ticket.participant}`;
        
        if (!participantsMap.has(key)) {
          participantsMap.set(key, {
            id: ticket.id,
            name: ticket.participant,
            email: ticket.email,
            tickets: 1,
            ticketNumbers: [ticket.number],
            firstPurchase: ticket.purchaseDate,
            totalSpent: ticket.price
          });
        } else {
          // Mettre à jour le participant existant
          const existing = participantsMap.get(key);
          existing.tickets += 1;
          existing.ticketNumbers.push(ticket.number);
          existing.totalSpent += ticket.price;
        }
      }
    });
    
    return Array.from(participantsMap.values());
  },

  // ✅ NOUVELLE FONCTION : Statistiques en temps réel
  getLiveStats() {
    const tickets = this.getTickets();
    const participants = this.getAllParticipants();
    
    // Tickets des dernières 24h
    const recentTickets = tickets.filter(ticket => {
      const ticketTime = new Date(ticket.purchaseDate);
      const now = new Date();
      return (now - ticketTime) < (24 * 60 * 60 * 1000); // 24h
    });

    return {
      totalParticipants: participants.length,
      totalTickets: tickets.length,
      totalRevenue: tickets.reduce((sum, ticket) => sum + ticket.price, 0),
      recentTickets: recentTickets.length,
      recentRevenue: recentTickets.reduce((sum, ticket) => sum + ticket.price, 0)
    };
  },

  // ✅ NOUVELLE FONCTION : Vider tous les tickets (pour les tests)
  clearAllTickets() {
    localStorage.removeItem('tombolaTickets');
  },

  // ✅ NOUVELLE FONCTION : Générer des tickets de test
  generateTestTickets(count = 10) {
    const firstNames = ['Jean', 'Marie', 'Pierre', 'Sophie', 'Paul', 'Julie', 'Marc', 'Laura'];
    const lastNames = ['Dupont', 'Martin', 'Bernard', 'Thomas', 'Robert', 'Richard', 'Petit', 'Moreau'];
    
    const testTickets = Array.from({ length: count }, (_, i) => {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const ticketCount = Math.floor(Math.random() * 3) + 1; // 1-3 tickets
      
      return {
        id: Date.now() + i,
        number: Math.floor(1000 + Math.random() * 9000),
        purchaseDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(), // Derniers 7 jours
        price: 5 * ticketCount,
        participant: `${firstName} ${lastName}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
        isDrawn: false,
        drawResult: null
      };
    });

    // Ajouter aux tickets existants
    const existingTickets = this.getTickets();
    const allTickets = [...existingTickets, ...testTickets];
    localStorage.setItem('tombolaTickets', JSON.stringify(allTickets));
    
    return testTickets;
  }
};
