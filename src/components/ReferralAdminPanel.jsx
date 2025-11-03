import React, { useState, useEffect } from 'react';
import { ReferralSystem } from '../utils/referralSystem';

const ReferralAdminPanel = () => {
  const [stats, setStats] = useState({});
  const [selectedTab, setSelectedTab] = useState('overview');
  const [selectedReferrer, setSelectedReferrer] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = () => {
    const adminStats = ReferralSystem.getAdminStats();
    setStats(adminStats);
  };

  const handleManualReward = (email) => {
    const ticketCount = parseInt(prompt(`Combien de tickets attribuer à ${email} ?`, '1'));
    const reason = prompt('Raison de cette récompense manuelle :');
    
    if (ticketCount && reason) {
      ReferralSystem.manualReward(email, ticketCount, reason);
      loadStats();
      alert(`✅ ${ticketCount} ticket(s) attribué(s) à ${email}`);
    }
  };

  const handleSuspend = (email) => {
    const reason = prompt(`Raison de la suspension de ${email} :`);
    if (reason) {
      ReferralSystem.suspendReferrer(email, reason);
      loadStats();
      alert(`🚫 ${email} a été suspendu`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold">👥 Administration Parrainage</h1>
            <p className="text-gray-400 mt-2">
              Surveillez et géz le système de parrainage
            </p>
          </div>
          <button
            onClick={loadStats}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold"
          >
            🔄 Actualiser
          </button>
        </div>

        {/* Statistiques globales */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-600 p-4 rounded-lg">
            <div className="text-2xl font-bold">{stats.totalReferrals}</div>
            <div className="text-sm">Total Parrainages</div>
          </div>
          <div className="bg-green-600 p-4 rounded-lg">
            <div className="text-2xl font-bold">{stats.activeReferrers}</div>
            <div className="text-sm">Parrains Actifs</div>
          </div>
          <div className="bg-purple-600 p-4 rounded-lg">
            <div className="text-2xl font-bold">{stats.conversionRate}%</div>
            <div className="text-sm">Taux Conversion</div>
          </div>
          <div className="bg-yellow-600 p-4 rounded-lg">
            <div className="text-2xl font-bold">{stats.totalRewardsGiven}</div>
            <div className="text-sm">Récompenses Données</div>
          </div>
        </div>

        {/* Navigation par onglets */}
        <div className="flex gap-4 mb-6 border-b border-gray-700">
          <button
            onClick={() => setSelectedTab('overview')}
            className={`pb-4 px-4 font-semibold ${
              selectedTab === 'overview' 
                ? 'border-b-2 border-blue-500 text-blue-400' 
                : 'text-gray-400'
            }`}
          >
            📊 Vue d'ensemble
          </button>
          <button
            onClick={() => setSelectedTab('top')}
            className={`pb-4 px-4 font-semibold ${
              selectedTab === 'top' 
                ? 'border-b-2 border-green-500 text-green-400' 
                : 'text-gray-400'
            }`}
          >
            🏆 Top Parrains
          </button>
          <button
            onClick={() => setSelectedTab('recent')}
            className={`pb-4 px-4 font-semibold ${
              selectedTab === 'recent' 
                ? 'border-b-2 border-purple-500 text-purple-400' 
                : 'text-gray-400'
            }`}
          >
            ⏰ Récents
          </button>
          <button
            onClick={() => setSelectedTab('fraud')}
            className={`pb-4 px-4 font-semibold ${
              selectedTab === 'fraud' 
                ? 'border-b-2 border-red-500 text-red-400' 
                : 'text-gray-400'
            }`}
          >
            🚨 Alertes Fraude
          </button>
        </div>

        {/* Contenu des onglets */}
        {selectedTab === 'overview' && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4">📊 Performance du Système</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">📈 Métriques Clés</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Parrainages/jour (moyenne):</span>
                    <span className="font-bold">{(stats.totalReferrals / 30).toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Valeur moyenne/parrain:</span>
                    <span className="font-bold">{(stats.totalRewardsGiven / stats.activeReferrers).toFixed(1)} tickets</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3">🎯 Recommandations</h4>
                <div className="space-y-2 text-sm">
                  {stats.conversionRate < 20 && (
                    <div className="text-yellow-400">
                      ⚠️ Taux de conversion faible - vérifiez l'UX
                    </div>
                  )}
                  {stats.activeReferrers < 10 && (
                    <div className="text-blue-400">
                      💡 Peu de parrains actifs - lancez une campagne
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'top' && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4">🏆 Top 10 des Parrains</h3>
            <div className="space-y-3">
              {stats.topReferrers?.map((referrer, index) => (
                <div key={referrer.email} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold">#{index + 1}</span>
                        <div>
                          <div className="font-semibold">{referrer.email}</div>
                          <div className="text-sm text-gray-400">
                            {referrer.validated} validés / {referrer.totalReferrals} total
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleManualReward(referrer.email)}
                        className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm"
                      >
                        🎁 Récompenser
                      </button>
                      <button
                        onClick={() => handleSuspend(referrer.email)}
                        className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
                      >
                        🚫 Suspendre
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedTab === 'recent' && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4">⏰ Parrainages Récents</h3>
            <div className="space-y-3">
              {stats.recentReferrals?.map((referral, index) => (
                <div key={referral.id} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex justify-between">
                    <div>
                      <div className="font-semibold">Parrain: {referral.referrer}</div>
                      <div className="text-sm text-gray-400">
                        Filleul: {referral.referred}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(referral.date).toLocaleString()}
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs ${
                      referral.status === 'validated' ? 'bg-green-600' :
                      referral.status === 'pending' ? 'bg-yellow-600' :
                      'bg-blue-600'
                    }`}>
                      {referral.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedTab === 'fraud' && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4">🚨 Alertes de Fraude Potentielle</h3>
            {stats.fraudFlags?.length > 0 ? (
              <div className="space-y-3">
                {stats.fraudFlags.map((flag, index) => (
                  <div key={index} className="bg-red-900/30 border border-red-700 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold text-red-400">
                          {flag.type === 'MULTI_ACCOUNT' ? '⚠️ Multi-comptes détecté' : '🚫 Comportement suspect'}
                        </div>
                        <div className="text-sm text-red-300 mt-1">
                          Filleul: {flag.referred}
                        </div>
                        <div className="text-xs text-red-400 mt-2">
                          Parrains associés: {flag.referrers.join(', ')}
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs ${
                        flag.severity === 'HIGH' ? 'bg-red-600' : 'bg-orange-600'
                      }`}>
                        {flag.severity}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <div className="text-4xl mb-4">✅</div>
                <p>Aucune alerte de fraude détectée</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReferralAdminPanel;
