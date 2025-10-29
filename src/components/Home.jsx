import React from 'react';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 text-white">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-5xl font-bold text-center mb-8">
          🎪 Tombola Excursion
        </h1>
        <p className="text-xl text-center mb-12">
          Tentez votre chance pour gagner des lots exceptionnels !
        </p>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-white/20 p-6 rounded-lg backdrop-blur">
            <h3 className="text-2xl font-semibold mb-4">🎫 Achetez vos tickets</h3>
            <p>Participation à partir de 5€</p>
          </div>
          
          <div className="bg-white/20 p-6 rounded-lg backdrop-blur">
            <h3 className="text-2xl font-semibold mb-4">💰 Paiement sécurisé</h3>
            <p>Carte bancaire & Crypto</p>
          </div>
          
          <div className="bg-white/20 p-6 rounded-lg backdrop-blur">
            <h3 className="text-2xl font-semibold mb-4">🏆 Lots à gagner</h3>
            <p>Tirage le 25 décembre</p>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <button 
            onClick={() => window.location.href = '/buy'}
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
