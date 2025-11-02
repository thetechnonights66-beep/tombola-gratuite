// Gestionnaire des lots de la tombola
export const PrizeManager = {
  
  // ✅ CHARGER LES LOTS DEPUIS LE LOCALSTORAGE
  getPrizes() {
    const prizes = localStorage.getItem('tombolaPrizes');
    if (prizes) {
      return JSON.parse(prizes);
    }
    
    // Lots par défaut si aucun n'est configuré
    const defaultPrizes = [
      { 
        id: 1,
        emoji: "🚗", 
        name: "Voiture Tesla Model 3", 
        value: "45,000€",
        image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=300&h=200&fit=crop",
        description: "Tesla Model 3 neuve - Autonomie 500km",
        order: 1,
        isActive: true,
        winner: null
      },
      { 
        id: 2,
        emoji: "✈️", 
        name: "Voyage aux Maldives", 
        value: "5,000€",
        image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=300&h=200&fit=crop",
        description: "7 nuits tout inclus dans un resort 5 étoiles",
        order: 2,
        isActive: true,
        winner: null
      },
      { 
        id: 3,
        emoji: "💎", 
        name: "Bague en diamant", 
        value: "2,500€",
        image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=300&h=200&fit=crop",
        description: "Bague en or blanc avec diamant 1 carat",
        order: 3,
        isActive: true,
        winner: null
      }
    ];
    
    this.savePrizes(defaultPrizes);
    return defaultPrizes;
  },

  // ✅ SAUVEGARDER LES LOTS
  savePrizes(prizes) {
    localStorage.setItem('tombolaPrizes', JSON.stringify(prizes));
  },

  // ✅ AJOUTER UN NOUVEAU LOT
  addPrize(prizeData) {
    const prizes = this.getPrizes();
    const newPrize = {
      id: Date.now(),
      emoji: prizeData.emoji || "🎁",
      name: prizeData.name,
      value: prizeData.value,
      image: prizeData.image || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop",
      description: prizeData.description,
      order: prizes.length + 1,
      isActive: true,
      winner: null,
      createdAt: new Date().toISOString()
    };
    
    prizes.push(newPrize);
    this.savePrizes(prizes);
    return newPrize;
  },

  // ✅ MODIFIER UN LOT EXISTANT
  updatePrize(prizeId, updates) {
    const prizes = this.getPrizes();
    const updatedPrizes = prizes.map(prize => 
      prize.id === prizeId ? { ...prize, ...updates, updatedAt: new Date().toISOString() } : prize
    );
    this.savePrizes(updatedPrizes);
    return updatedPrizes.find(prize => prize.id === prizeId);
  },

  // ✅ SUPPRIMER UN LOT
  deletePrize(prizeId) {
    const prizes = this.getPrizes();
    const filteredPrizes = prizes.filter(prize => prize.id !== prizeId);
    this.savePrizes(filteredPrizes);
    return filteredPrizes;
  },

  // ✅ RÉORGANISER L'ORDRE DES LOTS
  reorderPrizes(newOrder) {
    const prizes = this.getPrizes();
    const reorderedPrizes = newOrder.map((prizeId, index) => {
      const prize = prizes.find(p => p.id === prizeId);
      return { ...prize, order: index + 1 };
    });
    this.savePrizes(reorderedPrizes);
    return reorderedPrizes;
  },

  // ✅ ASSIGNER UN GAGNANT À UN LOT
  assignWinner(prizeId, winnerInfo) {
    const prizes = this.getPrizes();
    const updatedPrizes = prizes.map(prize => 
      prize.id === prizeId ? { 
        ...prize, 
        winner: winnerInfo,
        wonAt: new Date().toISOString()
      } : prize
    );
    this.savePrizes(updatedPrizes);
    return updatedPrizes.find(prize => prize.id === prizeId);
  },

  // ✅ RÉINITIALISER LES GAGNANTS DES LOTS
  resetWinners() {
    const prizes = this.getPrizes();
    const resetPrizes = prizes.map(prize => ({
      ...prize,
      winner: null,
      wonAt: null
    }));
    this.savePrizes(resetPrizes);
    return resetPrizes;
  },

  // ✅ GÉNÉRER UN RAPPORT DES LOTS
  generatePrizesReport() {
    const prizes = this.getPrizes();
    const activePrizes = prizes.filter(p => p.isActive);
    const awardedPrizes = prizes.filter(p => p.winner);
    
    return {
      totalPrizes: prizes.length,
      activePrizes: activePrizes.length,
      awardedPrizes: awardedPrizes.length,
      totalValue: activePrizes.reduce((sum, prize) => {
        const value = parseInt(prize.value.replace(/[^\d]/g, '')) || 0;
        return sum + value;
      }, 0),
      prizesByStatus: {
        active: activePrizes,
        inactive: prizes.filter(p => !p.isActive),
        awarded: awardedPrizes
      }
    };
  },

  // ✅ EXEMPLES DE LOTS PRÉDÉFINIS
  getSamplePrizes() {
    return [
      {
        emoji: "📱",
        name: "iPhone 15 Pro",
        value: "1,200€",
        image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=300&h=200&fit=crop",
        description: "Dernier iPhone 128GB"
      },
      {
        emoji: "🎮",
        name: "PlayStation 5",
        value: "500€",
        image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=300&h=200&fit=crop",
        description: "Console PS5 avec manuel"
      },
      {
        emoji: "💻",
        name: "MacBook Air",
        value: "1,300€",
        image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=300&h=200&fit=crop",
        description: "MacBook Air M2 13 pouces"
      },
      {
        emoji: "🛍️",
        name: "Carte cadeau Amazon",
        value: "500€",
        image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=200&fit=crop",
        description: "Carte cadeau utilisable sur Amazon"
      }
    ];
  }
};
