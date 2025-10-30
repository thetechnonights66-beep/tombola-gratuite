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
      isDrawn: false, // Nouveau champ pour suivre si le ticket a été tiré
      drawResult: null // Résultat du tirage
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

  // Vérifier si un numéro a déjà été tiré
  isNumberDrawn(ticketNumber) {
    const tickets = this.getTickets();
    const ticket = tickets.find(t => t.number === ticketNumber);
    return ticket ? ticket.isDrawn : false;
  }
};
