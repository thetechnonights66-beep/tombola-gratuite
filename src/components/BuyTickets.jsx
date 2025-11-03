import React, { useState, useEffect } from 'react';
import { TicketStorage } from '../utils/ticketStorage';
import { EmailVerification } from '../utils/emailVerification';
import { ReferralSystem } from '../utils/referralSystem'; // ✅ NOUVEAU IMPORT

const BuyTickets = () => {
  const [ticketCount, setTicketCount] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [participantInfo, setParticipantInfo] = useState({
    name: '',
    email: ''
  });
  const [emailValidation, setEmailValidation] = useState({});
  const [allParticipants, setAllParticipants] = useState([]);
  
  // ✅ STATES POUR LE PARRAINAGE
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

    // Générer les tickets
    const tickets = [];
    for (let i = 0; i < ticketCount; i++) {
      const ticketNumber = generateTicketNumber();
      const ticket = TicketStorage.addTicket({
        number: ticketNumber,
        price: 5,
        participant: participantInfo.name,
        email: participantInfo.email
      });
      tickets.push(ticket);
    }

    // ✅ VALIDER LE PARRAINAGE APRÈS ACHAT RÉUSSI
    if (referralResult && referralResult.success) {
      ReferralSystem.validateReferral(participantInfo.email);
    }

    // Rediriger vers la page de confirmation
    window.location.hash = `#/confirmation?tickets=${tickets.map(t => t.number).join(',')}`;
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
            className="w-full p-3 border rounded-lg mb-4"
            value={participantInfo.name}
            onChange={(e) => setParticipantInfo({...participantInfo, name: e.target.value})}
          />
          
          {/* Email avec validation visuelle */}
          <div className="mb-2">
            <input
              type="email"
              placeholder="Votre email"
              className={`w-full p-3 border rounded-lg ${
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
              }}
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
            onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
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
                onClick={() => setTicketCount(count)}
                className={`flex-1 py-2 rounded-lg font-semibold ${
                  ticketCount === count
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-200 text-gray-700'
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
            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer">
              <input
                type="radio"
                name="payment"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="text-purple-500"
              />
              <span>Carte bancaire</span>
            </label>
            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer">
              <input
                type="radio"
                name="payment"
                value="paypal"
                checked={paymentMethod === 'paypal'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="text-purple-500"
              />
              <span>PayPal</span>
            </label>
          </div>
        </div>

        {/* Bouton de paiement */}
        <button 
          onClick={handlePurchase}
          disabled={!participantInfo.name || !participantInfo.email || emailValidation.status === 'faible'}
          className={`w-full py-3 rounded-lg font-semibold ${
            (!participantInfo.name || !participantInfo.email || emailValidation.status === 'faible')
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-500 hover:bg-green-600 text-white'
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
      </div>
    </div>
  );
};

export default BuyTickets;
