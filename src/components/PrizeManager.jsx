import React, { useState, useEffect } from 'react';
import { PrizeManager } from '../utils/prizeManager';

const PrizeManagerComponent = () => {
  const [prizes, setPrizes] = useState([]);
  const [editingPrize, setEditingPrize] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPrize, setNewPrize] = useState({
    emoji: "🎁",
    name: "",
    value: "",
    image: "",
    description: ""
  });

  useEffect(() => {
    loadPrizes();
  }, []);

  const loadPrizes = () => {
    const loadedPrizes = PrizeManager.getPrizes();
    setPrizes(loadedPrizes.sort((a, b) => a.order - b.order));
  };

  const handleAddPrize = () => {
    if (!newPrize.name || !newPrize.value) {
      alert('Veuillez remplir au moins le nom et la valeur du lot');
      return;
    }

    PrizeManager.addPrize(newPrize);
    setNewPrize({
      emoji: "🎁",
      name: "",
      value: "",
      image: "",
      description: ""
    });
    setShowAddForm(false);
    loadPrizes();
  };

  const handleUpdatePrize = (prizeId, updates) => {
    PrizeManager.updatePrize(prizeId, updates);
    setEditingPrize(null);
    loadPrizes();
  };

  const handleDeletePrize = (prizeId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce lot ?')) {
      PrizeManager.deletePrize(prizeId);
      loadPrizes();
    }
  };

  const handleReorder = (fromIndex, toIndex) => {
    const reorderedPrizes = [...prizes];
    const [movedPrize] = reorderedPrizes.splice(fromIndex, 1);
    reorderedPrizes.splice(toIndex, 0, movedPrize);
    
    const prizeIds = reorderedPrizes.map(prize => prize.id);
    PrizeManager.reorderPrizes(prizeIds);
    loadPrizes();
  };

  const handleToggleActive = (prizeId, isActive) => {
    PrizeManager.updatePrize(prizeId, { isActive });
    loadPrizes();
  };

  const addSamplePrizes = () => {
    const samplePrizes = PrizeManager.getSamplePrizes();
    samplePrizes.forEach(prize => {
      PrizeManager.addPrize(prize);
    });
    loadPrizes();
  };

  const resetAllWinners = () => {
    if (window.confirm('Réinitialiser tous les gagnants ?')) {
      PrizeManager.resetWinners();
      loadPrizes();
    }
  };

  const report = PrizeManager.generatePrizesReport();

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* En-tête */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold">🎁 Gestion des Lots</h1>
            <p className="text-gray-400 mt-2">Configurez les lots de votre tombola</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-semibold"
            >
              ➕ Ajouter un Lot
            </button>
            <button
              onClick={addSamplePrizes}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold"
            >
              🧪 Lots Exemples
            </button>
            <button
              onClick={resetAllWinners}
              className="bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded-lg font-semibold"
            >
              🔄 Reset Gagnants
            </button>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-600 p-4 rounded-lg">
            <div className="text-2xl font-bold">{report.totalPrizes}</div>
            <div>Total Lots</div>
          </div>
          <div className="bg-green-600 p-4 rounded-lg">
            <div className="text-2xl font-bold">{report.activePrizes}</div>
            <div>Lots Actifs</div>
          </div>
          <div className="bg-purple-600 p-4 rounded-lg">
            <div className="text-2xl font-bold">{report.awardedPrizes}</div>
            <div>Lots Attribués</div>
          </div>
          <div className="bg-yellow-600 p-4 rounded-lg">
            <div className="text-2xl font-bold">€{report.totalValue}</div>
            <div>Valeur Totale</div>
          </div>
        </div>

        {/* Formulaire d'ajout */}
        {showAddForm && (
          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-bold mb-4">➕ Ajouter un Nouveau Lot</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Emoji</label>
                <input
                  type="text"
                  value={newPrize.emoji}
                  onChange={(e) => setNewPrize({...newPrize, emoji: e.target.value})}
                  className="w-full p-3 bg-gray-700 rounded-lg"
                  placeholder="🎁"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Nom du Lot *</label>
                <input
                  type="text"
                  value={newPrize.name}
                  onChange={(e) => setNewPrize({...newPrize, name: e.target.value})}
                  className="w-full p-3 bg-gray-700 rounded-lg"
                  placeholder="Voiture Tesla"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Valeur *</label>
                <input
                  type="text"
                  value={newPrize.value}
                  onChange={(e) => setNewPrize({...newPrize, value: e.target.value})}
                  className="w-full p-3 bg-gray-700 rounded-lg"
                  placeholder="45,000€"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Image URL</label>
                <input
                  type="text"
                  value={newPrize.image}
                  onChange={(e) => setNewPrize({...newPrize, image: e.target.value})}
                  className="w-full p-3 bg-gray-700 rounded-lg"
                  placeholder="https://..."
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={newPrize.description}
                  onChange={(e) => setNewPrize({...newPrize, description: e.target.value})}
                  className="w-full p-3 bg-gray-700 rounded-lg"
                  rows="3"
                  placeholder="Description détaillée du lot..."
                />
              </div>
            </div>
            <div className="flex gap-4 mt-4">
              <button
                onClick={handleAddPrize}
                className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg font-semibold"
              >
                ✅ Ajouter
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded-lg font-semibold"
              >
                ❌ Annuler
              </button>
            </div>
          </div>
        )}

        {/* Liste des lots */}
        <div className="space-y-4">
          {prizes.map((prize, index) => (
            <div key={prize.id} className={`bg-gray-800 rounded-lg p-6 ${!prize.isActive ? 'opacity-60' : ''}`}>
              {editingPrize === prize.id ? (
                <EditPrizeForm 
                  prize={prize} 
                  onSave={(updates) => handleUpdatePrize(prize.id, updates)}
                  onCancel={() => setEditingPrize(null)}
                />
              ) : (
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="text-3xl">{prize.emoji}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold">{prize.name}</h3>
                        <span className="bg-yellow-500 text-yellow-900 px-2 py-1 rounded text-sm font-bold">
                          {prize.value}
                        </span>
                        {!prize.isActive && (
                          <span className="bg-gray-500 text-white px-2 py-1 rounded text-xs">
                            Inactif
                          </span>
                        )}
                        {prize.winner && (
                          <span className="bg-green-500 text-white px-2 py-1 rounded text-xs">
                            🏆 Attribué
                          </span>
                        )}
                      </div>
                      <p className="text-gray-400 mb-2">{prize.description}</p>
                      {prize.winner && (
                        <div className="bg-green-900/30 p-3 rounded mt-2">
                          <div className="text-sm text-green-400">
                            🎉 Gagnant: <strong>{prize.winner.participant}</strong> 
                            (Ticket #{prize.winner.ticketNumber})
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => setEditingPrize(prize.id)}
                      className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded text-sm"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleToggleActive(prize.id, !prize.isActive)}
                      className={`px-3 py-2 rounded text-sm ${
                        prize.isActive 
                          ? 'bg-orange-600 hover:bg-orange-700' 
                          : 'bg-green-600 hover:bg-green-700'
                      }`}
                    >
                      {prize.isActive ? '⏸️' : '▶️'}
                    </button>
                    <button
                      onClick={() => handleDeletePrize(prize.id)}
                      className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded text-sm"
                    >
                      🗑️
                    </button>
                    {index > 0 && (
                      <button
                        onClick={() => handleReorder(index, index - 1)}
                        className="bg-gray-600 hover:bg-gray-700 px-3 py-2 rounded text-sm"
                      >
                        ⬆️
                      </button>
                    )}
                    {index < prizes.length - 1 && (
                      <button
                        onClick={() => handleReorder(index, index + 1)}
                        className="bg-gray-600 hover:bg-gray-700 px-3 py-2 rounded text-sm"
                      >
                        ⬇️
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {prizes.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <div className="text-6xl mb-4">🎁</div>
            <p className="text-xl mb-2">Aucun lot configuré</p>
            <p className="text-sm">Commencez par ajouter votre premier lot !</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Composant de formulaire d'édition
const EditPrizeForm = ({ prize, onSave, onCancel }) => {
  const [formData, setFormData] = useState({ ...prize });

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium mb-2">Emoji</label>
        <input
          type="text"
          value={formData.emoji}
          onChange={(e) => setFormData({...formData, emoji: e.target.value})}
          className="w-full p-2 bg-gray-700 rounded"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Nom</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          className="w-full p-2 bg-gray-700 rounded"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Valeur</label>
        <input
          type="text"
          value={formData.value}
          onChange={(e) => setFormData({...formData, value: e.target.value})}
          className="w-full p-2 bg-gray-700 rounded"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Image URL</label>
        <input
          type="text"
          value={formData.image}
          onChange={(e) => setFormData({...formData, image: e.target.value})}
          className="w-full p-2 bg-gray-700 rounded"
        />
      </div>
      <div className="md:col-span-2">
        <label className="block text-sm font-medium mb-2">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          className="w-full p-2 bg-gray-700 rounded"
          rows="2"
        />
      </div>
      <div className="md:col-span-2 flex gap-4">
        <button
          onClick={handleSave}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
        >
          ✅ Sauvegarder
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded"
        >
          ❌ Annuler
        </button>
      </div>
    </div>
  );
};

export default PrizeManagerComponent;
