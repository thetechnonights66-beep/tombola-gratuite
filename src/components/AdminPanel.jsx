import React, { useState, useEffect } from 'react';

const AdminPanel = () => {
  const [participants, setParticipants] = useState([]);
  const [winners, setWinners] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  
  // ✅ LOTS AVEC DESCRIPTIONS DÉTAILLÉES
  const [availablePrizes] = useState([
    { 
      name: "Voiture Tesla", 
      description: "Tesla Model 3 neuve - Autonomie 500km",
      image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=150&h=100&fit=crop"
    },
    { 
      name: "Voyage aux Maldives", 
      description: "7 nuits tout inclus dans un resort 5 étoiles",
      image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=150&h=100&fit=crop"
    },
    { 
      name: "Bague en diamant", 
      description: "Bague en or blanc avec diamant 1 carat",
      image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=150&h=100&fit=crop"
    },
    { 
      name: "Guitare Fender", 
      description: "Fender Stratocaster - Édition limitée",
      image: "https://images.unsplash.com/photo-1558098329-a11cff621064?w=150&h=100&fit=crop"
    },
    { 
      name: "Carte cadeau Amazon", 
      description: "Carte cadeau utilisable sur tous les produits Amazon",
      image: "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=150&h=100&fit=crop"
    }
  ]);

  useEffect(() => {
    const mockParticipants = Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      name: `Participant ${i + 1}`,
      email: `participant${i + 1}@email.com`,
      tickets: Math.floor(Math.random() * 5) + 1,
      numbers: Array.from({ length: 5 }, () => Math.floor(Math.random() * 1000))
    }));
    setParticipants(mockParticipants);
  }, []);

  const startDraw = () => {
    if (availablePrizes.length === 0) {
      alert("Tous les lots ont été attribués !");
      return;
    }

    setIsDrawing(true);
    
    setTimeout(() => {
      const winnerIndex = Math.floor(Math.random() * participants.length);
      const winner = participants[winnerIndex];
      const winningNumber = winner.numbers[Math.floor(Math.random() * winner.numbers.length)];
      const prize = availablePrizes[winners.length % availablePrizes.length];
      
      setWinners([...winners, {
        participant: winner.name,
        ticketNumber: winningNumber,
        prize: prize.name,
        prizeDescription: prize.description,
        time: new Date().toLocaleTimeString()
      }]);
      setIsDrawing(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">🎮 Panel Admin Tombola</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-600 p-4 rounded-lg">
            <div className="text-2xl font-bold">{participants.length}</div>
            <div>Participants</div>
          </div>
          <div className="bg-green-600 p-4 rounded-lg">
            <div className="text-2xl font-bold">
              {participants.reduce((sum, p) => sum + p.tickets, 0)}
            </div>
            <div>Tickets vendus</div>
          </div>
          <div className="bg-purple-600 p-4 rounded-lg">
            <div className="text-2xl font-bold">{winners.length}</div>
            <div>Gagnants</div>
          </div>
          <div className="bg-yellow-600 p-4 rounded-lg">
            <div className="text-2xl font-bold">{availablePrizes.length - winners.length}</div>
            <div>Lots restants</div>
          </div>
        </div>

        {/* ✅ SECTION LOTS AMÉLIORÉE */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">🎁 Lots à gagner</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availablePrizes.map((prize, index) => (
              <div key={index} className={`p-4 rounded-lg border ${
                index < winners.length ? 'bg-green-600 border-green-400' : 'bg-gray-700 border-gray-600'
              }`}>
                <div className="flex items-start gap-3">
                  <img 
                    src={prize.image} 
                    alt={prize.name}
                    className="w-16 h-16 rounded object-cover"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-lg">{prize.name}</div>
                    <div className="text-sm text-gray-300 mt-1">{prize.description}</div>
                    <div className={`text-xs mt-2 ${
                      index < winners.length ? 'text-green-200' : 'text-yellow-300'
                    }`}>
                      {index < winners.length ? '✅ Attribué' : '📦 En attente'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mb-8">
          <button
            onClick={startDraw}
            disabled={isDrawing || participants.length === 0 || winners.length >= availablePrizes.length}
            className={`px-8 py-4 rounded-full text-xl font-bold ${
              isDrawing ? 'bg-gray-600' : 
              winners.length >= availablePrizes.length ? 'bg-gray-500' : 'bg-red-500 hover:bg-red-600'
            }`}
          >
            {isDrawing ? '🎲 Tirage en cours...' : 
             winners.length >= availablePrizes.length ? '🎊 Tirage terminé' : '🎯 Lancer le tirage'}
          </button>
        </div>

        {isDrawing && (
          <div className="text-center my-8">
            <div className="text-6xl animate-bounce mb-4">🎰</div>
            <p className="text-xl">Tirage au sort en cours...</p>
          </div>
        )}

        {winners.length > 0 && (
          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">🏆 Gagnants</h2>
            <div className="space-y-4">
              {winners.map((winner, index) => (
                <div key={index} className="bg-green-600 p-4 rounded-lg">
                  <div className="font-semibold text-lg">{winner.participant}</div>
                  <div className="text-gray-200">Ticket #{winner.ticketNumber}</div>
                  <div className="text-yellow-300 font-bold text-xl mt-1">🎁 {winner.prize}</div>
                  <div className="text-sm text-green-200 mt-1">{winner.prizeDescription}</div>
                  <div className="text-xs text-green-300 mt-2">{winner.time}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">👥 Participants (10 premiers)</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left p-2">Nom</th>
                  <th className="text-left p-2">Email</th>
                  <th className="text-left p-2">Tickets</th>
                </tr>
              </thead>
              <tbody>
                {participants.slice(0, 10).map(participant => (
                  <tr key={participant.id} className="border-b border-gray-700">
                    <td className="p-2">{participant.name}</td>
                    <td className="p-2">{participant.email}</td>
                    <td className="p-2">{participant.tickets}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
