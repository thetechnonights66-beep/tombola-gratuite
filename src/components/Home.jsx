import React from 'react';

const Home = () => {
  // ✅ DÉFINIR VOS LOTS ICI
  const prizes = [
    { emoji: "🎮", name: "PlayStation 5", value: "500€" },
    { emoji: "💻", name: "MacBook Air", value: "1200€" },
    { emoji: "📱", name: "iPhone 15", value: "900€" },
    { emoji: "🛫", name: "Weekend à Paris", value: "800€" },
    { emoji: "🎁", name: "Cadeau surprise", value: "300€" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 text-white">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-5xl font-bold text-center mb-8">
          🎪 Tombola Excursion
        </h1>
        <p className="text-xl text-center mb-12">
          Tentez votre chance pour gagner des lots exceptionnels !
        </p>
        
        {/* ✅ SECTION DES LOTS MISE À JOUR */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
          {prizes.map((prize, index) => (
            <div key={index} className="bg-white/20 p-6 rounded-lg backdrop-blur border border-white/30">
              <div className="text-4xl mb-3">{prize.emoji}</div>
              <h3 className="text-xl font-semibold mb-2">{prize.name}</h3>
              <p className="text-yellow-300 font-bold">Valeur : {prize.value}</p>
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
            <p>Tirage le 25 décembre</p>
          </div>
        </div>
        
        <div className="text-center mt-8">
          <button 
            onClick={() => (window.location.hash = '#/buy')}
            className="bg-yellow-500 text-purple-900 px-8 py-4 rounded-full text-xl font-bold hover:bg-yellow-400 transition"
          >
            Acheter mes tickets 🎫
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
