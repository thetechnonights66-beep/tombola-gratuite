import React, { useState, useEffect } from 'react';

const Countdown = () => {
  // ✅ DATE DU PROCHAIN TIRAGE - Modifiez ici !
  const drawDate = new Date('2024-12-25T20:00:00'); // Noël à 20h00
  
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [isVisible, setIsVisible] = useState(false);

  function calculateTimeLeft() {
    const difference = +drawDate - +new Date();
    
    if (difference > 0) {
      return {
        jours: Math.floor(difference / (1000 * 60 * 60 * 24)),
        heures: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        secondes: Math.floor((difference / 1000) % 60)
      };
    }
    
    return { jours: 0, heures: 0, minutes: 0, secondes: 0 };
  }

  useEffect(() => {
    // Animation d'apparition
    const timer = setTimeout(() => setIsVisible(true), 500);
    
    // Compte à rebours
    const countdown = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(countdown);
    };
  }, []);

  const isDrawTime = +new Date() >= +drawDate;

  return (
    <div className={`bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl shadow-2xl p-8 mb-8 transform transition-all duration-1000 ${
      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
    }`}>
      <div className="text-center text-white">
        <h2 className="text-3xl font-bold mb-2 flex items-center justify-center gap-3">
          ⏰ Prochain Tirage
        </h2>
        
        {isDrawTime ? (
          <div className="animate-pulse">
            <div className="text-4xl font-bold mb-2">🎉 C'EST MAINTENANT !</div>
            <p className="text-xl">Le tirage est en cours !</p>
          </div>
        ) : (
          <>
            <p className="text-xl mb-6">
              Tirage le <strong>{drawDate.toLocaleDateString('fr-FR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</strong>
            </p>
            
            {/* Compte à rebours animé */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              {Object.entries(timeLeft).map(([unit, value]) => (
                <div key={unit} className="bg-white/20 backdrop-blur rounded-xl p-4 transform hover:scale-105 transition">
                  <div className="text-3xl font-bold animate-bounce">
                    {value.toString().padStart(2, '0')}
                  </div>
                  <div className="text-sm uppercase tracking-wider">
                    {unit}
                  </div>
                </div>
              ))}
            </div>

            {/* Barre de progression */}
            <div className="mt-6 max-w-2xl mx-auto">
              <div className="flex justify-between text-sm mb-2">
                <span>Début</span>
                <span>Fin</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div 
                  className="bg-yellow-400 h-2 rounded-full transition-all duration-1000 animate-pulse"
                  style={{ 
                    width: `${Math.max(0, 100 - (timeLeft.jours / 30) * 100)}%` 
                  }}
                ></div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Countdown;
