import React, { useState, useEffect } from 'react';
import { TicketStorage } from '../utils/ticketStorage';
import { EmailVerification } from '../utils/emailVerification';
import { ReferralSystem } from '../utils/referralSystem';
import { WhatsAppService } from '../utils/whatsappService';
import { AnalyticsService } from '../utils/analyticsService'; // ✅ IMPORT ANALYTICS

const BuyTickets = () => {
  const [ticketCount, setTicketCount] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [participantInfo, setParticipantInfo] = useState({
    name: '',
    email: '',
    phone: '' // ✅ CHAMP WHATSAPP
  });
  const [emailValidation, setEmailValidation] = useState({});
  const [phoneValidation, setPhoneValidation] = useState({}); // ✅ VALIDATION TÉLÉPHONE
  const [allParticipants, setAllParticipants] = useState([]);
  const [referralCode, setReferralCode] = useState('');
  const [referralResult, setReferralResult] = useState(null);

  // ✅ CHARGER LES PARTICIPANTS EXISTANTS
  useEffect(() => {
    const participants = TicketStorage.getAllParticipants();
    setAllParticipants(participants);
  }, []);

  const generateTicketNumber = () => {
    return Math.floor(1000 + Math.random() * 9000);
  };

  // ✅ VALIDER L'EMAIL EN TEMPS RÉEL
  const validateEmail = (email) => {
    if (!email) {
      setEmailValidation({});
      return;
    }
    const analysis = EmailVerification.analyzeEmail(email, allParticipants);
    setEmailValidation(analysis);
  };

  // ✅ VALIDER LE NUMÉRO EN TEMPS RÉEL
  const validatePhone = (phone) => {
    if (!phone) {
      setPhoneValidation({});
      return;
    }

    const testResult = WhatsAppService.testPhoneFormat(phone);
    setPhoneValidation(testResult);
  };

  // ✅ GÉRER LE PARRAINAGE
  const handleReferral = () => {
    if (referralCode.trim()) {
      const result = ReferralSystem.registerReferral(referralCode, participantInfo);
      setReferralResult(result);
      return result.success;
    }
    return true;
  };

  const handlePurchase = () => {
    // ✅ VÉRIFICATION RENFORCÉE AVANT ACHAT
    if (!participantInfo.name || !participantInfo.email) {
      alert('Veuillez remplir vos informations personnelles');
      return;
    }

    // Vérification finale de l'email
    const finalValidation = EmailVerification.analyzeEmail(participantInfo.email, allParticipants);
    
    if (!finalValidation.isValidFormat) {
      alert('❌ Adresse email invalide. Veuillez corriger votre email.');
      return;
    }

    if (finalValidation.isDuplicate) {
      if (!window.confirm('⚠️ Cet email est déjà utilisé. Souhaitez-vous continuer quand même ?')) {
        return;
      }
    }

    if (finalValidation.status === 'faible') {
      if (!window.confirm('⚠️ Cet email semble suspect. Souhaitez-vous continuer quand même ?')) {
        return;
      }
    }

    // ✅ GÉRER LE PARRAINAGE AVANT ACHAT
    if (!handleReferral()) {
      return; // Arrêter si le parrainage échoue
    }

    // ✅ GÉNÉRATION DES TICKETS (ça fonctionne)
    const tickets = [];
    for (let i = 0; i < ticketCount; i++) {
      const ticketNumber = generateTicketNumber();
      const ticket = TicketStorage.addTicket({
        number: ticketNumber,
        price: 5,
        participant: participantInfo.name,
        email: participantInfo.email,
        phone: participantInfo.phone
      });
      tickets.push(ticket);
    }

    // ✅ VALIDER LE PARRAINAGE APRÈS ACHAT RÉUSSI
    if (referralResult && referralResult.success) {
      ReferralSystem.validateReferral(participantInfo.email);
    }

    // 📈 TRACKING ANALYTICS POUR L'ACHAT
    AnalyticsService.trackPurchase({
      amount: ticketCount * 5,
      ticketCount,
      participant: participantInfo.name,
      email: participantInfo.email,
      referralCode: referralResult?.success ? referralCode : null,
      phone: participantInfo.phone || null,
      paymentMethod: paymentMethod
    });

    // 🚨 DEBUG CRITIQUE ICI 🚨
    console.log('=== 🎯 DEBUG REDIRECTION ===');
    console.log('Tickets générés:', tickets);
    console.log('Participant info:', participantInfo);
    
    const queryParams = new URLSearchParams({
      tickets: tickets.map(t => t.number).join(','),
      name: participantInfo.name,
      email: participantInfo.email,
      phone: participantInfo.phone || '',
      count: ticketCount,
      amount: ticketCount * 5
    });

    const confirmationUrl = `#/confirmation?${queryParams.toString()}`;
    console.log('🔗 URL COMPLÈTE:', confirmationUrl);
    console.log('📋 Paramètres:', queryParams.toString());
    
    // ✅ REDIRECTION
    window.location.assign(confirmationUrl);
  };

  // ✅ TRACKING DES INTERACTIONS UTILISATEUR
  const trackInteraction = (action, element) => {
    AnalyticsService.trackEvent('user_interaction', action, element, {
      page: 'buy_tickets',
      ticketCount,
      hasEmail: !!participantInfo.email,
      hasPhone: !!participantInfo.phone
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-3xl font-bold text-center mb-6">Acheter des tickets</h2>
        
        {/* Informations personnelles */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">👤 Vos informations</h3>
          
          {/* Nom */}
          <input
            type="text"
            placeholder="Votre nom complet"
            className="w-full p-3 border rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={participantInfo.name}
            onChange={(e) => {
              setParticipantInfo({...participantInfo, name: e.target.value});
              if (e.target.value.length > 0) {
                trackInteraction('input_focus', 'name_field');
              }
            }}
            onFocus={() => trackInteraction('field_focus', 'name_field')}
          />
          
          {/* Email avec validation visuelle */}
          <div className="mb-4">
            <input
              type="email"
              placeholder="Votre email"
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                emailValidation.status === 'excellent' ? 'border-green-500 bg-green-50' :
                emailValidation.status === 'bon' ? 'border-blue-500 bg-blue-50' :
                emailValidation.status === 'moyen' ? 'border-yellow-500 bg-yellow-50' :
                emailValidation.status === 'faible' ? 'border-red-500 bg-red-50' :
                'border-gray-300'
              }`}
              value={participantInfo.email}
              onChange={(e) => {
                setParticipantInfo({...participantInfo, email: e.target.value});
                validateEmail(e.target.value);
                if (e.target.value.length > 0) {
                  trackInteraction('input_focus', 'email_field');
                }
              }}
              onFocus={() => trackInteraction('field_focus', 'email_field')}
              onBlur={() => validateEmail(participantInfo.email)}
            />
            
            {/* Indicateur de validation */}
            {emailValidation.status && (
              <div className={`text-sm mt-1 ${
                emailValidation.status === 'excellent' ? 'text-green-600' :
                emailValidation.status === 'bon' ? 'text-blue-600' :
                emailValidation.status === 'moyen' ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {emailValidation.status === 'excellent' && '✅ Email valide'}
                {emailValidation.status === 'bon' && '✓ Email acceptable'}
                {emailValidation.status === 'moyen' && '⚠️ Email suspect'}
                {emailValidation.status === 'faible' && '❌ Email problématique'}
                
                {emailValidation.isDuplicate && (
                  <div className="text-xs text-orange-600">
                    ⚠️ Cet email est déjà utilisé
                  </div>
                )}
                
                {!emailValidation.isValidFormat && participantInfo.email && (
                  <div className="text-xs text-red-600">
                    ❌ Format d'email invalide
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ✅ CHAMP WHATSAPP AVEC VALIDATION EN TEMPS RÉEL AMÉLIORÉE */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              <span className="flex items-center gap-2">
                📱 Numéro WhatsApp 
                <span className="text-xs text-gray-500">(recommandé)</span>
              </span>
            </label>
            <input
              type="tel"
              placeholder="+33 6 12 34 56 78 ou 06 12 34 56 78"
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                phoneValidation.isValid ? 'border-green-500 bg-green-50' :
                phoneValidation.original && !phoneValidation.isValid ? 'border-red-500 bg-red-50' :
                'border-gray-300'
              }`}
              value={participantInfo.phone}
              onChange={(e) => {
                setParticipantInfo({...participantInfo, phone: e.target.value});
                validatePhone(e.target.value);
                if (e.target.value.length > 0) {
                  trackInteraction('input_focus', 'phone_field');
                }
              }}
              onFocus={() => trackInteraction('field_focus', 'phone_field')}
              onBlur={() => validatePhone(participantInfo.phone)}
            />
            
            {/* ✅ INSTRUCTIONS DÉTAILLÉES POUR TOUS LES TERRITOIRES */}
            <p className="text-xs text-gray-600 mt-2">
              💡 <strong>France métropolitaine :</strong> +33 6 12 34 56 78 • 06 12 34 56 78 • 0612345678
            </p>
            <p className="text-xs text-blue-600 mt-1">
              🏝️ <strong>Outre-mer :</strong> +590 690 12 34 56 (Guadeloupe) • +596 696 12 34 56 (Martinique)
            </p>
            <p className="text-xs text-purple-600 mt-1">
              🌍 <strong>International :</strong> +1 555 123 4567 (USA) • +44 7911 123456 (UK)
            </p>
            
            {/* ✅ AFFICHER LA VALIDATION DÉTAILLÉE DU TÉLÉPHONE */}
            {phoneValidation.original && (
              <div className={`text-xs mt-2 p-2 rounded ${
                phoneValidation.isValid 
                  ? 'bg-green-100 text-green-700 border border-green-300' 
                  : 'bg-red-100 text-red-700 border border-red-300'
              }`}>
                {phoneValidation.isValid ? (
                  <div>
                    <div className="font-semibold flex items-center gap-2">
                      <span className="text-green-600">✅</span>
                      <span><strong>Numéro valide</strong></span>
                      {phoneValidation.isOverseas && (
                        <span className="ml-2 text-blue-600 text-xs flex items-center gap-1">
                          🏝️ {phoneValidation.territory}
                        </span>
                      )}
                    </div>
                    <div className="mt-1 text-green-600">
                      <strong>Formaté :</strong> {phoneValidation.formatted}
                    </div>
                    {phoneValidation.whatsappLink && (
                      <div className="mt-1 text-xs text-green-600">
                        <strong>Lien WhatsApp :</strong> Prêt à envoyer
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-red-600">❌</span>
                    <div>
                      <strong>Numéro invalide</strong>
                      <div className="text-red-600 text-xs mt-1">
                        Utilisez le format international avec l'indicatif pays
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ✅ SECTION PARRAINAGE */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            <span className="flex items-center gap-2">
              👥 Code de parrainage 
              <span className="text-xs text-gray-500">(optionnel)</span>
            </span>
          </label>
          <input
            type="text"
            placeholder="Ex: TOMBO-MARIE-ABC123"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            value={referralCode}
            onChange={(e) => {
              setReferralCode(e.target.value.toUpperCase());
              if (e.target.value.length > 0) {
                trackInteraction('input_focus', 'referral_field');
              }
            }}
            onFocus={() => trackInteraction('field_focus', 'referral_field')}
          />
          <p className="text-xs text-gray-600 mt-2">
            💡 <strong>Comment ça marche ?</strong> Si un ami vous a donné son code, saisissez-le ici. 
            Cela lui offrira 1 point vers un ticket gratuit après 5 parrainages validés.
          </p>
          
          {/* Afficher le résultat du parrainage */}
          {referralResult && (
            <div className={`mt-3 p-3 rounded-lg text-sm ${
              referralResult.success 
                ? 'bg-green-100 border border-green-400 text-green-700'
                : 'bg-red-100 border border-red-400 text-red-700'
            }`}>
              <div className="font-semibold">
                {referralResult.success ? '✅ Succès !' : '❌ Attention'}
              </div>
              {referralResult.message}
              {referralResult.referrerName && (
                <div className="mt-1 text-xs">
                  Vous parrainez : <strong>{referralResult.referrerName}</strong>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sélection du nombre de tickets */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">🎫 Nombre de tickets</h3>
          <div className="flex gap-2 mb-4">
            {[1, 3, 5, 10].map((count) => (
              <button
                key={count}
                onClick={() => {
                  setTicketCount(count);
                  trackInteraction('ticket_selection', `select_${count}_tickets`);
                }}
                className={`flex-1 py-2 rounded-lg font-semibold transition-all duration-200 ${
                  ticketCount === count
                    ? 'bg-purple-500 text-white shadow-md'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {count}
              </button>
            ))}
          </div>
          <div className="text-center text-lg font-semibold">
            Total : {ticketCount * 5}€
          </div>
        </div>

        {/* Méthode de paiement */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">💳 Méthode de paiement</h3>
          <div className="space-y-2">
            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition">
              <input
                type="radio"
                name="payment"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={(e) => {
                  setPaymentMethod(e.target.value);
                  trackInteraction('payment_selection', 'credit_card');
                }}
                className="text-purple-500 focus:ring-purple-500"
              />
              <span>Carte bancaire</span>
            </label>
            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition">
              <input
                type="radio"
                name="payment"
                value="paypal"
                checked={paymentMethod === 'paypal'}
                onChange={(e) => {
                  setPaymentMethod(e.target.value);
                  trackInteraction('payment_selection', 'paypal');
                }}
                className="text-purple-500 focus:ring-purple-500"
              />
              <span>PayPal</span>
            </label>
          </div>
        </div>

        {/* Bouton de paiement */}
        <button 
          onClick={() => {
            handlePurchase();
            trackInteraction('purchase_attempt', 'buy_button');
          }}
          disabled={!participantInfo.name || !participantInfo.email || emailValidation.status === 'faible'}
          className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
            (!participantInfo.name || !participantInfo.email || emailValidation.status === 'faible')
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-500 hover:bg-green-600 text-white transform hover:scale-105 shadow-md'
          }`}
        >
          {(!participantInfo.name || !participantInfo.email) ? 'Remplissez vos informations' :
           emailValidation.status === 'faible' ? 'Email invalide - Corrigez' :
           `Payer ${ticketCount * 5}€`}
        </button>

        {/* Information sur la validation */}
        {emailValidation.status && (
          <div className="mt-4 p-3 bg-gray-100 rounded-lg text-xs text-gray-600">
            <div className="font-semibold mb-1">Validation email :</div>
            <div>Format : {emailValidation.isValidFormat ? '✅ Valide' : '❌ Invalide'}</div>
            <div>Duplicata : {emailValidation.isDuplicate ? '⚠️ Oui' : '✅ Non'}</div>
            <div>Statut : {emailValidation.status}</div>
            <div>Score : {emailValidation.score}/100</div>
          </div>
        )}

        {/* ✅ AVANTAGE WHATSAPP VISIBLE */}
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
            <span>📱</span>
            Pourquoi ajouter WhatsApp ?
          </h4>
          <ul className="text-xs text-green-700 space-y-1">
            <li className="flex items-center gap-2">
              <span className="text-green-600">✅</span>
              Confirmation immédiate de vos tickets
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">🔔</span>
              Rappel automatique du tirage
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">🎊</span>
              Résultats instantanés si vous gagnez
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">📞</span>
              Support prioritaire en cas de besoin
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">🌍</span>
              Disponible dans tous les territoires français
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BuyTickets;
