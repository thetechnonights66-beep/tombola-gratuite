import React from 'react';
import Countdown from './Countdown';

const Home = () => {
  const prizes = [
    { 
      emoji: "🚗", 
      name: "Voiture Tesla", 
      value: "45,000€",
      image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=300&h=200&fit=crop",
      description: "Tesla Model 3 neuve - Autonomie 500km"
    },
    { 
      emoji: "✈️", 
      name: "Voyage aux Maldives", 
      value: "5,000€",
      image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=300&h=200&fit=crop",
      description: "7 nuits tout inclus dans un resort 5 étoiles"
    },
    { 
      emoji: "💎", 
      name: "Bague en diamant", 
      value: "2,500€",
      image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=300&h=200&fit=crop",
      description: "Bague en or blanc avec diamant 1 carat"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 text-white">
      <div className="container mx-auto px-4 py-8">
        
        {/* ✅ COMPTE À REBOURS AJOUTÉ ICI */}
        <Countdown />

        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">
            🎪 Tombola Excursion
          </h1>
          <p className="text-xl">
            Tentez votre chance pour gagner des lots exceptionnels !
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
          {prizes.map((prize, index) => (
            <div key={index} className="bg-white/20 rounded-xl backdrop-blur border border-white/30 overflow-hidden hover:scale-105 transition duration-300">
              <div className="h-48 bg-gray-300 overflow-hidden">
                <img 
                  src={prize.image} 
                  alt={prize.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="text-3xl">{prize.emoji}</div>
                  <div className="text-yellow-300 font-bold text-lg">{prize.value}</div>
                </div>
                
                <h3 className="text-xl font-semibold mb-2">{prize.name}</h3>
                <p className="text-white/80 text-sm mb-4">{prize.description}</p>
                
                <div className="bg-white/10 rounded-lg p-3 text-center">
                  <span className="text-sm">🎯 Lot {index + 1}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
          <div className="bg-white/20 p-6 rounded-lg backdrop-blur">
            <h3 className="text-2xl font-semibold mb-4">🎫 Achetez vos tickets</h3>
            <p>Participation à partir de 5€</p>
          </div>
          
          <div className="bg-white/20 p-6 rounded-lg backdrop-blur">
            <h3 className="text-2xl font-semibold mb-4">💰 Paiement sécurisé</h3>
            <p>Carte bancaire & Crypto</p>
          </div>
          
          <div className="bg-white/20 p-6 rounded-lg backdrop-blur">
            <h3 className="text-2xl font-semibold mb-4">🏆 {prizes.length} Lots à gagner</h3>
            <p>Tentez votre chance dès maintenant</p>
          </div>
        </div>
        
        <div className="text-center">
          <button 
            onClick={() => (window.location.hash = '#/buy')}
            className="bg-yellow-500 text-purple-900 px-8 py-4 rounded-full text-xl font-bold hover:bg-yellow-400 transition transform hover:scale-105"
          >
            Acheter mes tickets 🎫
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
