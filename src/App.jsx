import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import BuyTickets from './components/BuyTickets';
import AdminPanel from './components/AdminPanel';
import Confirmation from './components/Confirmation';
import MyTickets from './components/MyTickets';
import AdminLogin from './components/AdminLogin';
import LiveDraw from './components/LiveDraw';
import PrizeManager from './components/PrizeManager';
import ReferralAdminPanel from './components/ReferralAdminPanel';
import AnalyticsDashboard from './components/AnalyticsDashboard'; // ✅ IMPORT ANALYTICS DASHBOARD
import { AnalyticsService } from './utils/analyticsService';

function App() {
  // ✅ INITIALISATION ANALYTICS AU DÉMARRAGE
  useEffect(() => {
    // Initialiser le service analytics
    AnalyticsService.init();
    
    // Démarrer une nouvelle session
    const sessionId = AnalyticsService.trackSession();
    AnalyticsService.setCurrentSessionId(sessionId);
    
    // Track page view initiale
    AnalyticsService.trackPageView('/');
    
    console.log('📊 Analytics initialisés - Session:', sessionId);
  }, []);

  return (
    <Router>
      <div className="App">
        <nav className="bg-white shadow-lg">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-between items-center py-4">
              <a 
                href="#/" 
                className="text-2xl font-bold text-purple-600 hover:text-purple-700 transition-colors"
                onClick={() => AnalyticsService.trackEvent('navigation', 'click', 'logo')}
              >
                🎪 Tombola
              </a>
              <div className="flex gap-4">
                <a 
                  href="#/" 
                  className="text-gray-700 hover:text-purple-600 transition-colors"
                  onClick={() => AnalyticsService.trackEvent('navigation', 'click', 'home')}
                >
                  Accueil
                </a>
                <a 
                  href="#/buy" 
                  className="text-gray-700 hover:text-purple-600 transition-colors"
                  onClick={() => AnalyticsService.trackEvent('navigation', 'click', 'buy_tickets')}
                >
                  Acheter
                </a>
                <a 
                  href="#/my-tickets" 
                  className="text-gray-700 hover:text-purple-600 transition-colors"
                  onClick={() => AnalyticsService.trackEvent('navigation', 'click', 'my_tickets')}
                >
                  Mes Tickets
                </a>
                <a 
                  href="#/live" 
                  className="text-green-600 hover:text-green-700 font-bold transition-colors"
                  onClick={() => AnalyticsService.trackEvent('navigation', 'click', 'live_draw')}
                >
                  📺 En Direct
                </a>
              </div>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/buy" element={<BuyTickets />} />
          <Route path="/confirmation" element={<Confirmation />} />
          <Route path="/my-tickets" element={<MyTickets />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/live" element={<LiveDraw />} />
          <Route path="/prize-manager" element={<PrizeManager />} />
          <Route path="/referral-admin" element={<ReferralAdminPanel />} />
          <Route path="/analytics" element={<AnalyticsDashboard />} /> {/* ✅ NOUVELLE ROUTE ANALYTICS */}
        </Routes>

        {/* ✅ FOOTER AVEC LIENS ANALYTICS */}
        <footer className="bg-gray-800 text-white py-8 mt-12">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-lg font-bold mb-4">🎪 Tombola Excursion</h3>
                <p className="text-gray-400 text-sm">
                  Tentez votre chance pour gagner des lots exceptionnels !
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Navigation</h4>
                <div className="space-y-2 text-sm">
                  <a 
                    href="#/" 
                    className="block text-gray-400 hover:text-white transition-colors"
                    onClick={() => AnalyticsService.trackEvent('footer', 'click', 'home')}
                  >
                    Accueil
                  </a>
                  <a 
                    href="#/buy" 
                    className="block text-gray-400 hover:text-white transition-colors"
                    onClick={() => AnalyticsService.trackEvent('footer', 'click', 'buy_footer')}
                  >
                    Acheter des tickets
                  </a>
                  <a 
                    href="#/my-tickets" 
                    className="block text-gray-400 hover:text-white transition-colors"
                    onClick={() => AnalyticsService.trackEvent('footer', 'click', 'my_tickets_footer')}
                  >
                    Mes tickets
                  </a>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Admin</h4>
                <div className="space-y-2 text-sm">
                  <a 
                    href="#/admin-login" 
                    className="block text-gray-400 hover:text-white transition-colors"
                    onClick={() => AnalyticsService.trackEvent('footer', 'click', 'admin_login')}
                  >
                    Connexion Admin
                  </a>
                  <a 
                    href="#/live" 
                    className="block text-gray-400 hover:text-white transition-colors"
                    onClick={() => AnalyticsService.trackEvent('footer', 'click', 'live_footer')}
                  >
                    Tirage en direct
                  </a>
                  {/* ✅ LIEN DIRECT VERS ANALYTICS POUR LES ADMINS */}
                  <a 
                    href="#/analytics" 
                    className="block text-teal-400 hover:text-teal-300 transition-colors font-semibold"
                    onClick={() => AnalyticsService.trackEvent('footer', 'click', 'analytics_dashboard')}
                  >
                    📊 Dashboard Analytics
                  </a>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Statistiques</h4>
                <div className="text-sm text-gray-400 space-y-1">
                  <div>📊 Sessions actives</div>
                  <div>🎯 Conversions</div>
                  <div>📈 Performance</div>
                  <button 
                    onClick={() => {
                      AnalyticsService.trackEvent('analytics', 'click', 'view_stats');
                      // ✅ REDIRECTION VERS LE DASHBOARD ANALYTICS
                      window.location.hash = '#/analytics';
                    }}
                    className="mt-2 bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-xs transition-colors"
                  >
                    Voir les stats
                  </button>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">
              <p>
                © 2024 Tombola Excursion - {AnalyticsService.getCurrentSessionId() ? 
                  `Session #${AnalyticsService.getCurrentSessionId().substring(0, 8)}` : 
                  'Analytics activés'
                }
              </p>
              <p className="mt-1 text-xs">
                <a 
                  href="#/analytics" 
                  className="text-teal-400 hover:text-teal-300"
                  onClick={() => AnalyticsService.trackEvent('footer', 'click', 'analytics_link')}
                >
                  📊 Accéder aux statistiques avancées
                </a>
              </p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
