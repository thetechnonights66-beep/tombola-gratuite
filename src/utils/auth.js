// Gestion de l'authentification admin
export const Auth = {
  // Vérifier si l'utilisateur est connecté en tant qu'admin
  isAuthenticated() {
    return localStorage.getItem('adminAuthenticated') === 'true';
  },

  // Connecter l'utilisateur
  login(password, email = null) {
    // ✅ CHANGEZ CE MOT DE PASSE !
    const adminPassword = "tombola2024"; 
    if (password === adminPassword) {
      localStorage.setItem('adminAuthenticated', 'true');
      
      // ✅ SAUVEGARDER LES INFOS DE L'UTILISATEUR
      const userData = {
        email: email || 'admin@tombola.com',
        loginTime: new Date().toISOString(),
        sessionId: Math.random().toString(36).substring(2, 15)
      };
      localStorage.setItem('adminUser', JSON.stringify(userData));
      
      return true;
    }
    return false;
  },

  // Déconnecter l'utilisateur
  logout() {
    localStorage.removeItem('adminAuthenticated');
    localStorage.removeItem('adminUser');
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
  },

  // ✅ FONCTION POUR RÉCUPÉRER L'UTILISATEUR COURANT
  getCurrentUser() {
    if (this.isAuthenticated()) {
      const userData = localStorage.getItem('adminUser');
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  },

  // ✅ FONCTION POUR METTRE À JOUR LES INFOS UTILISATEUR
  updateUserInfo(userInfo) {
    if (this.isAuthenticated()) {
      const currentUser = this.getCurrentUser() || {};
      const updatedUser = { ...currentUser, ...userInfo };
      localStorage.setItem('adminUser', JSON.stringify(updatedUser));
      return updatedUser;
    }
    return null;
  },

  // ✅ FONCTION POUR VÉRIFIER LES PERMISSIONS SPÉCIFIQUES
  hasPermission(permission) {
    const user = this.getCurrentUser();
    if (!user) return false;

    // Permissions basées sur l'email
    const adminEmails = [
      'votre-email@admin.com', // ⚠️ REMPLACEZ PAR VOTRE EMAIL
      'admin@tombola.com',
      'superadmin@tombola.com'
    ];

    switch (permission) {
      case 'analytics':
        return adminEmails.includes(user.email);
      case 'super_admin':
        return user.email === 'votre-email@admin.com'; // ⚠️ REMPLACEZ PAR VOTRE EMAIL
      case 'ticket_management':
        return true; // Tous les admins peuvent gérer les tickets
      case 'user_management':
        return adminEmails.includes(user.email);
      default:
        return false;
    }
  },

  // ✅ FONCTION POUR OBTENIR LE TEMPS DE SESSION
  getSessionDuration() {
    const user = this.getCurrentUser();
    if (!user || !user.loginTime) return '0min';
    
    const loginTime = new Date(user.loginTime);
    const now = new Date();
    const diffMs = now - loginTime;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) {
      return `${diffMins}min`;
    } else {
      const hours = Math.floor(diffMins / 60);
      const mins = diffMins % 60;
      return `${hours}h${mins}min`;
    }
  },

  // ✅ FONCTION POUR VALIDER LA SESSION (EXPIRATION)
  validateSession() {
    const user = this.getCurrentUser();
    if (!user || !user.loginTime) {
      this.logout();
      return false;
    }

    // Session expire après 8 heures
    const loginTime = new Date(user.loginTime);
    const now = new Date();
    const sessionDuration = now - loginTime;
    const maxSessionDuration = 8 * 60 * 60 * 1000; // 8 heures en millisecondes

    if (sessionDuration > maxSessionDuration) {
      this.logout();
      return false;
    }

    return true;
  }
};
