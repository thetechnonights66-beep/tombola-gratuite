import React, { useState, useEffect } from 'react';
import { Auth } from '../utils/auth';
import BallDrop from './BallDrop';
import { TicketStorage } from '../utils/ticketStorage';
import { ParticipantHistory } from '../utils/participantHistory';
import { EmailVerification } from '../utils/emailVerification'; // ✅ NOUVEAU IMPORT

const AdminPanel = () => {
  const [participants, setParticipants] = useState([]);
  const [winners, setWinners] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [liveStats, setLiveStats] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [resetBallDrop, setResetBallDrop] = useState(0);
  const [snapshots, setSnapshots] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (Auth.isAuthenticated()) {
      setIsAuthenticated(true);
      loadRealData();
      
      // Charger les gagnants existants
      const savedWinners = localStorage.getItem('tombolaWinners');
      if (savedWinners) {
        setWinners(JSON.parse(savedWinners));
      }

      // Charger l'historique des snapshots
      setSnapshots(ParticipantHistory.getSnapshots());
    } else {
      window.location.hash = '#/admin-login';
    }
  }, []);

  // ✅ Charger les données réelles
  const loadRealData = () => {
    console.log('🔄 Chargement des données réelles...');
    const realParticipants = TicketStorage.getAllParticipants();
    const stats = TicketStorage.getLiveStats();
    
    setParticipants(realParticipants);
    setLiveStats(stats);
    setLastUpdate(new Date());
  };

  // ✅ Surveillance en temps réel
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      loadRealData();
    }, 3000);

    return () => clearInterval(interval);
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

  // ✅ FONCTION RÉINITIALISATION AVEC SAUVEGARDE
  const resetDraw = () => {
    if (window.confirm('🔄 Réinitialiser le tirage ?\n\n• Tous les gagnants seront effacés\n• Les tickets seront remis en jeu\n• L\'animation sera réinitialisée\n• Une sauvegarde sera créée')) {
      
      // ✅ SAUVEGARDER AVANT RÉINITIALISATION
      const snapshotId = ParticipantHistory.saveParticipantsSnapshot(
        participants, 
        winners, 
        'reset_tirage'
      );
      
      // Réinitialisation des gagnants
      setWinners([]);
      localStorage.removeItem('tombolaWinners');
      
      // Réinitialisation du statut des tickets
      const tickets = TicketStorage.getTickets();
      const updatedTickets = tickets.map(ticket => ({
        ...ticket,
        isDrawn: false,
        drawResult: null,
        drawDate: null
      }));
      localStorage.setItem('tombolaTickets', JSON.stringify(updatedTickets));
      
      // ✅ RÉINITIALISATION DE L'ANIMATION
      setResetBallDrop(prev => prev + 1);
      
      // ✅ METTRE À JOUR L'HISTORIQUE
      setSnapshots(ParticipantHistory.getSnapshots());
      
      showToast('✅ Tirage réinitialisé', `Sauvegarde #${snapshotId.split('_')[1]} créée`);
    }
  };

  // ✅ FONCTION RÉINITIALISATION PARTICIPANTS AVEC SAUVEGARDE
  const resetParticipants = () => {
    if (window.confirm('⚠️ RÉINITIALISER TOUS LES PARTICIPANTS ?\n\nUne sauvegarde complète sera créée avant la suppression.')) {
      
      // Double confirmation
      if (window.confirm(`❌ CONFIRMER LA SUPPRESSION :\n\n• ${participants.length} participant(s)\n• ${liveStats?.totalTickets || 0} ticket(s)\n• €${liveStats?.totalRevenue || 0} de recettes\n\nUne sauvegarde sera disponible dans l'historique.`)) {
        
        // ✅ SAUVEGARDE COMPLÈTE AVANT SUPPRESSION
        const snapshotId = ParticipantHistory.saveParticipantsSnapshot(
          participants, 
          winners, 
          'reset_complet'
        );
        
        // Supprimer tous les tickets
        TicketStorage.clearAllTickets();
        
        // Réinitialiser tous les états
        setParticipants([]);
        setWinners([]);
        setLiveStats(null);
        
        // Supprimer aussi les gagnants
        localStorage.removeItem('tombolaWinners');
        
        // Réinitialiser l'animation
        setResetBallDrop(prev => prev + 1);
        
        // ✅ METTRE À JOUR L'HISTORIQUE
        setSnapshots(ParticipantHistory.getSnapshots());
        
        showToast('🗑️ Participants réinitialisés', `Sauvegarde #${snapshotId.split('_')[1]} créée`, 'orange');
      }
    }
  };

  // ✅ FONCTION POUR RESTAURER UN SNAPSHOT
  const restoreSnapshot = (snapshotId) => {
    const snapshot = ParticipantHistory.getSnapshot(snapshotId);
    if (!snapshot) return;

    if (window.confirm(`🔄 Restaurer la sauvegarde du ${new Date(snapshot.timestamp).toLocaleString()} ?\n\n• ${snapshot.totalParticipants} participants\n• ${snapshot.totalTickets} tickets\n• ${snapshot.winnersCount} gagnants`)) {
      
      try {
        ParticipantHistory.restoreSnapshot(snapshotId);
        
        // Recharger toutes les données
        loadRealData();
        const savedWinners = localStorage.getItem('tombolaWinners');
        if (savedWinners) {
          setWinners(JSON.parse(savedWinners));
        }
        
        setSnapshots(ParticipantHistory.getSnapshots());
        showToast('✅ Sauvegarde restaurée', `Snapshot ${snapshotId.split('_')[1]} chargé`);
        
      } catch (error) {
        showToast('❌ Erreur', 'Impossible de restaurer la sauvegarde', 'red');
      }
    }
  };

  // ✅ FONCTION POUR EXPORTER UN SNAPSHOT
  const exportSnapshot = (snapshotId) => {
    const csv = ParticipantHistory.exportToCSV(snapshotId);
    if (csv) {
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tombola_snapshot_${snapshotId}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      showToast('📊 Export CSV', 'Fichier téléchargé');
    }
  };

  // ✅ FONCTION POUR SUPPRIMER UN SNAPSHOT
  const deleteSnapshot = (snapshotId) => {
    if (window.confirm('Supprimer cette sauvegarde ?')) {
      const updatedSnapshots = ParticipantHistory.deleteSnapshot(snapshotId);
      setSnapshots(updatedSnapshots);
      showToast('🗑️ Sauvegarde supprimée', 'Snapshot effacé', 'red');
    }
  };

  // ✅ FONCTION POUR GÉNÉRER DES PARTICIPANTS DE TEST
  const generateTestParticipants = () => {
    const count = parseInt(prompt('Combien de participants de test générer ?', '10')) || 10;
    
    if (count > 0) {
      TicketStorage.generateTestTickets(count);
      loadRealData();
      showToast('🧪 Participants test générés', `${count} nouveaux participants ajoutés`);
    }
  };

  // ✅ FONCTION POUR ANALYSER TOUS LES EMAILS
  const analyzeAllEmails = () => {
    const report = EmailVerification.generateSuspiciousEmailsReport(participants);
    
    console.log('📊 Rapport des emails suspects:', report);
    
    // Afficher le rapport dans un modal
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
      <div class="bg-gray-800 p-6 rounded-lg max-w-4xl w-full mx-4 max-h-96 overflow-y-auto">
        <h3 class="text-xl font-bold mb-4">📊 Analyse des Emails</h3>
        
        <div class="grid grid-cols-4 gap-4 mb-4">
          <div class="bg-blue-600 p-3 rounded text-center">
            <div class="text-2xl font-bold">${report.totalParticipants}</div>
            <div class="text-sm">Total</div>
          </div>
          <div class="bg-red-600 p-3 rounded text-center">
            <div class="text-2xl font-bold">${report.suspiciousCount}</div>
            <div class="text-sm">Suspects</div>
          </div>
          <div class="bg-orange-600 p-3 rounded text-center">
            <div class="text-2xl font-bold">${report.summary.duplicates}</div>
            <div class="text-sm">Duplicatas</div>
          </div>
          <div class="bg-yellow-600 p-3 rounded text-center">
            <div class="text-2xl font-bold">${report.summary.disposableDomains}</div>
            <div class="text-sm">Domaines jetables</div>
          </div>
        </div>
        
        ${report.suspiciousEmails.length > 0 ? `
          <div class="space-y-2">
            <h4 class="font-semibold mb-2">Emails à vérifier :</h4>
            ${report.suspiciousEmails.map(email => `
              <div class="bg-gray-700 p-3 rounded">
                <div class="flex justify-between">
                  <div>
                    <strong>${email.participant}</strong>
                    <div class="text-sm text-gray-400">${email.email}</div>
                  </div>
                  <div class="text-right text-sm">
                    <div>Score: ${email.analysis.score}/100</div>
                    <div class="text-red-400">${email.analysis.domainAnalysis.reason || 'Problème détecté'}</div>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        ` : `
          <div class="text-center py-8 text-gray-400">
            <div class="text-4xl mb-4">✅</div>
            <p>Aucun email suspect détecté</p>
          </div>
        `}
        
        <button onclick="this.parentElement.parentElement.remove()" 
                class="w-full mt-4 bg-gray-600 text-white py-2 rounded hover:bg-gray-700">
          Fermer
        </button>
      </div>
    `;
    
    document.body.appendChild(modal);
  };

  // ✅ FONCTION UTILITAIRE POUR LES TOASTS
  const showToast = (title, message, color = 'green') => {
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 bg-${color}-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce`;
    toast.innerHTML = `
      <div class="flex items-center gap-3">
        <span class="text-xl">${title.charAt(0)}</span>
        <div>
          <div class="font-semibold">${title}</div>
          <div class="text-sm opacity-90">${message}</div>
        </div>
      </div>
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.remove();
    }, 4000);
  };

  const handleLogout = () => {
    Auth.logout();
    window.location.hash = '#/';
  };

  const forceRefresh = () => {
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
              onClick={() => setShowHistory(!showHistory)}
              className="bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded-lg font-semibold"
            >
              📊 Historique
            </button>
            <button
              onClick={analyzeAllEmails}
              className="bg-teal-500 hover:bg-teal-600 px-4 py-2 rounded-lg font-semibold"
              disabled={participants.length === 0}
            >
              🔍 Vérifier Emails
            </button>
            <button
              onClick={resetDraw}
              className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg font-semibold"
              disabled={winners.length === 0}
            >
              🎯 Réinit. Tirage
            </button>
            <button
              onClick={generateTestParticipants}
              className="bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded-lg font-semibold"
            >
              🧪 Générer Test
            </button>
            <button
              onClick={resetParticipants}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-semibold"
              disabled={participants.length === 0}
            >
              🗑️ Réinit. Participants
            </button>
            <button
              onClick={handleLogout}
              className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg font-semibold"
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
          resetTrigger={resetBallDrop}
        />

        {/* SECTION HISTORIQUE DES SAUVEGARDES */}
        {showHistory && (
          <div className="bg-gray-800 rounded-lg p-6 mt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">📊 Historique des Sauvegardes</h2>
              <div className="text-sm text-gray-400">
                {snapshots.length} sauvegarde(s)
              </div>
            </div>
            
            {snapshots.length > 0 ? (
              <div className="space-y-4">
                {snapshots.map((snapshot, index) => (
                  <div key={snapshot.id} className="bg-gray-700 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-semibold">
                          Sauvegarde #{snapshot.id.split('_')[1]}
                        </div>
                        <div className="text-sm text-gray-400">
                          {new Date(snapshot.timestamp).toLocaleString()}
                        </div>
                        <div className="text-xs text-blue-400 mt-1">
                          Raison: {snapshot.reason === 'reset_tirage' ? 'Réinitialisation tirage' : 'Réinitialisation complète'}
                        </div>
                      </div>
                      <div className="text-right text-sm">
                        <div>{snapshot.totalParticipants} participants</div>
                        <div>{snapshot.totalTickets} tickets</div>
                        <div>€{snapshot.totalRevenue} recettes</div>
                        <div>{snapshot.winnersCount} gagnants</div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => restoreSnapshot(snapshot.id)}
                        className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm"
                      >
                        🔄 Restaurer
                      </button>
                      <button
                        onClick={() => exportSnapshot(snapshot.id)}
                        className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm"
                      >
                        📊 Export CSV
                      </button>
                      <button
                        onClick={() => deleteSnapshot(snapshot.id)}
                        className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
                      >
                        🗑️ Supprimer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <div className="text-4xl mb-4">💾</div>
                <p>Aucune sauvegarde disponible</p>
                <p className="text-sm mt-2">
                  Les sauvegardes sont créées automatiquement lors des réinitialisations
                </p>
              </div>
            )}
          </div>
        )}

        {/* SECTION GAGNANTS */}
        {winners.length > 0 && (
          <div className="bg-gray-800 rounded-lg p-6 mt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">🏆 Historique des Gagnants</h2>
              <div className="flex gap-4 items-center">
                <div className="text-sm text-gray-400">
                  {winners.length} gagnant(s)
                </div>
                <button
                  onClick={resetDraw}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-semibold text-sm"
                >
                  🔄 Réinitialiser Tirage
                </button>
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

        {/* LISTE DES PARTICIPANTS RÉELS */}
        <div className="bg-gray-800 rounded-lg p-6 mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">
              👥 Participants Réels ({participants.length})
            </h2>
            <div className="flex gap-4 items-center">
              <div className="text-sm text-gray-400">
                Dernier : {lastUpdate.toLocaleTimeString()}
              </div>
              <button
                onClick={resetParticipants}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-semibold text-sm"
                disabled={participants.length === 0}
              >
                🗑️ Tout Supprimer
              </button>
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
              <p className="text-sm mt-2">
                Utilisez "Générer Test" pour créer des données de démonstration
              </p>
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
              console.log('Gagnants:', winners);
              console.log('Snapshots:', snapshots);
              console.log('ResetBallDrop counter:', resetBallDrop);
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
