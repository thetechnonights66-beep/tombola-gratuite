import React from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
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
              <Link to="/" className="text-2xl font-bold text-purple-600">
                🎪 Tombola
              </Link>
              <div className="flex gap-4">
                <Link to="/" className="text-gray-700 hover:text-purple-600">Accueil</Link>
                <Link to="/buy" className="text-gray-700 hover:text-purple-600">Acheter</Link>
                <Link to="/my-tickets" className="text-gray-700 hover:text-purple-600">Mes Tickets</Link>
                <Link to="/admin-login" className="text-red-500 hover:text-red-600">Admin</Link>
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
