import React, { useState } from 'react';

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [email, setEmail] = useState('');

  const searchTickets = () => {
    // Données de test
    const testTickets = [
      {
        id: 1,
        number: 1234,
        purchaseDate: new Date().toISOString(),
        participant: "Jean Dupont",
        email: "jean@email.com",
        isDrawn: false
      },
      {
        id: 2,
        number: 5678,
        purchaseDate: new Date().toISOString(),
        participant: "Jean Dupont",
        email: "jean@email.com", 
        isDrawn: true,
        drawResult: "Gagnant - Lot 1",
        drawDate: new Date().toISOString()
      }
    ];
    
    if (email === "jean@email.com") {
      setTickets(testTickets);
    } else {
      setTickets([]);
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
                placeholder="jean@email.com"
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
            <p className="text-sm text-gray-500 mt-2">
              Testez avec : <strong>jean@email.com</strong>
            </p>
          </div>

          {tickets.length > 0 && (
            <div>
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
