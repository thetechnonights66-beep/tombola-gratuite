import React, { useState, useEffect } from 'react';

const AdminPanel = () => {
  const [participants, setParticipants] = useState([]);
  const [winners, setWinners] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  
  // ✅ DÉFINIR LES LOTS DISPONIBLES
  const [availablePrizes] = useState([
    "PlayStation 5",
    "MacBook Air", 
    "iPhone 15",
    "Weekend à Paris",
    "Cadeau surprise"
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
        prize: prize,
        time: new Date().toLocaleTimeString()
      }]);
      setIsDrawing(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">🎮 Panel Admin Tombola</h1>
        
        {/* ✅ STATISTIQUES AVEC LOTS */}
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

        {/* ✅ SECTION LOTS DISPONIBLES */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">🎁 Lots à gagner</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {availablePrizes.map((prize, index) => (
              <div key={index} className={`p-3 rounded text-center ${
                index < winners.length ? 'bg-green-600' : 'bg-blue-600'
              }`}>
                <div className="font-semibold">{prize}</div>
                <div className="text-sm">
                  {index < winners.length ? '🎉 Attribué' : '📦 Disponible'}
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
            <div className="space-y-3">
              {winners.map((winner, index) => (
                <div key={index} className="bg-green-600 p-4 rounded-lg">
                  <div className="font-semibold text-lg">{winner.participant}</div>
                  <div>Ticket #{winner.ticketNumber}</div>
                  <div className="text-yellow-300 font-bold">🎁 {winner.prize}</div>
                  <div className="text-sm text-green-200">{winner.time}</div>
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
