import React from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <nav style={{ backgroundColor: 'white', padding: '1rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#7c3aed', textDecoration: 'none' }}>
              🎪 Tombola
            </Link>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Link to="/" style={{ textDecoration: 'none', color: '#333' }}>Accueil</Link>
              <Link to="/#/buy" style={{ textDecoration: 'none', color: '#333' }}>Acheter</Link>
              <Link to="/#/admin" style={{ textDecoration: 'none', color: '#dc2626' }}>Admin</Link>
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

// Gardez le reste du code identique...
function Home() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', minHeight: '80vh' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎪 Tombola Excursion</h1>
      <p style={{ fontSize: '1.25rem', marginBottom: '2rem' }}>Tentez votre chance pour gagner des lots exceptionnels !</p>
      <button 
        onClick={() => window.location.hash = '#/buy'}
        style={{ backgroundColor: '#f59e0b', color: '#7c3aed', padding: '1rem 2rem', fontSize: '1.25rem', fontWeight: 'bold', border: 'none', borderRadius: '9999px', cursor: 'pointer' }}
      >
        Acheter mes tickets 🎫
      </button>
    </div>
  );
}

function BuyTickets() {
  return (
    <div style={{ padding: '2rem', maxWidth: '500px', margin: '0 auto', minHeight: '80vh' }}>
      <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '1.5rem' }}>Acheter des tickets</h2>
      <p style={{ textAlign: 'center' }}>Page d'achat - En construction</p>
    </div>
  );
}

function AdminPanel() {
  return (
    <div style={{ padding: '2rem', minHeight: '80vh' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Panel Admin</h2>
      <p>Panel administrateur - En construction</p>
    </div>
  );
}

export default App;
