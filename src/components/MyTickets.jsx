import React, { useState } from 'react';
import { TicketStorage } from '../utils/ticketStorage';

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [email, setEmail] = useState('');

  const searchTickets = () => {
    if (email) {
      const participantTickets = TicketStorage.getParticipantTickets(email);
      setTickets(participantTickets);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-center mb-6">🎫 Mes Tickets</h1>
          
          <div className="max-w-md mx-auto mb-6">
            <label className="block text-sm font-medium mb-2">
              Entrez votre email pour voir vos tickets
            </label>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="votre@email.com"
                className="flex-1 p-3 border rounded-lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchTickets()}
              />
              <button
                onClick={searchTickets}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
              >
                Rechercher
              </button>
            </div>
          </div>

          {tickets.length > 0 && (
            <div>
              <div className="mb-4 text-center">
                <p className="text-lg font-semibold">
                  {tickets.length} ticket(s) trouvé(s) pour <strong>{email}</strong>
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {tickets.map(ticket => (
                  <div key={ticket.id} className={`border rounded-lg p-4 ${
                    ticket.isDrawn ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'
                  }`}>
                    <div className="text-center">
                      <div className="text-3xl mb-2">🎫</div>
                      <div className="text-2xl font-bold text-gray-800">#{ticket.number}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        Acheté le {new Date(ticket.purchaseDate).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500">Par {ticket.participant}</div>
                      <div className={`text-sm font-semibold mt-2 ${
                        ticket.isDrawn ? 'text-green-600' : 'text-blue-600'
                      }`}>
                        {ticket.isDrawn ? '✅ Tiré le ' + new Date(ticket.drawDate).toLocaleDateString() : '⏳ En attente'}
                      </div>
                      {ticket.drawResult && (
                        <div className="text-xs text-gray-500 mt-1">
                          {ticket.drawResult}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="text-center text-gray-600">
                {tickets.filter(t => t.isDrawn).length} / {tickets.length} tickets tirés
              </div>
            </div>
          )}

          {tickets.length === 0 && email && (
            <div className="text-center text-gray-500">
              Aucun ticket trouvé pour cet email
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyTickets;
