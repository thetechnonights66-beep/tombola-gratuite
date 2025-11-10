import React, { useState, useEffect } from 'react';
import { Auth } from '../utils/auth';

// ✅ LISTE BLANCHE DES ADMINISTRATEURS AUTORISÉS
const AUTHORIZED_ADMINS = [
  'thetechnonights66@gmail.com', // ⚠️ REMPLACEZ PAR VOTRE EMAIL
  'admin@tombola.com'      // ⚠️ AJOUTEZ D'AUTRES EMAILS SI NÉCESSAIRE
];

const SecureAnalytics = () => {
  const [accessGranted, setAccessGranted] = useState(false);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    verifyAdminAccess();
  }, []);

  const verifyAdminAccess = () => {
    if (!Auth.isAuthenticated()) {
      redirectToLogin();
      return;
    }

    const currentUser = Auth.getCurrentUser();
    const isAuthorized = currentUser && AUTHORIZED_ADMINS.includes(currentUser.email);
    
    if (isAuthorized) {
      setAccessGranted(true);
    } else {
      setAttempts(prev => {
        const newAttempts = prev + 1;
        if (newAttempts >= 3) {
          // Trop de tentatives - Bloquer l'accès
          alert('🚨 Tentatives de connexion suspectes détectées');
          Auth.logout();
          window.location.hash = '#/';
        }
        return newAttempts;
      });
      
      setTimeout(() => {
        alert('❌ Accès Analytics réservé aux administrateurs principaux');
        window.location.hash = '#/admin';
      }, 1000);
    }
  };

  const redirectToLogin = () => {
    window.location.hash = '#/admin-login?redirect=analytics';
  };

  if (!accessGranted) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p>Vérification des privilèges administrateur...</p>
          <p className="text-sm text-gray-400 mt-2">
            Accès réservé - Sécurité renforcée
          </p>
        </div>
      </div>
    );
  }

  // ✅ IMPORTER ET RENVOYER LE VRAI DASHBOARD
  const AnalyticsDashboard = React.lazy(() => import('./AnalyticsDashboard'));
  
  return (
    <React.Suspense fallback={
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Chargement des analytics...</div>
      </div>
    }>
      <AnalyticsDashboard />
    </React.Suspense>
  );
};

export default SecureAnalytics;
