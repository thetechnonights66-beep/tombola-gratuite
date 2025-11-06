import React, { useState, useEffect, useRef } from 'react';

const BallDrop = ({ participants, onWinnerSelected, resetTrigger }) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [winner, setWinner] = useState(null);
  const [displayNumber, setDisplayNumber] = useState('');
  const [animationPhase, setAnimationPhase] = useState('idle'); // idle, shuffling, revealing, winner
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  // ✅ RÉINITIALISATION QUAND resetTrigger CHANGE
  useEffect(() => {
    if (resetTrigger) {
      console.log('🔄 Réinitialisation de l\'animation BallDrop');
      setWinner(null);
      setDisplayNumber('');
      setAnimationPhase('idle');
      setIsDrawing(false);
    }
  }, [resetTrigger]);

  const startDraw = () => {
    if (participants.length === 0) {
      alert('Aucun participant pour le moment !');
      return;
    }

    setIsDrawing(true);
    setWinner(null);
    setDisplayNumber('');
    setAnimationPhase('shuffling');
    
    // Phase 1: Mélange des numéros (3 secondes)
    const numbers = participants.flatMap(p => 
      Array.isArray(p.ticketNumbers) ? p.ticketNumbers : []
    );
    
    let shuffleCount = 0;
    const maxShuffles = 60; // 3 secondes à 20fps
    
    const shuffleInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * numbers.length);
      setDisplayNumber(numbers[randomIndex] || '0000');
      shuffleCount++;
      
      if (shuffleCount >= maxShuffles) {
        clearInterval(shuffleInterval);
        revealWinner();
      }
    }, 50);
  };

  const revealWinner = () => {
    setAnimationPhase('revealing');
    
    // Sélectionner un vrai gagnant
    const validParticipants = participants.filter(p => 
      p.ticketNumbers && p.ticketNumbers.length > 0
    );
    
    if (validParticipants.length === 0) {
      setAnimationPhase('idle');
      setIsDrawing(false);
      return;
    }

    const randomIndex = Math.floor(Math.random() * validParticipants.length);
    const selectedWinner = validParticipants[randomIndex];
    const winningTicket = selectedWinner.ticketNumbers[0]; // Prendre le premier ticket
    
    // Animation de révélation finale
    let revealCount = 0;
    const revealInterval = setInterval(() => {
      const partialNumber = winningTicket.toString().slice(0, revealCount + 1);
      setDisplayNumber(partialNumber.padEnd(4, '?'));
      revealCount++;
      
      if (revealCount >= 4) {
        clearInterval(revealInterval);
        finalizeWinner(selectedWinner, winningTicket);
      }
    }, 300);
  };

  const finalizeWinner = (winner, ticketNumber) => {
    setAnimationPhase('winner');
    setWinner(winner);
    setDisplayNumber(ticketNumber.toString().padStart(4, '0'));
    
    // ✅ Émettre l'événement avec toutes les informations (y compris le téléphone)
    setTimeout(() => {
      onWinnerSelected({
        name: winner.name,
        ticketNumber: ticketNumber,
        phone: winner.phone // ✅ INCLURE LE TÉLÉPHONE POUR WHATSAPP
      });
      
      // Reset après 5 secondes
      setTimeout(() => {
        setIsDrawing(false);
        setAnimationPhase('idle');
      }, 5000);
    }, 2000);
  };

  const getAnimationClass = () => {
    switch (animationPhase) {
      case 'shuffling':
        return 'animate-pulse text-yellow-400';
      case 'revealing':
        return 'animate-bounce text-green-400';
      case 'winner':
        return 'animate-pulse text-red-500 scale-110';
      default:
        return 'text-gray-300';
    }
  };

  const getBackgroundClass = () => {
    switch (animationPhase) {
      case 'shuffling':
        return 'bg-yellow-500/20 border-yellow-400';
      case 'revealing':
        return 'bg-green-500/20 border-green-400';
      case 'winner':
        return 'bg-red-500/20 border-red-400 animate-pulse';
      default:
        return 'bg-gray-800 border-gray-600';
    }
  };

  return (
    <div className="bg-gray-800 rounded-2xl p-8 text-center border-4 border-yellow-500 shadow-2xl">
      <h3 className="text-3xl font-bold text-white mb-6 flex items-center justify-center gap-3">
        🎪 Tirage au Sort
      </h3>

      {/* AFFICHAGE PRINCIPAL DU NUMÉRO */}
      <div className={`relative border-4 rounded-2xl p-8 mb-8 transition-all duration-500 ${getBackgroundClass()}`}>
        
        {/* Titre selon la phase */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-white">
            {animationPhase === 'shuffling' && '🎰 Mélange en cours...'}
            {animationPhase === 'revealing' && '🎯 Révélation du gagnant...'}
            {animationPhase === 'winner' && '🏆 GAGNANT !'}
            {animationPhase === 'idle' && '🎪 Prêt pour le tirage'}
          </h2>
        </div>

        {/* Numéro affiché */}
        <div className="text-center">
          <div className={`text-8xl md:text-9xl font-mono font-bold transition-all duration-300 ${getAnimationClass()}`}>
            {displayNumber || '????'}
          </div>
        </div>

        {/* Effets visuels */}
        {animationPhase === 'shuffling' && (
          <div className="absolute inset-0 flex justify-between items-center px-8">
            <div className="w-4 h-4 bg-yellow-400 rounded-full animate-ping"></div>
            <div className="w-4 h-4 bg-yellow-400 rounded-full animate-ping" style={{animationDelay: '0.2s'}}></div>
            <div className="w-4 h-4 bg-yellow-400 rounded-full animate-ping" style={{animationDelay: '0.4s'}}></div>
          </div>
        )}

        {animationPhase === 'winner' && (
          <>
            <div className="absolute -top-4 -right-4 text-4xl animate-bounce">🎉</div>
            <div className="absolute -top-4 -left-4 text-4xl animate-bounce" style={{animationDelay: '0.3s'}}>🥳</div>
            <div className="absolute -bottom-4 -right-4 text-4xl animate-bounce" style={{animationDelay: '0.6s'}}>🎊</div>
            <div className="absolute -bottom-4 -left-4 text-4xl animate-bounce" style={{animationDelay: '0.9s'}}>🏆</div>
          </>
        )}

        {/* État vide */}
        {animationPhase === 'idle' && !displayNumber && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-gray-500 text-center">
              <div className="text-6xl mb-4">🎯</div>
              <p className="text-xl">En attente du tirage</p>
              <p className="text-sm mt-2">Cliquez sur "Lancer le tirage"</p>
            </div>
          </div>
        )}
      </div>

      {/* INFORMATIONS DU GAGNANT */}
      {winner && (
        <div className="bg-gradient-to-r from-green-600 to-emerald-700 rounded-2xl p-6 mb-6 text-white animate-winner-pop border-2 border-green-400">
          <div className="text-4xl mb-3">🏆</div>
          <div className="text-2xl font-bold mb-2">{winner.name}</div>
          <div className="text-lg opacity-90">Ticket #{displayNumber}</div>
          {winner.email && (
            <div className="text-sm opacity-75 mt-1">Email: {winner.email}</div>
          )}
          {winner.phone && (
            <div className="text-sm opacity-75 mt-1">📱 {winner.phone}</div>
          )}
          <div className="text-sm opacity-75 mt-2">Félicitations !</div>
          
          {/* Confettis animés */}
          <div className="absolute -top-4 -left-4 text-2xl animate-bounce">🎉</div>
          <div className="absolute -top-4 -right-4 text-2xl animate-bounce" style={{ animationDelay: '0.3s' }}>🎊</div>
          <div className="absolute -bottom-4 -left-4 text-2xl animate-bounce" style={{ animationDelay: '0.6s' }}>✨</div>
          <div className="absolute -bottom-4 -right-4 text-2xl animate-bounce" style={{ animationDelay: '0.9s' }}>⭐</div>
        </div>
      )}

      {/* BOUTON DE TIRAGE */}
      <div className="text-center">
        {!isDrawing ? (
          <button
            onClick={startDraw}
            disabled={participants.length === 0}
            className={`px-8 py-4 rounded-full text-xl font-bold transition-all duration-300 ${
              participants.length === 0 
                ? 'bg-gray-600 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 shadow-lg text-white'
            }`}
          >
            🎯 Lancer le tirage
            {participants.length > 0 && (
              <span className="block text-sm mt-1 opacity-80">
                {participants.length} participants • {participants.flatMap(p => p.ticketNumbers || []).length} tickets
              </span>
            )}
          </button>
        ) : (
          <div className="text-gray-400 text-lg">
            <span className="flex items-center justify-center gap-2">
              <div className="animate-spin">🎰</div>
              Tirage en cours...
            </span>
          </div>
        )}
      </div>

      {/* Compteur de participants */}
      <div className="mt-4 text-gray-400">
        {participants.length} participant(s) dans le tirage
      </div>

      {/* PARTICIPANTS EN ATTENTE */}
      {participants.length > 0 && animationPhase === 'idle' && (
        <div className="mt-8 bg-gray-700 rounded-2xl p-6">
          <h3 className="text-xl font-bold mb-4 text-center text-white">🎫 Participants en attente</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-h-40 overflow-y-auto">
            {participants.slice(0, 12).map((participant, index) => (
              <div key={index} className="bg-gray-600 rounded-lg p-3 text-center">
                <div className="font-semibold text-sm truncate text-white">{participant.name}</div>
                <div className="text-xs text-gray-300">
                  {(participant.ticketNumbers?.length || 1)} ticket(s)
                </div>
              </div>
            ))}
            {participants.length > 12 && (
              <div className="bg-gray-600 rounded-lg p-3 text-center">
                <div className="font-semibold text-sm text-white">+{participants.length - 12} autres</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BallDrop;
