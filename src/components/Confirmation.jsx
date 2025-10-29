import React, { useState, useEffect } from 'react';

const Confirmation = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generatedTickets = Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      number: Math.floor(Math.random() * 1000) + 1,
      date: new Date().toLocaleDateString()
    }));
    
    setTimeout(() => {
      setTickets(generatedTickets);
      setLoading(false);
    }, 1500);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg">Génération de vos tickets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-500 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-xl p-8 text-center mb-8">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Paiement Réussi !</h1>
          <p className="text-xl text-gray-600 mb-2">Vos tickets ont été générés avec succès</p>
          <p className="text-gray-500">Tirage le 25 Décembre 2024 - Bonne chance !</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {tickets.map(ticket => (
            <div key={ticket.id} className="bg-white rounded-lg shadow-lg p-6 text-center transform hover:scale-105 transition">
              <div className="text-4xl mb-2">🎫</div>
              <div className="text-2xl font-bold text-gray-800 mb-2">#{ticket.number.toString().padStart(3, '0')}</div>
              <div className="text-sm text-gray-500">Ticket {ticket.id}</div>
              <div className="text-xs text-gray-400 mt-2">{ticket.date}</div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <button 
            onClick={() => window.location.href = '/'}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
