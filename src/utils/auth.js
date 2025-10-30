// Gestion de l'authentification admin
export const Auth = {
  // Vérifier si l'utilisateur est connecté en tant qu'admin
  isAuthenticated() {
    return localStorage.getItem('adminAuthenticated') === 'true';
  },

  // Connecter l'utilisateur
  login(password) {
    // Mot de passe défini par vous - Changez-le !
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

  // Protéger une route
  requireAuth() {
    if (!this.isAuthenticated()) {
      window.location.hash = '#/admin-login';
      return false;
    }
    return true;
  }
};
