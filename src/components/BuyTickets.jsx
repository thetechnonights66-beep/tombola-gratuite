import React, { useState, useEffect } from 'react';
import { TicketStorage } from '../utils/ticketStorage';
import { EmailVerification } from '../utils/emailVerification'; // ✅ NOUVEAU IMPORT

const BuyTickets = () => {
  const [ticketCount, setTicketCount] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [participantInfo, setParticipantInfo] = useState({
    name: '',
    email: ''
  });
  const [emailValidation, setEmailValidation] = useState({}); // ✅ NOUVEAU STATE
  const [allParticipants, setAllParticipants] = useState([]); // ✅ NOUVEAU STATE

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

        {/* ... reste du code inchangé ... */}

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
