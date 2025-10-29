import React, { useState } from 'react';

const BuyTickets = () => {
  const [ticketCount, setTicketCount] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('card');

  const handlePurchase = () => {
    alert(`Achat simulé de ${ticketCount} ticket(s) pour ${ticketCount * 5}€ !`);
    window.location.hash = '#/';
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-3xl font-bold text-center mb-6">Acheter des tickets</h2>
        
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Nombre de tickets</label>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
              className="w-10 h-10 bg-gray-200 rounded-full hover:bg-gray-300"
            >-</button>
            <span className="text-2xl font-bold">{ticketCount}</span>
            <button 
              onClick={() => setTicketCount(ticketCount + 1)}
              className="w-10 h-10 bg-gray-200 rounded-full hover:bg-gray-300"
            >+</button>
          </div>
          <p className="text-gray-600 mt-2">Prix total: {ticketCount * 5}€</p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Méthode de paiement</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setPaymentMethod('card')}
              className={`p-4 border rounded-lg ${
                paymentMethod === 'card' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
              }`}
            >
              💳 Carte
            </button>
            <button
              onClick={() => setPaymentMethod('crypto')}
              className={`p-4 border rounded-lg ${
                paymentMethod === 'crypto' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
              }`}
            >
              ₿ Crypto
            </button>
          </div>
        </div>

        {paymentMethod === 'card' && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold mb-2">💳 Paiement par carte (simulation)</h4>
            <input type="text" placeholder="Numéro de carte" className="w-full p-2 border rounded mb-2" defaultValue="4242 4242 4242 4242" />
            <div className="grid grid-cols-2 gap-2">
              <input type="text" placeholder="MM/AA" className="p-2 border rounded" defaultValue="12/25" />
              <input type="text" placeholder="CVV" className="p-2 border rounded" defaultValue="123" />
            </div>
          </div>
        )}

        {paymentMethod === 'crypto' && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold mb-2">₿ Paiement crypto (simulation)</h4>
            <select className="w-full p-2 border rounded">
              <option>Bitcoin (BTC)</option>
              <option>Ethereum (ETH)</option>
              <option>USDT</option>
            </select>
          </div>
        )}

        <button 
          onClick={handlePurchase}
          className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600"
        >
          Payer {ticketCount * 5}€
        </button>
      </div>
    </div>
  );
};

export default BuyTickets;
