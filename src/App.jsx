import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import BuyTickets from './components/BuyTickets';
import AdminPanel from './components/AdminPanel';
import Confirmation from './components/Confirmation';
import MyTickets from './components/MyTickets';
import AdminLogin from './components/AdminLogin';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="bg-white shadow-lg">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-between items-center py-4">
              <a href="#/" className="text-2xl font-bold text-purple-600">
                🎪 Tombola
              </a>
              <div className="flex gap-4">
                {/* ✅ MENU PUBLIC SEULEMENT - PAS DE ADMIN */}
                <a href="#/" className="text-gray-700 hover:text-purple-600">Accueil</a>
                <a href="#/buy" className="text-gray-700 hover:text-purple-600">Acheter</a>
                <a href="#/my-tickets" className="text-gray-700 hover:text-purple-600">Mes Tickets</a>
                {/* ❌ SUPPRIMÉ : Aucun lien vers l'admin */}
              </div>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/buy" element={<BuyTickets />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/confirmation" element={<Confirmation />} />
          <Route path="/my-tickets" element={<MyTickets />} />
          <Route path="/admin-login" element={<AdminLogin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
