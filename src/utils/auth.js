// Gestion de l'authentification admin
export const Auth = {
  // Vérifier si l'utilisateur est connecté en tant qu'admin
  isAuthenticated() {
    return localStorage.getItem('adminAuthenticated') === 'true';
  },

  // Connecter l'utilisateur
  login(password) {
    // ✅ CHANGEZ CE MOT DE PASSE !
    const adminPassword = "tombola2024"; 
    if (password === adminPassword) {
      localStorage.setItem('adminAuthenticated', 'true');
      return true;
    }
    return false;
  },

  // Déconnecter l'utilisateur
  logout() {
    localStorage.removeItem('adminAuthenticated');
  },

  // Protéger une route - Redirige vers login si non authentifié
  requireAuth() {
    if (!this.isAuthenticated()) {
      window.location.hash = '#/admin-login';
      return false;
    }
    return true;
  },

  // Accès direct à l'admin (pour vous seulement)
  directAccess() {
    // Cette fonction permet d'accéder directement à l'admin
    // en connaissant l'URL exacte
    return true;
  }
};
