import React, { useState, useEffect } from 'react';
import { TicketStorage } from '../utils/ticketStorage';

const Confirmation = () => {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    // Simuler l'achat de tickets pour le test
    const testTickets = [
      {
        id: 1,
        number: 1234,
        purchaseDate: new Date().toISOString(),
        price: 5,
        participant: "Test User",
        email: "test@email.com",
        isDrawn: false
      },
      {
        id: 2,
        number: 5678,
        purchaseDate: new Date().toISOString(),
        price: 5,
        participant: "Test User",
        email: "test@email.com",
        isDrawn: false
      }
    ];
    setTickets(testTickets);
  }, []);

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
              <div className="text-2xl font-bold text-gray-800 mb-2">#{ticket.number}</div>
              <div className="text-sm text-gray-500 mb-1">Acheté le {new Date(ticket.purchaseDate).toLocaleDateString()}</div>
              <div className={`text-sm font-semibold ${
                ticket.isDrawn ? 'text-green-600' : 'text-blue-600'
              }`}>
                {ticket.isDrawn ? '🎊 Déjà tiré' : '⏳ En attente'}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <button 
            onClick={() => (window.location.hash = '#/')}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 mr-4"
          >
            Retour à l'accueil
          </button>
          <button 
            onClick={() => (window.location.hash = '#/my-tickets')}
            className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600"
          >
            Mes tickets
          </button>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
