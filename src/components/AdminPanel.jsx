import React, { useState, useEffect } from 'react';
import { Auth } from '../utils/auth';
import BallDrop from './BallDrop';
import { TicketStorage } from '../utils/ticketStorage';

const AdminPanel = () => {
  const [participants, setParticipants] = useState([]);
  const [winners, setWinners] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [liveStats, setLiveStats] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    if (Auth.isAuthenticated()) {
      setIsAuthenticated(true);
      loadRealData();
    } else {
      window.location.hash = '#/admin-login';
    }
  }, []);

  // ✅ CORRECTION : Charger les données réelles
  const loadRealData = () => {
    console.log('🔄 Chargement des données réelles...');
    const realParticipants = TicketStorage.getAllParticipants();
    const stats = TicketStorage.getLiveStats();
    
    console.log('Participants réels:', realParticipants);
    console.log('Statistiques:', stats);
    
    setParticipants(realParticipants);
    setLiveStats(stats);
    setLastUpdate(new Date());
  };

  // ✅ CORRECTION : Surveillance en temps réel améliorée
  useEffect(() => {
    if (!isAuthenticated) return;

    // Surveiller les changements dans le localStorage
    const handleStorageChange = () => {
      console.log('📦 Changement détecté dans le stockage');
      loadRealData();
    };

    // Écouter les changements de stockage
    window.addEventListener('storage', handleStorageChange);
    
    // Vérifier toutes les 3 secondes
    const interval = setInterval(() => {
      loadRealData();
    }, 3000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [isAuthenticated]);

  const handleWinnerSelected = (winner) => {
    const newWinner = {
      participant: winner.name,
      ticketNumber: winner.ticketNumber,
      prize: `Lot ${winners.length + 1}`,
      time: new Date().toLocaleTimeString()
    };
    
    const updatedWinners = [...winners, newWinner];
    setWinners(updatedWinners);
    localStorage.setItem('tombolaWinners', JSON.stringify(updatedWinners));
  };

  const handleLogout = () => {
    Auth.logout();
    window.location.hash = '#/';
  };

  // Fonction pour forcer la mise à jour
  const forceRefresh = () => {
    console.log('🔄 Forcer la mise à jour manuelle');
    loadRealData();
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
        {/* En-tête avec indicateur temps réel */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold">🎮 Panel Admin Tombola</h1>
            <div className="flex items-center gap-2 mt-2 text-sm text-gray-400">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>En direct • Dernière mise à jour : {lastUpdate.toLocaleTimeString()}</span>
            </div>
          </div>
          <div className="flex gap-4">
            <button
              onClick={forceRefresh}
              className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg font-semibold"
            >
              🔄 Actualiser
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-semibold"
            >
              Déconnexion
            </button>
          </div>
        </div>

        {/* STATISTIQUES EN TEMPS RÉEL */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-600 p-4 rounded-lg">
            <div className="text-2xl font-bold">
              {liveStats ? liveStats.totalParticipants : participants.length}
            </div>
            <div>Participants Réels</div>
            <div className="text-xs text-blue-200 mt-1">
              {participants.length} détectés
            </div>
          </div>
          <div className="bg-green-600 p-4 rounded-lg">
            <div className="text-2xl font-bold">
              {liveStats ? liveStats.totalTickets : '...'}
            </div>
            <div>Tickets Vendus</div>
            <div className="text-xs text-green-200 mt-1">
              +{liveStats?.recentTickets || 0} aujourd'hui
            </div>
          </div>
          <div className="bg-purple-600 p-4 rounded-lg">
            <div className="text-2xl font-bold">{winners.length}</div>
            <div>Gagnants</div>
          </div>
          <div className="bg-yellow-600 p-4 rounded-lg">
            <div className="text-2xl font-bold">
              {liveStats ? `€${liveStats.totalRevenue}` : '...'}
            </div>
            <div>Recettes Réelles</div>
          </div>
        </div>

        {/* ANIMATION BILLES TOMBANTES */}
        <BallDrop 
          participants={participants} 
          onWinnerSelected={handleWinnerSelected} 
        />

        {/* LISTE DES PARTICIPANTS RÉELS */}
        <div className="bg-gray-800 rounded-lg p-6 mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">
              👥 Participants Réels ({participants.length})
            </h2>
            <div className="text-sm text-gray-400">
              Dernier : {lastUpdate.toLocaleTimeString()}
            </div>
          </div>
          
          {participants.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left p-2">Nom</th>
                    <th className="text-left p-2">Email</th>
                    <th className="text-left p-2">Tickets</th>
                    <th className="text-left p-2">Dépense</th>
                    <th className="text-left p-2">Premier achat</th>
                  </tr>
                </thead>
                <tbody>
                  {participants.map((participant, index) => (
                    <tr key={participant.id || index} className="border-b border-gray-700 hover:bg-gray-700">
                      <td className="p-2 font-semibold">{participant.name}</td>
                      <td className="p-2">{participant.email}</td>
                      <td className="p-2">
                        <span className="bg-blue-500 text-white px-2 py-1 rounded text-sm">
                          {participant.tickets}
                        </span>
                      </td>
                      <td className="p-2">
                        <span className="bg-green-500 text-white px-2 py-1 rounded text-sm">
                          €{participant.totalSpent}
                        </span>
                      </td>
                      <td className="p-2 text-sm text-gray-400">
                        {new Date(participant.firstPurchase).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <div className="text-4xl mb-4">📝</div>
              <p>Aucun participant détecté</p>
              <p className="text-sm mt-2">Vérifiez la console pour le debug</p>
            </div>
          )}
        </div>

        {/* BOUTON DEBUG */}
        <div className="mt-4 text-center">
          <button
            onClick={() => {
              console.log('=== DEBUG ADMINPANEL ===');
              console.log('Participants:', participants);
              console.log('LiveStats:', liveStats);
              TicketStorage.debugTickets();
            }}
            className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg text-sm"
          >
            🐛 Debug Console
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
