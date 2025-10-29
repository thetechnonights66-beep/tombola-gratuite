import React from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        {/* Navigation avec Tailwind */}
        <nav className="bg-white shadow-lg">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-between items-center py-4">
              <Link to="/" className="text-2xl font-bold text-purple-600">
                🎪 Tombola
              </Link>
              <div className="flex gap-4">
                <Link to="/" className="text-gray-700 hover:text-purple-600">Accueil</Link>
                <Link to="/buy" className="text-gray-700 hover:text-purple-600">Acheter</Link>
                <Link to="/admin" className="text-red-500 hover:text-red-600">Admin</Link>
              </div>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/buy" element={<BuyTickets />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </div>
    </Router>
  );
}

// Composants avec Tailwind
function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-8">🎪 Tombola Excursion</h1>
        <p className="text-xl mb-12">Tentez votre chance pour gagner des lots exceptionnels !</p>
        <button 
          onClick={() => window.location.hash = '#/buy'}
          className="bg-yellow-500 text-purple-900 px-8 py-4 rounded-full text-xl font-bold hover:bg-yellow-400 transition"
        >
          Acheter mes tickets 🎫
        </button>
      </div>
    </div>
  );
}

function BuyTickets() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-3xl font-bold text-center mb-6">Acheter des tickets</h2>
        <p className="text-center text-gray-600">Page d'achat - Bientôt disponible</p>
      </div>
    </div>
  );
}

function AdminPanel() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">Panel Admin</h2>
        <p className="text-gray-400">Panel administrateur - Bientôt disponible</p>
      </div>
    </div>
  );
}

export default App;
