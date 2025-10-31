import React, { useState, useEffect } from 'react';

const BallDrop = ({ participants, onWinnerSelected }) => {
  const [dropping, setDropping] = useState(false);
  const [balls, setBalls] = useState([]);
  const [winnerBall, setWinnerBall] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const startBallDrop = () => {
    if (participants.length === 0) return;
    
    setDropping(true);
    setWinnerBall(null);
    setShowResult(false);
    
    // Créer des billes avec les participants
    const ballCount = Math.min(15, participants.length);
    const newBalls = Array.from({ length: ballCount }, (_, i) => {
      const participant = participants[Math.floor(Math.random() * participants.length)];
      return {
        id: i,
        participant: participant,
        position: -100, // Commence en haut
        delay: i * 150, // Délai progressif
        size: 50 + Math.random() * 20, // Taille aléatoire
        color: `hsl(${Math.random() * 360}, 70%, 60%)`, // Couleur aléatoire
        rotation: Math.random() * 360 // Rotation aléatoire
      };
    });
    
    setBalls(newBalls);

    // Animation de chute et sélection du gagnant
    setTimeout(() => {
      const winnerIndex = Math.floor(Math.random() * participants.length);
      const selectedWinner = participants[winnerIndex];
      setWinnerBall(selectedWinner);
      setDropping(false);
      setShowResult(true);
      
      setTimeout(() => {
        onWinnerSelected(selectedWinner);
      }, 3000);
    }, 4000);
  };

  // Animation continue des billes pendant la chute
  useEffect(() => {
    if (dropping) {
      const interval = setInterval(() => {
        setBalls(prev => prev.map(ball => ({
          ...ball,
          position: ball.position + 2 + Math.random() * 3, // Chute à vitesse variable
          rotation: ball.rotation + (Math.random() * 10 - 5) // Rotation aléatoire
        })));
      }, 50);

      return () => clearInterval(interval);
    }
  }, [dropping]);

  return (
    <div className="bg-gray-800 rounded-2xl p-8 text-center border-4 border-yellow-500 shadow-2xl">
      <h3 className="text-3xl font-bold text-white mb-6 flex items-center justify-center gap-3">
        🎱 Tirage aux Billes
      </h3>
      
      {/* Zone d'animation des billes */}
      <div className="h-80 bg-gradient-to-b from-gray-900 to-black rounded-lg mb-6 relative overflow-hidden border-2 border-gray-600">
        {/* Lignes de fond pour l'effet de profondeur */}
        <div className="absolute inset-0 opacity-20">
          {Array.from({ length: 10 }, (_, i) => (
            <div key={i} className="h-px bg-white w-full mb-8" style={{ marginTop: i * 40 }}></div>
          ))}
        </div>
        
        {/* Billes tombantes */}
        {balls.map(ball => (
          <div
            key={ball.id}
            className="absolute rounded-full flex items-center justify-center text-white font-bold shadow-lg animate-bounce"
            style={{
              left: `${10 + (ball.id * 6)}%`,
              top: `${ball.position}px`,
              width: `${ball.size}px`,
              height: `${ball.size}px`,
              background: `radial-gradient(circle at 30% 30%, ${ball.color}, ${ball.color}dd)`,
              animationDelay: `${ball.delay}ms`,
              transform: `rotate(${ball.rotation}deg)`,
              boxShadow: 'inset -5px -5px 10px rgba(0,0,0,0.5), inset 5px 5px 10px rgba(255,255,255,0.3)'
            }}
          >
            <span className="text-xs">{ball.id + 1}</span>
          </div>
        ))}
        
        {/* Zone d'impact en bas */}
        <div className="absolute bottom-0 left-0 right-0 h-4 bg-yellow-500 opacity-60"></div>
        
        {/* Bille gagnante qui émerge */}
        {showResult && winnerBall && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              {/* Bille gagnante avec effet de brillance */}
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-yellow-400 to-red-500 flex items-center justify-center text-white font-bold text-xl shadow-2xl animate-ping">
                  🎯
                </div>
                <div className="absolute inset-0 w-32 h-32 rounded-full bg-gradient-to-r from-yellow-400 to-red-500 animate-pulse"></div>
              </div>
              
              {/* Effet de lumière */}
              <div className="absolute -inset-4 bg-yellow-400 rounded-full opacity-20 animate-pulse"></div>
            </div>
          </div>
        )}
      </div>

      {/* Résultat avec animation */}
      {showResult && winnerBall && (
        <div className="bg-gradient-to-r from-green-600 to-emerald-700 rounded-2xl p-6 text-white mb-6 animate-winner-pop border-2 border-green-400">
          <div className="text-4xl mb-3">🏆</div>
          <div className="text-2xl font-bold mb-2">{winnerBall.name}</div>
          <div className="text-lg opacity-90">Ticket #{winnerBall.ticketNumber || Math.floor(Math.random() * 1000)}</div>
          <div className="text-sm opacity-75 mt-2">Félicitations !</div>
          
          {/* Confettis animés */}
          <div className="absolute -top-4 -left-4 text-2xl animate-bounce">🎉</div>
          <div className="absolute -top-4 -right-4 text-2xl animate-bounce" style={{ animationDelay: '0.3s' }}>🎊</div>
          <div className="absolute -bottom-4 -left-4 text-2xl animate-bounce" style={{ animationDelay: '0.6s' }}>✨</div>
          <div className="absolute -bottom-4 -right-4 text-2xl animate-bounce" style={{ animationDelay: '0.9s' }}>⭐</div>
        </div>
      )}

      <button
        onClick={startBallDrop}
        disabled={dropping || participants.length === 0}
        className={`px-8 py-4 rounded-full text-xl font-bold transition-all duration-300 ${
          dropping 
            ? 'bg-gray-600 cursor-not-allowed' 
            : participants.length === 0
            ? 'bg-gray-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 shadow-lg'
        } text-white`}
      >
        {dropping ? (
          <span className="flex items-center gap-2">
            <div className="animate-spin">🎱</div>
            Billes en chute...
          </span>
        ) : participants.length === 0 ? (
          'Aucun participant'
        ) : (
          <span className="flex items-center gap-2">
            🎱 Lancer les billes
          </span>
        )}
      </button>

      {/* Compteur de participants */}
      <div className="mt-4 text-gray-400">
        {participants.length} participant(s) dans le tirage
      </div>
    </div>
  );
};

export default BallDrop;
