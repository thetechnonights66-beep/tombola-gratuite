import React, { useState, useEffect } from 'react';
import { TicketStorage } from '../utils/ticketStorage';
import { ReferralSystem } from '../utils/referralSystem';

// ✅ COMPOSANT STATISTIQUES PERSONNELLES AVANCÉES
const PersonalStats = ({ tickets, email }) => {
  if (tickets.length === 0) return null;

  const stats = {
    totalTickets: tickets.length,
    totalSpent: tickets.reduce((sum, t) => sum + t.price, 0),
    drawnTickets: tickets.filter(t => t.isDrawn).length,
    winningTickets: tickets.filter(t => t.isDrawn && t.drawResult?.includes('Gagnant')).length,
    referralTickets: tickets.filter(t => t.source === 'referral_reward').length,
    activeTickets: tickets.filter(t => !t.isDrawn).length,
    lastPurchase: tickets.length > 0 ? new Date(tickets[tickets.length - 1].purchaseDate) : null
  };

  const winRate = stats.drawnTickets > 0 
    ? ((stats.winningTickets / stats.drawnTickets) * 100).toFixed(1)
    : 0;

  const daysSinceLastPurchase = stats.lastPurchase 
    ? Math.floor((new Date() - stats.lastPurchase) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white mb-6 shadow-lg">
      <h3 className="text-xl font-bold mb-4 text-center">📈 Mes Statistiques Personnelles</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold">{stats.totalTickets}</div>
          <div className="text-sm text-blue-100">Total Tickets</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">€{stats.totalSpent}</div>
          <div className="text-sm text-blue-100">Total Dépensé</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">{stats.activeTickets}</div>
          <div className="text-sm text-blue-100">Tickets Actifs</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">{winRate}%</div>
          <div className="text-sm text-blue-100">Taux de Gain</div>
        </div>
      </div>

      {/* Barres de progression */}
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Progression des tirages</span>
            <span>{stats.drawnTickets}/{stats.totalTickets}</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-green-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(stats.drawnTickets / stats.totalTickets) * 100}%` }}
            ></div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Tickets gagnants</span>
            <span>{stats.winningTickets}/{stats.drawnTickets || 0}</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${stats.drawnTickets > 0 ? (stats.winningTickets / stats.drawnTickets) * 100 : 0}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Informations supplémentaires */}
      <div className="grid grid-cols-2 gap-4 mt-4 text-center">
        <div className="bg-white/10 rounded-lg p-2">
          <div className="text-sm text-blue-200">Tickets Offerts</div>
          <div className="font-bold text-yellow-300">{stats.referralTickets}</div>
        </div>
        <div className="bg-white/10 rounded-lg p-2">
          <div className="text-sm text-blue-200">Dernier achat</div>
          <div className="font-bold text-sm">
            {daysSinceLastPurchase !== null 
              ? daysSinceLastPurchase === 0 
                ? "Aujourd'hui" 
                : `Il y a ${daysSinceLastPurchase} jour(s)`
              : "Aucun"
            }
          </div>
        </div>
      </div>
    </div>
  );
};

// ✅ COMPOSANT ESTIMATION DES CHANCES DE GAIN
const ChanceCalculator = ({ tickets }) => {
  const allTickets = TicketStorage.getTickets();
  const activeTickets = tickets.filter(t => !t.isDrawn);
  const totalActiveTickets = allTickets.filter(t => !t.isDrawn).length;
  
  if (activeTickets.length === 0) return null;

  const chancePerTicket = totalActiveTickets > 0 ? (1 / totalActiveTickets * 100) : 0;
  const totalChance = Math.min(chancePerTicket * activeTickets.length, 100);
  const nextDrawTickets = Math.min(5, totalActiveTickets); // Prochain tirage = 5 gagnants

  return (
    <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white mb-6 shadow-lg">
      <h3 className="text-xl font-bold mb-4 text-center">🎯 Estimation de vos chances</h3>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-2xl font-bold">{activeTickets.length}</div>
            <div className="text-sm text-green-100">Vos tickets actifs</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-2xl font-bold">{totalActiveTickets}</div>
            <div className="text-sm text-green-100">Total en jeu</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Chance par ticket:</span>
            <span className="font-bold">{chancePerTicket.toFixed(3)}%</span>
          </div>
          <div className="flex justify-between text-lg font-bold border-t border-white/20 pt-2">
            <span>Chance totale estimée:</span>
            <span className="text-yellow-300">{totalChance.toFixed(2)}%</span>
          </div>
        </div>
        
        {/* Barre de chance visuelle */}
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Faible</span>
            <span>Élevée</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 h-3 rounded-full transition-all duration-1000"
              style={{ width: `${totalChance}%` }}
            ></div>
          </div>
        </div>

        {/* Conseils personnalisés */}
        <div className="mt-4 p-3 bg-white/10 rounded-lg border border-white/20">
          <p className="text-sm text-center font-semibold">
            {totalChance < 10 
              ? "💡 Augmentez vos chances en achetant plus de tickets !"
              : totalChance < 30
              ? "🎯 Bonnes chances ! Vous êtes bien positionné."
              : totalChance < 60
              ? "🌟 Très bonnes chances ! Continuez comme ça."
              : "🏆 Excellentes chances ! Vous êtes parmi les favoris !"
            }
          </p>
          {totalChance < 20 && (
            <p className="text-xs text-center mt-2 text-green-200">
              Chaque ticket supplémentaire augmente significativement vos chances !
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// ✅ COMPOSANT RAPPEL DE TIRAGE INTELLIGENT
const DrawReminder = ({ tickets }) => {
  const nextDrawDate = new Date('2024-12-25T20:00:00'); // Tirage de Noël à 20h
  const today = new Date();
  const timeUntilDraw = nextDrawDate - today;
  const daysUntilDraw = Math.ceil(timeUntilDraw / (1000 * 60 * 60 * 24));
  const hoursUntilDraw = Math.ceil((timeUntilDraw % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  const activeTickets = tickets.filter(t => !t.isDrawn).length;

  if (activeTickets === 0) return null;

  const isDrawToday = daysUntilDraw === 0;
  const isDrawImminent = daysUntilDraw <= 1;

  return (
    <div className={`rounded-xl p-4 text-white mb-6 shadow-lg ${
      isDrawImminent 
        ? 'bg-gradient-to-r from-red-500 to-orange-500 animate-pulse' 
        : 'bg-gradient-to-r from-orange-500 to-amber-500'
    }`}>
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex-1">
          <h4 className="font-bold text-lg flex items-center gap-2">
            ⏰ {isDrawToday ? "TIRAGE AUJOURD'HUI !" : "Prochain tirage"}
          </h4>
          <p className="text-sm mt-1">
            {isDrawToday 
              ? `À ${hoursUntilDraw}h - ${activeTickets} ticket(s) en jeu !`
              : `Dans ${daysUntilDraw} jour(s) - ${activeTickets} ticket(s) actifs`
            }
          </p>
          {isDrawImminent && (
            <p className="text-xs mt-2 text-orange-100 font-semibold">
              🚀 Ne manquez pas le tirage en direct !
            </p>
          )}
        </div>
        <button 
          onClick={() => window.location.hash = '#/live'}
          className="bg-white text-orange-600 px-4 py-2 rounded-lg font-bold hover:bg-orange-50 transition transform hover:scale-105 shadow-lg whitespace-nowrap"
        >
          {isDrawToday ? "📺 REGARDER LE LIVE" : "📅 VOIR LE DIRECT"}
        </button>
      </div>

      {/* Compte à rebours visuel pour le jour J */}
      {isDrawToday && (
        <div className="mt-3 pt-3 border-t border-white/20">
          <div className="flex justify-around text-center">
            <div>
              <div className="text-xl font-bold">{hoursUntilDraw}</div>
              <div className="text-xs text-orange-100">Heures</div>
            </div>
            <div>
              <div className="text-xl font-bold">{Math.ceil((timeUntilDraw % (1000 * 60 * 60)) / (1000 * 60))}</div>
              <div className="text-xs text-orange-100">Minutes</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ✅ COMPOSANT PANNEAU PARRAINAGE (EXISTANT - CONSERVÉ)
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

// ✅ COMPOSANT PRINCIPAL MyTickets AMÉLIORÉ
const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [email, setEmail] = useState('');
  const [currentParticipant, setCurrentParticipant] = useState(null);

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

  // ✅ RECHERCHE AUTOMATIQUE SI EMAIL DANS URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const emailFromUrl = urlParams.get('email');
    if (emailFromUrl) {
      setEmail(emailFromUrl);
      setTimeout(() => {
        const participantTickets = TicketStorage.getParticipantTickets(emailFromUrl);
        setTickets(participantTickets);
        if (participantTickets.length > 0) {
          setCurrentParticipant({
            name: participantTickets[0].participant,
            email: emailFromUrl
          });
        }
      }, 100);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* ✅ LAYOUT AVEC GRID POUR LE PARRAINAGE */}
        <div className="grid md:grid-cols-3 gap-8">
          
          {/* ✅ COLONNE PRINCIPALE - TICKETS ET STATISTIQUES */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h1 className="text-3xl font-bold text-center mb-6">🎫 Mes Tickets & Statistiques</h1>
              
              <div className="max-w-md mx-auto mb-6">
                <label className="block text-sm font-medium mb-2">
                  Entrez votre email pour voir vos tickets
                </label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="votre@email.com"
                    className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && searchTickets()}
                  />
                  <button
                    onClick={searchTickets}
                    className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition font-semibold"
                  >
                    Rechercher
                  </button>
                </div>
              </div>

              {tickets.length > 0 && (
                <div>
                  {/* ✅ AJOUT DES NOUVELLES FONCTIONNALITÉS */}
                  <PersonalStats tickets={tickets} email={email} />
                  <ChanceCalculator tickets={tickets} />
                  <DrawReminder tickets={tickets} />
                  
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
                      <div key={ticket.id} className={`border-2 rounded-lg p-4 transition-all duration-300 hover:scale-105 ${
                        ticket.isDrawn 
                          ? ticket.drawResult?.includes('Gagnant')
                            ? 'bg-gradient-to-br from-green-50 to-emerald-100 border-green-300 shadow-lg'
                            : 'bg-gray-50 border-gray-200'
                          : 'bg-gradient-to-br from-blue-50 to-cyan-100 border-blue-300 shadow-md hover:shadow-lg'
                      }`}>
                        <div className="text-center">
                          <div className="text-3xl mb-2">🎫</div>
                          <div className="text-2xl font-bold text-gray-800 font-mono">#{ticket.number}</div>
                          <div className="text-sm text-gray-600 mt-1">
                            Acheté le {new Date(ticket.purchaseDate).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-gray-500">Par {ticket.participant}</div>
                          <div className={`text-sm font-semibold mt-2 ${
                            ticket.isDrawn 
                              ? ticket.drawResult?.includes('Gagnant')
                                ? 'text-green-600 bg-green-100 px-2 py-1 rounded-full'
                                : 'text-gray-600'
                              : 'text-blue-600 bg-blue-100 px-2 py-1 rounded-full animate-pulse'
                          }`}>
                            {ticket.isDrawn 
                              ? ticket.drawResult?.includes('Gagnant')
                                ? '🎉 GAGNANT !'
                                : '✅ Tiré le ' + new Date(ticket.drawDate).toLocaleDateString()
                              : '⏳ En attente du tirage'
                            }
                          </div>
                          {ticket.drawResult && !ticket.drawResult.includes('Gagnant') && (
                            <div className="text-xs text-gray-500 mt-1">
                              {ticket.drawResult}
                            </div>
                          )}
                          {ticket.source === 'referral_reward' && (
                            <div className="text-xs text-purple-600 font-semibold mt-1 bg-purple-100 px-2 py-1 rounded-full">
                              🎁 Ticket offert - Parrainage
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="text-center text-gray-600 bg-gray-100 py-2 rounded-lg">
                    <span className="font-semibold">
                      {tickets.filter(t => t.isDrawn).length} / {tickets.length} tickets tirés
                    </span>
                    {tickets.filter(t => !t.isDrawn).length > 0 && (
                      <span className="ml-4 text-blue-600">
                        • {tickets.filter(t => !t.isDrawn).length} en attente du tirage
                      </span>
                    )}
                  </div>
                </div>
              )}

              {tickets.length === 0 && email && (
                <div className="text-center text-gray-500 py-8">
                  <div className="text-4xl mb-4">📭</div>
                  <p className="text-lg">Aucun ticket trouvé pour cet email</p>
                  <p className="text-sm mt-2">
                    Vérifiez l'email ou achetez vos premiers tickets !
                  </p>
                  <button
                    onClick={() => window.location.hash = '#/buy'}
                    className="mt-4 bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition font-semibold"
                  >
                    🎫 Acheter mes premiers tickets
                  </button>
                </div>
              )}

              {!email && (
                <div className="text-center text-gray-500 py-8">
                  <div className="text-4xl mb-4">🔍</div>
                  <p className="text-lg">Entrez votre email pour voir vos tickets</p>
                  <p className="text-sm mt-2">
                    Vous découvrirez vos statistiques personnelles, vos chances de gain et pourrez accéder à votre espace parrainage
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
