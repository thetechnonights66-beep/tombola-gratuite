import React, { useState, useEffect } from 'react';

const LiveDraw = () => {
  const [currentWinners, setCurrentWinners] = useState([]);
  const [isLive, setIsLive] = useState(false);
  const [drawMessage, setDrawMessage] = useState('');

  // Simuler la réception des gagnants en direct
  useEffect(() => {
    // Au chargement, récupérer les gagnants depuis le localStorage
    const savedWinners = localStorage.getItem('tombolaWinners');
    if (savedWinners) {
      setCurrentWinners(JSON.parse(savedWinners));
    }

    // Simulation de diffusion en direct
    const liveInterval = setInterval(() => {
      const savedWinners = localStorage.getItem('tombolaWinners');
      if (savedWinners) {
        const winners = JSON.parse(savedWinners);
        setCurrentWinners(winners);
        
        if (winners.length > 0 && !isLive) {
          setIsLive(true);
          setDrawMessage('🎊 Tirage en cours !');
        }
      }
    }, 2000);

    return () => clearInterval(liveInterval);
  }, [isLive]);

  const getCurrentDrawStatus = () => {
    if (currentWinners.length === 0) {
      return {
        status: 'waiting',
        message: '⏳ En attente du tirage...',
        color: 'bg-yellow-500'
      };
    } else if (isLive) {
      return {
        status: 'live',
        message: '🔴 EN DIRECT - Tirage en cours',
        color: 'bg-red-500'
      };
    } else {
      return {
        status: 'completed',
        message: '✅ Tirage terminé',
        color: 'bg-green-500'
      };
    }
  };

  const status = getCurrentDrawStatus();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-blue-800 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* En-tête avec statut en direct */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <h1 className="text-4xl font-bold">📺 Diffusion en Direct</h1>
            <span className={`px-4 py-2 rounded-full text-sm font-bold animate-pulse ${status.color}`}>
              {status.message}
            </span>
          </div>
          <p className="text-xl opacity-90">
            Suivez le tirage de la tombola en temps réel
          </p>
        </div>

        {/* Bannière de statut */}
        <div className="bg-white/10 backdrop-blur rounded-2xl p-6 mb-8 border-2 border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-4 h-4 rounded-full animate-pulse ${status.color}`}></div>
              <div>
                <h3 className="text-xl font-bold">Statut du tirage</h3>
                <p className="opacity-80">{status.message}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{currentWinners.length}</div>
              <div className="text-sm opacity-80">Gagnant(s)</div>
            </div>
          </div>
        </div>

        {/* Zone principale des gagnants */}
        <div className="grid gap-6 mb-8">
          {currentWinners.length > 0 ? (
            <>
              {/* Dernier gagnant en surbrillance */}
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl p-8 text-center animate-pulse border-4 border-yellow-300">
                <div className="text-6xl mb-4">🏆</div>
                <h2 className="text-3xl font-bold mb-2">DERNIER GAGNANT</h2>
                <div className="text-4xl font-bold mb-2">
                  {currentWinners[currentWinners.length - 1].participant}
                </div>
                <div className="text-2xl opacity-90">
                  Ticket #{currentWinners[currentWinners.length - 1].ticketNumber}
                </div>
                <div className="text-lg opacity-80 mt-2">
                  {currentWinners[currentWinners.length - 1].prize}
                </div>
                <div className="text-sm opacity-70 mt-4">
                  {currentWinners[currentWinners.length - 1].time}
                </div>
              </div>

              {/* Tous les gagnants */}
              <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
                <h3 className="text-2xl font-bold mb-6 text-center">🎊 Tous les Gagnants</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {currentWinners.map((winner, index) => (
                    <div 
                      key={index} 
                      className={`bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-4 text-center transform transition-all duration-300 hover:scale-105 ${
                        index === currentWinners.length - 1 ? 'border-4 border-yellow-400 animate-bounce' : ''
                      }`}
                    >
                      <div className="text-2xl mb-2">
                        {index === currentWinners.length - 1 ? '🎉' : '⭐'}
                      </div>
                      <div className="font-bold text-lg">{winner.participant}</div>
                      <div className="text-sm opacity-90">#{winner.ticketNumber}</div>
                      <div className="text-xs opacity-80 mt-1">{winner.prize}</div>
                      <div className="text-xs opacity-70 mt-2">{winner.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* Écran d'attente */
            <div className="bg-white/10 backdrop-blur rounded-2xl p-12 text-center">
              <div className="text-6xl mb-6">⏰</div>
              <h2 className="text-3xl font-bold mb-4">En attente du tirage</h2>
              <p className="text-xl opacity-80 mb-6">
                Le tirage n'a pas encore commencé. Revenez plus tard !
              </p>
              <div className="animate-pulse text-lg">
                La diffusion commencera automatiquement...
              </div>
            </div>
          )}
        </div>

        {/* Informations de diffusion */}
        <div className="bg-black/30 rounded-2xl p-6 text-center">
          <h3 className="text-xl font-bold mb-4">📡 Informations de Diffusion</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-2xl mb-2">🕒</div>
              <div>Mise à jour automatique</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-2xl mb-2">🔔</div>
              <div>Notifications en direct</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-2xl mb-2">📱</div>
              <div>Compatible mobile</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveDraw;
