import React, { useState, useEffect } from 'react';
import { WhatsAppService } from '../utils/whatsappService';
import { AnalyticsService } from '../utils/analyticsService';

const Confirmation = () => {
  const [tickets, setTickets] = useState([]);
  const [participantInfo, setParticipantInfo] = useState({});
  const [whatsappLinks, setWhatsappLinks] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AnalyticsService.trackPageView('confirmation');
    
    console.log('=== 📋 DEBUG CONFIRMATION PAGE ===');
    console.log('URL complète:', window.location.href);
    console.log('Hash:', window.location.hash);
    
    // ✅ CORRECTION : Extraire les paramètres du HASH (#)
    const hash = window.location.hash;
    const queryString = hash.split('?')[1] || '';
    const hashParams = new URLSearchParams(queryString);
    
    console.log('Paramètres hash extraits:', Array.from(hashParams.entries()));
    
    const ticketNumbers = hashParams.get('tickets')?.split(',') || [];
    const participantName = hashParams.get('name') || 'Participant';
    const participantPhone = hashParams.get('phone') || '';
    const participantEmail = hashParams.get('email') || '';
    const ticketCount = hashParams.get('count') || '1';
    const amount = hashParams.get('amount') || '5';
    
    console.log('Données finales:', {
      ticketNumbers,
      participantName, 
      participantPhone,
      participantEmail,
      ticketCount,
      amount
    });

    // Créer des objets tickets complets
    const ticketsData = ticketNumbers.map((number, index) => ({
      id: index + 1,
      number: number,
      purchaseDate: new Date().toISOString(),
      participant: participantName,
      email: participantEmail,
      isDrawn: false,
      drawResult: null
    }));

    setTickets(ticketsData);
    setParticipantInfo({
      name: participantName,
      phone: participantPhone,
      email: participantEmail,
      count: ticketCount,
      amount: amount
    });

    // Générer les liens WhatsApp
    if (participantPhone) {
      const links = WhatsAppService.generateMessageLinks(
        participantPhone,
        participantName,
        ticketNumbers,
        parseInt(amount)
      );
      console.log('📱 Liens WhatsApp générés:', links);
      setWhatsappLinks(links);
    }

    setLoading(false);
  }, []);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('📋 Lien copié dans le presse-papier !');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg">Chargement de vos tickets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-500 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* En-tête principale */}
        <div className="bg-white rounded-lg shadow-xl p-8 text-center mb-8">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Paiement Réussi !</h1>
          <p className="text-xl text-gray-600 mb-2">
            Félicitations {participantInfo.name} ! Vos {tickets.length} ticket(s) ont été générés avec succès
          </p>
          <p className="text-gray-500">Tirage le 25 Décembre 2024 - Bonne chance !</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne gauche : Tickets */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">🎫 Vos Tickets</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {tickets.map(ticket => (
                  <div key={ticket.id} className="bg-gradient-to-br from-blue-50 to-green-50 rounded-lg shadow-md p-4 text-center transform hover:scale-105 transition duration-300 border border-blue-100">
                    <div className="text-3xl mb-2">🎫</div>
                    <div className="text-xl font-bold text-gray-800 mb-2 font-mono">#{ticket.number}</div>
                    <div className="text-sm text-gray-500 mb-1">
                      Acheté le {new Date(ticket.purchaseDate).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-500 mb-1">Par {ticket.participant}</div>
                    <div className={`text-sm font-semibold ${ticket.isDrawn ? 'text-green-600' : 'text-blue-600'}`}>
                      {ticket.isDrawn ? '🎊 Déjà tiré' : '⏳ En attente du tirage'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Colonne droite : WhatsApp et Actions */}
          <div className="space-y-6">
            {/* 📱 SECTION WHATSAPP */}
            {whatsappLinks ? (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="font-semibold text-green-800 mb-4 text-lg flex items-center gap-2">
                  <span>📱</span>
                  Recevez vos confirmations sur WhatsApp
                </h3>
                
                <div className="space-y-4">
                  {/* Lien Confirmation Achat */}
                  <div>
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>Confirmation immédiate :</strong> Envoyez la confirmation de vos tickets
                    </p>
                    <a
                      href={whatsappLinks.purchaseConfirmation}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block bg-green-500 hover:bg-green-600 text-white text-center py-3 rounded-lg font-semibold transition transform hover:scale-105"
                    >
                      💚 Envoyer sur WhatsApp
                    </a>
                  </div>

                  {/* Lien Rappel Tirage */}
                  <div>
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>Rappel de tirage :</strong> Programmez un rappel pour ne pas manquer le tirage
                    </p>
                    <a
                      href={whatsappLinks.drawReminder}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block bg-blue-500 hover:bg-blue-600 text-white text-center py-3 rounded-lg font-semibold transition transform hover:scale-105"
                    >
                      ⏰ Rappel Tirage
                    </a>
                  </div>

                  {/* Option Copie */}
                  <button
                    onClick={() => copyToClipboard(whatsappLinks.purchaseConfirmation)}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg text-sm transition"
                  >
                    📋 Copier le lien
                  </button>
                </div>
              </div>
            ) : (
              // Si pas de numéro WhatsApp
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="font-semibold text-yellow-800 mb-3 flex items-center gap-2">
                  <span>💡</span>
                  Conseil : Ajoutez WhatsApp
                </h3>
                <p className="text-sm text-yellow-700">
                  Pour recevoir confirmations et résultats instantanément, 
                  donnez votre numéro WhatsApp lors du prochain achat !
                </p>
              </div>
            )}

            {/* Section Email et Actions */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span>📧</span>
                Email de confirmation
              </h3>
              <p className="text-gray-600 mb-6">
                Un récapitulatif de votre achat avec vos numéros de tickets a été envoyé à{' '}
                <strong>{participantInfo.email || tickets[0]?.email}</strong>.
              </p>

              <div className="space-y-3">
                <button 
                  onClick={() => (window.location.hash = '#/live')}
                  className="w-full bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold transition transform hover:scale-105"
                >
                  📺 Voir le tirage en direct
                </button>
                <button 
                  onClick={() => (window.location.hash = '#/my-tickets')}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition transform hover:scale-105"
                >
                  🎫 Mes tickets
                </button>
                <button 
                  onClick={() => (window.location.hash = '#/')}
                  className="w-full bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition transform hover:scale-105"
                >
                  🏠 Retour à l'accueil
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
