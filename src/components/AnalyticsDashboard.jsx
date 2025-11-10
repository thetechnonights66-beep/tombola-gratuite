import React, { useState, useEffect } from 'react';
import { AnalyticsService } from '../utils/analyticsService';
import { Auth } from '../utils/auth'; // ✅ IMPORT DE L'AUTH

const AnalyticsDashboard = () => {
  const [report, setReport] = useState(null);
  const [timeRange, setTimeRange] = useState('all');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ VÉRIFICATION D'ACCÈS ADMIN
  useEffect(() => {
    const checkAccess = () => {
      if (!Auth.isAuthenticated()) {
        // Rediriger vers la page de login admin
        window.location.hash = '#/admin-login';
        return;
      }
      
      // ✅ VÉRIFICATION SUPPLÉMENTAIRE - SEUL L'ADMIN PRINCIPAL A ACCÈS
      const adminUser = Auth.getCurrentUser();
      if (adminUser && adminUser.email === 'thetechnonights66@gmail.com') { // ⚠️ REMPLACEZ PAR VOTRE EMAIL
        setIsAuthenticated(true);
        loadAnalytics();
      } else {
        // Accès refusé - Rediriger vers l'admin panel normal
        alert('❌ Accès réservé à l\'administrateur principal');
        window.location.hash = '#/admin';
      }
      setIsLoading(false);
    };

    checkAccess();
  }, []);

  const loadAnalytics = () => {
    const analyticsReport = AnalyticsService.generateReport();
    setReport(analyticsReport);
  };

  // ✅ ÉCRAN DE CHARGEMENT
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto"></div>
          <p className="mt-4">Vérification des accès...</p>
        </div>
      </div>
    );
  }

  // ✅ ACCÈS REFUSÉ
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold mb-4">Accès Refusé</h1>
          <p className="text-gray-400">Cette page est réservée à l'administrateur principal.</p>
          <button
            onClick={() => window.location.hash = '#/admin'}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
          >
            Retour au Panel Admin
          </button>
        </div>
      </div>
    );
  }

  // ✅ CHARGEMENT DES DONNÉES ANALYTICS
  if (!report) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto"></div>
          <p className="mt-4">Chargement des analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* En-tête avec bouton retour */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold">📊 Tableau de Bord Analytics</h1>
            <p className="text-gray-400 mt-2">Statistiques avancées de votre tombola</p>
          </div>
          <div className="flex gap-4 items-center">
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
            >
              <option value="all">Depuis le début</option>
              <option value="7days">7 derniers jours</option>
              <option value="30days">30 derniers jours</option>
            </select>
            <button
              onClick={() => window.location.hash = '#/admin'}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition"
            >
              ← Retour Admin
            </button>
          </div>
        </div>

        {/* 📈 RÉSUMÉ PRINCIPAL */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 shadow-lg">
            <div className="text-3xl font-bold">{report.summary.chiffreAffaires}</div>
            <div className="text-blue-100">Chiffre d'Affaires</div>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 shadow-lg">
            <div className="text-3xl font-bold">{report.summary.visiteursUniques}</div>
            <div className="text-green-100">Visiteurs Uniques</div>
          </div>
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 shadow-lg">
            <div className="text-3xl font-bold">{report.summary.tauxConversion}</div>
            <div className="text-orange-100">Taux de Conversion</div>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 shadow-lg">
            <div className="text-3xl font-bold">{report.performance.panierMoyen}</div>
            <div className="text-purple-100">Panier Moyen</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 📊 PERFORMANCE */}
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              🚀 Performance
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
                <span>Durée moyenne session</span>
                <span className="font-bold text-green-400">{report.performance.duréeMoyenneSession}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
                <span>Taux de rebond</span>
                <span className="font-bold text-orange-400">{report.performance.tauxRebond}</span>
              </div>
            </div>
          </div>

          {/* 👥 PARRAINAGE */}
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              👥 Performance Parrainage
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
                <span>Revenus parrainage</span>
                <span className="font-bold text-blue-400">{report.parrainage.revenusParrainage}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
                <span>ROI Parrainage</span>
                <span className={`font-bold ${
                  parseFloat(report.parrainage.ROI) >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {report.parrainage.ROI}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
                <span>Efficacité parrainage</span>
                <span className="font-bold text-purple-400">{report.parrainage.efficacité}</span>
              </div>
            </div>
          </div>

          {/* 📱 COMPORTEMENT UTILISATEUR */}
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              📱 Comportement Utilisateurs
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Pages les plus populaires</h3>
                {report.comportement.pagesPopulaires.map(([page, count], index) => (
                  <div key={page} className="flex justify-between items-center p-2 bg-gray-700 rounded mb-2">
                    <span className="text-sm">{page}</span>
                    <span className="font-bold text-yellow-400">{count} vues</span>
                  </div>
                ))}
              </div>
              <div>
                <h3 className="font-semibold mb-2">Heures de pointe</h3>
                {report.comportement.heuresPointes.map(({hour, count}) => (
                  <div key={hour} className="flex justify-between items-center p-2 bg-gray-700 rounded mb-2">
                    <span>{hour}</span>
                    <span className="font-bold text-green-400">{count} visites</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ⚠️ POINTS DE FRICTION */}
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              ⚠️ Points d'Amélioration
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-red-500/20 rounded-lg border border-red-400/30">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">Abandon de panier</span>
                  <span className="text-red-400 font-bold">{report.améliorations.tauxAbandonPanier}</span>
                </div>
                <p className="text-sm text-red-200">
                  Les utilisateurs ajoutent des tickets mais ne finalisent pas l'achat
                </p>
              </div>
              <div className="p-4 bg-orange-500/20 rounded-lg border border-orange-400/30">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">Abandon de formulaire</span>
                  <span className="text-orange-400 font-bold">{report.améliorations.tauxAbandonFormulaire}</span>
                </div>
                <p className="text-sm text-orange-200">
                  Les utilisateurs commencent mais ne complètent pas l'inscription
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 📊 ACTIONS RECOMMANDÉES */}
        <div className="mt-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-4">💡 Recommandations</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white/10 rounded-lg p-4">
              <h3 className="font-bold mb-2">🎯 Améliorer la conversion</h3>
              <ul className="text-sm space-y-1 text-purple-100">
                <li>• Simplifier le processus d'achat</li>
                <li>• Ajouter des témoignages clients</li>
                <li>• Offrir des tickets gratuits pour premier achat</li>
              </ul>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <h3 className="font-bold mb-2">👥 Optimiser le parrainage</h3>
              <ul className="text-sm space-y-1 text-purple-100">
                <li>• Améliorer l'interface de partage</li>
                <li>• Offrir des récompenses immédiates</li>
                <li>• Créer des défis parrainage</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 📤 EXPORT */}
        <div className="mt-8 text-center">
          <button
            onClick={() => {
              const data = AnalyticsService.generateReport();
              const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `analytics-tombola-${new Date().toISOString().split('T')[0]}.json`;
              a.click();
            }}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            📊 Exporter les données
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
