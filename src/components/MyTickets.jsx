import React, { useState } from 'react';
import { TicketStorage } from '../utils/ticketStorage';
import { ReferralSystem } from '../utils/referralSystem'; // ✅ NOUVEAU IMPORT

// ✅ COMPOSANT PANNEAU PARRAINAGE
const ReferralPanel = ({ participant }) => {
  const [referralStats, setReferralStats] = useState({
    code: '',
    totalReferrals: 0,
    validatedReferrals: 0,
    pendingReferrals: 0,
    ticketsEarned: 0,
    progress: 0
  });

  React.useEffect(() => {
    if (participant.email) {
      loadReferralStats();
    }
  }, [participant]);

  const loadReferralStats = () => {
    const code = ReferralSystem.generateReferralCode(
      Date.now(), 
      participant.name
    );
    
    const stats = ReferralSystem.getUserStats(participant.email);
    
    setReferralStats({
      code,
      ...stats,
      progress: Math.min((stats.validatedReferrals / 5) * 100, 100)
    });
  };

  const shareReferral = async () => {
    const shareText = `🎪 **Tombola Excursion - Rejoins l'aventure !** 🎪

J'ai un code spécial à te partagner : 
**${referralStats.code}**

🎁 **Ce que tu gagnes :**
• Participation à des lots incroyables 🚗✈️💎
• Une chance de gagner des prix exceptionnels

🎁 **Ce que je gagne :**
• 1 point vers un ticket gratuit pour chaque parrainage validé
• 1 TICKET GRATUIT après 5 parrainages !

👉 Utilise mon code lors de ton inscription sur :
${window.location.origin}${window.location.pathname}

À bientôt dans la tombola ! 🎉`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Rejoins la Tombola Excursion !',
          text: shareText,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Partage annulé');
      }
    } else {
      // Fallback : copie dans le presse-papier
      navigator.clipboard.writeText(shareText);
      alert('📋 Super ! Le message a été copié dans ton presse-papier.\n\nTu peux maintenant le partager à tes amis par message, email ou sur les réseaux sociaux !');
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white shadow-xl">
      <h3 className="text-2xl font-bold mb-2">👥 Parraine tes amis</h3>
      <p className="text-purple-100 mb-6">
        Gagne des tickets gratuits en partageant la tombola avec ton entourage !
      </p>

      {/* Code de parrainage */}
      <div className="bg-white/20 rounded-xl p-4 mb-6 backdrop-blur border border-white/30">
        <div className="text-center mb-3">
          <div className="text-sm text-purple-200 mb-2">Ton code personnel unique</div>
          <div className="font-mono text-2xl font-bold tracking-wider bg-white/10 py-2 rounded-lg">
            {referralStats.code}
          </div>
        </div>
        
        <button
          onClick={shareReferral}
          className="w-full bg-white text-purple-600 py-3 rounded-lg font-bold hover:bg-purple-50 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
        >
          <span>📤</span>
          Partager mon code avec des amis
        </button>
      </div>

      {/* Statistiques personnelles */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white/10 rounded-lg p-3 text-center backdrop-blur">
          <div className="text-2xl font-bold">{referralStats.validatedReferrals}/5</div>
          <div className="text-xs text-purple-200">Parrainages validés</div>
        </div>
        <div className="bg-white/10 rounded-lg p-3 text-center backdrop-blur">
          <div className="text-2xl font-bold">{referralStats.ticketsEarned}</div>
          <div className="text-xs text-purple-200">Tickets gagnés</div>
        </div>
      </div>

      {/* Barre de progression */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-purple-200">Progression vers ton prochain ticket gratuit</span>
          <span className="font-semibold">{referralStats.validatedReferrals}/5</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-3">
          <div 
            className="bg-yellow-400 h-3 rounded-full transition-all duration-500 shadow-lg"
            style={{ width: `${referralStats.progress}%` }}
          ></div>
        </div>
        <p className="text-xs text-purple-200 mt-2 text-center">
          {referralStats.validatedReferrals < 5 
            ? `Plus que ${5 - referralStats.validatedReferrals} parrainage(s) pour gagner un ticket gratuit !`
            : '🎉 Félicitations ! Tu as gagné un ticket gratuit !'
          }
        </p>
      </div>

      {/* Comment ça marche */}
      <div className="bg-white/10 rounded-lg p-4 backdrop-blur border border-white/20">
        <h4 className="font-bold mb-3 text-lg">🎯 Comment ça marche ?</h4>
        <ul className="text-sm space-y-2 text-purple-100">
          <li className="flex items-start gap-2">
            <span className="text-yellow-400">1.</span>
            <span>Partage ton code personnel avec tes amis et famille</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-400">2.</span>
            <span>Ils doivent saisir ton code lors de leur premier achat</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-400">3.</span>
            <span>Dès qu'ils achètent, ton parrainage est validé</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-400">4.</span>
            <span>Après 5 parrainages validés : <strong>1 TICKET GRATUIT</strong> pour toi !</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-400">5.</span>
            <span>Le compteur se réinitialise après chaque récompense</span>
          </li>
        </ul>
        
        <div className="mt-4 p-3 bg-yellow-500/20 rounded-lg border border-yellow-400/30">
          <p className="text-xs text-yellow-200 text-center">
            💡 <strong>Astuce :</strong> Partage ton code sur les réseaux sociaux, 
            par message ou email pour maximiser tes chances !
          </p>
        </div>
      </div>
    </div>
  );
};

// ✅ COMPOSANT PRINCIPAL MyTickets
const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [email, setEmail] = useState('');
  const [currentParticipant, setCurrentParticipant] = useState(null); // ✅ NOUVEAU STATE

  const searchTickets = () => {
    if (email) {
      const participantTickets = TicketStorage.getParticipantTickets(email);
      setTickets(participantTickets);
      
      // ✅ DÉFINIR LE PARTICIPANT COURANT POUR LE PARRAINAGE
      if (participantTickets.length > 0) {
        setCurrentParticipant({
          name: participantTickets[0].participant,
          email: email
        });
      } else {
        setCurrentParticipant(null);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* ✅ LAYOUT AVEC GRID POUR LE PARRAINAGE */}
        <div className="grid md:grid-cols-3 gap-8">
          
          {/* ✅ COLONNE PRINCIPALE - TICKETS */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h1 className="text-3xl font-bold text-center mb-6">🎫 Mes Tickets</h1>
              
              <div className="max-w-md mx-auto mb-6">
                <label className="block text-sm font-medium mb-2">
                  Entrez votre email pour voir vos tickets
                </label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="votre@email.com"
                    className="flex-1 p-3 border rounded-lg"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && searchTickets()}
                  />
                  <button
                    onClick={searchTickets}
                    className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
                  >
                    Rechercher
                  </button>
                </div>
              </div>

              {tickets.length > 0 && (
                <div>
                  <div className="mb-4 text-center">
                    <p className="text-lg font-semibold">
                      {tickets.length} ticket(s) trouvé(s) pour <strong>{email}</strong>
                    </p>
                    <p className="text-sm text-gray-600">
                      Participant : <strong>{tickets[0].participant}</strong>
                    </p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {tickets.map(ticket => (
                      <div key={ticket.id} className={`border rounded-lg p-4 ${
                        ticket.isDrawn ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'
                      }`}>
                        <div className="text-center">
                          <div className="text-3xl mb-2">🎫</div>
                          <div className="text-2xl font-bold text-gray-800">#{ticket.number}</div>
                          <div className="text-sm text-gray-600 mt-1">
                            Acheté le {new Date(ticket.purchaseDate).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-gray-500">Par {ticket.participant}</div>
                          <div className={`text-sm font-semibold mt-2 ${
                            ticket.isDrawn ? 'text-green-600' : 'text-blue-600'
                          }`}>
                            {ticket.isDrawn ? '✅ Tiré le ' + new Date(ticket.drawDate).toLocaleDateString() : '⏳ En attente'}
                          </div>
                          {ticket.drawResult && (
                            <div className="text-xs text-gray-500 mt-1">
                              {ticket.drawResult}
                            </div>
                          )}
                          {ticket.source === 'referral_reward' && (
                            <div className="text-xs text-purple-600 font-semibold mt-1">
                              🎁 Ticket offert - Parrainage
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="text-center text-gray-600">
                    {tickets.filter(t => t.isDrawn).length} / {tickets.length} tickets tirés
                  </div>
                </div>
              )}

              {tickets.length === 0 && email && (
                <div className="text-center text-gray-500 py-8">
                  <div className="text-4xl mb-4">📭</div>
                  <p>Aucun ticket trouvé pour cet email</p>
                  <p className="text-sm mt-2">
                    Vérifiez l'email ou achetez vos premiers tickets !
                  </p>
                </div>
              )}

              {!email && (
                <div className="text-center text-gray-500 py-8">
                  <div className="text-4xl mb-4">🔍</div>
                  <p>Entrez votre email pour voir vos tickets</p>
                  <p className="text-sm mt-2">
                    Vous pourrez également accéder à votre espace parrainage
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ✅ COLONNE LATÉRALE - PARRAINAGE */}
          <div className="md:col-span-1">
            {currentParticipant ? (
              <ReferralPanel participant={currentParticipant} />
            ) : (
              <div className="bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl p-6 text-white shadow-xl">
                <h3 className="text-2xl font-bold mb-2">👥 Parrainage</h3>
                <p className="text-blue-100 mb-4">
                  Gagnez des tickets gratuits en parrainant vos amis !
                </p>
                
                <div className="bg-white/20 rounded-xl p-4 backdrop-blur border border-white/30">
                  <div className="text-center">
                    <div className="text-4xl mb-4">🔍</div>
                    <p className="text-sm text-blue-200">
                      Entrez votre email dans la colonne de gauche pour accéder à votre espace parrainage personnel
                    </p>
                  </div>
                </div>

                <div className="mt-4 bg-white/10 rounded-lg p-4 backdrop-blur">
                  <h4 className="font-bold mb-2">🎯 Comment ça marche ?</h4>
                  <ul className="text-sm space-y-1 text-blue-100">
                    <li>• Partagez votre code unique</li>
                    <li>• 1 point par parrainage validé</li>
                    <li>• 1 ticket gratuit après 5 points</li>
                    <li>• Partagez sur les réseaux sociaux</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyTickets;
