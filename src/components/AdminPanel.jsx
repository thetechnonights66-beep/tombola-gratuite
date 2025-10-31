import React, { useState, useEffect } from 'react';
import { Auth } from '../utils/auth';
import BallDrop from './BallDrop';

const AdminPanel = () => {
  const [participants, setParticipants] = useState([]);
  const [winners, setWinners] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (Auth.isAuthenticated()) {
      setIsAuthenticated(true);
      
      // Charger les gagnants existants depuis le localStorage
      const savedWinners = localStorage.getItem('tombolaWinners');
      if (savedWinners) {
        setWinners(JSON.parse(savedWinners));
      }
      
      // Données de test avec tickets
      const mockParticipants = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        name: `Participant ${i + 1}`,
        email: `participant${i + 1}@email.com`,
        tickets: Math.floor(Math.random() * 5) + 1,
        ticketNumber: Math.floor(1000 + Math.random() * 9000)
      }));
      setParticipants(mockParticipants);
    } else {
      window.location.hash = '#/admin-login';
    }
  }, []);

  const handleWinnerSelected = (winner) => {
    const newWinner = {
      participant: winner.name,
      ticketNumber: winner.ticketNumber,
      prize: `Lot ${winners.length + 1}`,
      time: new Date().toLocaleTimeString()
    };
    
    const updatedWinners = [...winners, newWinner];
    setWinners(updatedWinners);
    
    // ✅ SAUVEGARDER DANS LE LOCALSTORAGE POUR LA DIFFUSION EN DIRECT
    localStorage.setItem('tombolaWinners', JSON.stringify(updatedWinners));
  };

  const handleLogout = () => {
    Auth.logout();
    window.location.hash = '#/';
  };

  // Fonction pour réinitialiser les gagnants
  const resetWinners = () => {
    setWinners([]);
    localStorage.removeItem('tombolaWinners');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto"></div>
          <p className="text-white mt-4">Vérification de l'accès...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">🎮 Panel Admin Tombola</h1>
          <div className="flex gap-4">
            <button
              onClick={resetWinners}
              className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg font-semibold"
            >
              🔄 Réinitialiser
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-semibold"
            >
              Déconnexion
            </button>
          </div>
        </div>

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
            <div className="text-2xl font-bold">
              {participants.reduce((sum, p) => sum + p.tickets * 5, 0)}€
            </div>
            <div>Recettes totales</div>
          </div>
        </div>

        {/* ANIMATION BILLES TOMBANTES */}
        <BallDrop 
          participants={participants} 
          onWinnerSelected={handleWinnerSelected} 
        />

        {winners.length > 0 && (
          <div className="bg-gray-800 rounded-lg p-6 mt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">🏆 Historique des Gagnants</h2>
              <div className="text-sm text-gray-400">
                {winners.length} gagnant(s) - Sauvegardé automatiquement
              </div>
            </div>
            <div className="space-y-3">
              {winners.map((winner, index) => (
                <div key={index} className="bg-green-600 p-4 rounded-lg">
                  <div className="font-semibold text-lg">{winner.participant}</div>
                  <div>Ticket #{winner.ticketNumber} - {winner.prize}</div>
                  <div className="text-sm text-green-200">{winner.time}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-gray-800 rounded-lg p-6 mt-8">
          <h2 className="text-2xl font-bold mb-4">👥 Participants ({participants.length})</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left p-2">Nom</th>
                  <th className="text-left p-2">Email</th>
                  <th className="text-left p-2">Tickets</th>
                  <th className="text-left p-2">Numéro</th>
                </tr>
              </thead>
              <tbody>
                {participants.slice(0, 10).map(participant => (
                  <tr key={participant.id} className="border-b border-gray-700">
                    <td className="p-2">{participant.name}</td>
                    <td className="p-2">{participant.email}</td>
                    <td className="p-2">{participant.tickets}</td>
                    <td className="p-2 font-mono">#{participant.ticketNumber}</td>
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
