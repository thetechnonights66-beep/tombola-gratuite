import React, { useState, useEffect } from 'react';
import { TicketStorage } from '../utils/ticketStorage';

const Confirmation = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Récupérer les tickets depuis l'URL ou le storage
    const urlParams = new URLSearchParams(window.location.hash.split('?')[1]);
    const ticketNumbers = urlParams.get('tickets');
    
    if (ticketNumbers) {
      const numbers = ticketNumbers.split(',');
      const allTickets = TicketStorage.getTickets();
      const purchasedTickets = allTickets.filter(ticket => 
        numbers.includes(ticket.number.toString())
      );
      setTickets(purchasedTickets);
    }
    
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg">Chargement de vos tickets...</p>
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
              <div className="text-2xl font-bold text-gray-800 mb-2">#{ticket.number}</div>
              <div className="text-sm text-gray-500 mb-1">Acheté le {new Date(ticket.purchaseDate).toLocaleDateString()}</div>
              <div className={`text-sm font-semibold ${
                ticket.isDrawn ? 'text-green-600' : 'text-blue-600'
              }`}>
                {ticket.isDrawn ? '🎊 Déjà tiré' : '⏳ En attente'}
              </div>
              {ticket.drawResult && (
                <div className="text-xs text-gray-400 mt-1">
                  Résultat: {ticket.drawResult}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <h3 className="text-xl font-semibold mb-4">📧 Email de confirmation envoyé</h3>
          <p className="text-gray-600 mb-4">
            Un récapitulatif de votre achat avec vos numéros de tickets a été envoyé à votre adresse email.
          </p>
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
