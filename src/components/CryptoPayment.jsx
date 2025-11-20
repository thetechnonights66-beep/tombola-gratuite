import React, { useState, useEffect, useRef } from 'react';
import { CryptoPaymentService } from '../utils/cryptoPaymentService';

const CryptoPayment = ({ ticketCount, participantInfo, onPaymentSuccess, onCancel }) => {
  const [selectedCrypto, setSelectedCrypto] = useState('USDT');
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('idle');
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [countdown, setCountdown] = useState(1800);
  const [autoVerify, setAutoVerify] = useState(true);
  
  const verificationIntervalRef = useRef(null);

  const amount = ticketCount * 5;

  useEffect(() => {
    CryptoPaymentService.cleanupExpiredPayments();
    return () => {
      // Nettoyer l'intervalle de vérification
      if (verificationIntervalRef.current) {
        clearInterval(verificationIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    let timer;
    if (paymentDetails && countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      handlePaymentExpired();
    }
    return () => clearInterval(timer);
  }, [paymentDetails, countdown]);

  // Démarrer la vérification automatique
  useEffect(() => {
    if (paymentDetails && autoVerify && paymentStatus === 'waiting') {
      startAutoVerification();
    }
    
    return () => {
      if (verificationIntervalRef.current) {
        clearInterval(verificationIntervalRef.current);
      }
    };
  }, [paymentDetails, autoVerify, paymentStatus]);

  const startAutoVerification = () => {
    if (verificationIntervalRef.current) {
      clearInterval(verificationIntervalRef.current);
    }

    verificationIntervalRef.current = CryptoPaymentService.startAutoVerification(
      paymentDetails.paymentId,
      (result) => {
        setVerificationStatus(result);
        
        if (result.status === 'confirmed') {
          setPaymentStatus('confirmed');
          onPaymentSuccess(paymentDetails.paymentId);
        }
      },
      15000 // Vérifier toutes les 15 secondes
    );
  };

  const handlePaymentExpired = () => {
    setPaymentStatus('expired');
    if (verificationIntervalRef.current) {
      clearInterval(verificationIntervalRef.current);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const generatePayment = () => {
    setIsProcessing(true);
    
    try {
      const payment = CryptoPaymentService.generatePaymentAddress(
        selectedCrypto,
        amount,
        ticketCount,
        participantInfo
      );
      
      setPaymentDetails(payment);
      setCountdown(1800);
      setPaymentStatus('waiting');
      setVerificationStatus(null);
      setAutoVerify(true);
      
    } catch (error) {
      console.error('Erreur génération paiement:', error);
      setPaymentStatus('error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleManualVerification = async () => {
    setIsProcessing(true);
    
    try {
      const status = await CryptoPaymentService.verifyPayment(paymentDetails.paymentId);
      setVerificationStatus(status);
      
      if (status.status === 'confirmed') {
        setPaymentStatus('confirmed');
        onPaymentSuccess(paymentDetails.paymentId);
      }
    } catch (error) {
      alert('Erreur de vérification: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copié dans le presse-papier !');
  };

  // Rendu statut de vérification
  const renderVerificationStatus = () => {
    if (!verificationStatus) return null;

    const statusConfig = {
      confirmed: { color: 'green', icon: '✅', bgColor: 'bg-green-50', borderColor: 'border-green-200', textColor: 'text-green-800' },
      pending: { color: 'yellow', icon: '⏳', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200', textColor: 'text-yellow-800' },
      not_found: { color: 'gray', icon: '🔍', bgColor: 'bg-gray-50', borderColor: 'border-gray-200', textColor: 'text-gray-800' },
      error: { color: 'red', icon: '❌', bgColor: 'bg-red-50', borderColor: 'border-red-200', textColor: 'text-red-800' }
    };

    const config = statusConfig[verificationStatus.status] || { 
      color: 'gray', 
      icon: '❓', 
      bgColor: 'bg-gray-50', 
      borderColor: 'border-gray-200', 
      textColor: 'text-gray-800' 
    };

    return (
      <div className={`${config.bgColor} ${config.borderColor} border rounded-lg p-4 mb-4`}>
        <div className="flex items-center gap-3">
          <span className="text-xl">{config.icon}</span>
          <div>
            <div className={`font-semibold ${config.textColor}`}>
              {verificationStatus.message}
            </div>
            {verificationStatus.transactionHash && (
              <div className="text-sm text-gray-600 mt-1">
                TX: {verificationStatus.transactionHash.substring(0, 20)}...
                <a 
                  href={CryptoPaymentService.getExplorerLink(paymentDetails.crypto, verificationStatus.transactionHash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700 ml-2"
                >
                  Voir sur l'explorer
                </a>
              </div>
            )}
            {verificationStatus.confirmations && (
              <div className="text-xs text-gray-500 mt-1">
                Confirmations: {verificationStatus.confirmations}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (paymentStatus === 'confirmed') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Paiement Confirmé !</h2>
          <p className="text-gray-600 mb-6">
            Votre paiement a été confirmé avec succès. Vos tickets sont en cours de génération.
          </p>
          {verificationStatus?.transactionHash && (
            <a 
              href={CryptoPaymentService.getExplorerLink(paymentDetails.crypto, verificationStatus.transactionHash)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm mb-4"
            >
              🔗 Voir la transaction
            </a>
          )}
          <button
            onClick={() => window.location.reload()}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            Continuer
          </button>
        </div>
      </div>
    );
  }

  if (paymentStatus === 'expired') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">⏰</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Paiement Expiré</h2>
          <p className="text-gray-600 mb-6">
            Le délai de paiement de 30 minutes est écoulé. Veuillez recommencer.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            Nouvelle tentative
          </button>
        </div>
      </div>
    );
  }

  if (paymentDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 p-4">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
          
          {/* En-tête */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
            <h2 className="text-3xl font-bold mb-2">Paiement Crypto</h2>
            <p className="opacity-90">
              {ticketCount} ticket(s) - {amount}€
            </p>
            <div className={`mt-2 text-sm ${countdown < 300 ? 'text-red-300' : 'text-yellow-300'}`}>
              ⏰ Expire dans: {formatTime(countdown)}
            </div>
          </div>

          <div className="p-6">
            {/* Statut de vérification */}
            {renderVerificationStatus()}

            {/* Contrôle vérification auto */}
            <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
              <input
                type="checkbox"
                id="autoVerify"
                checked={autoVerify}
                onChange={(e) => setAutoVerify(e.target.checked)}
                className="text-blue-500 focus:ring-blue-500"
              />
              <label htmlFor="autoVerify" className="text-sm text-gray-700">
                Vérification automatique (toutes les 15 secondes)
              </label>
            </div>

            {/* QR Code */}
            <div className="text-center mb-6">
              <img 
                src={paymentDetails.qrCode} 
                alt="QR Code de paiement"
                className="mx-auto border-4 border-gray-200 rounded-lg w-48 h-48"
              />
              <p className="text-sm text-gray-600 mt-2">
                Scannez avec votre wallet crypto
              </p>
            </div>

            {/* Adresse de paiement */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Adresse {paymentDetails.crypto} :
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={paymentDetails.walletAddress}
                  readOnly
                  className="flex-1 p-3 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm"
                />
                <button
                  onClick={() => copyToClipboard(paymentDetails.walletAddress)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 rounded-lg transition flex items-center justify-center"
                >
                  📋
                </button>
              </div>
            </div>

            {/* Montant exact */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-yellow-800 mb-2">⚠️ Montant exact requis</h3>
              <p className="text-yellow-700 text-sm">
                Vous devez envoyer <strong>exactement {paymentDetails.requiredAmount} {paymentDetails.crypto}</strong>
              </p>
              <p className="text-yellow-600 text-xs mt-1">
                Tout montant différent ne sera pas accepté automatiquement
              </p>
            </div>

            {/* Instructions */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">📋 Instructions de paiement</h3>
              <div className="text-sm text-gray-600 whitespace-pre-line">
                {paymentDetails.instructions}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleManualVerification}
                disabled={isProcessing}
                className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition"
              >
                {isProcessing ? 'Vérification...' : '✅ Vérifier manuellement'}
              </button>
              
              <button
                onClick={onCancel}
                className="px-6 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold transition"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
        
        {/* En-tête */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
          <h2 className="text-3xl font-bold mb-2">Paiement Crypto</h2>
          <p className="opacity-90">
            {ticketCount} ticket(s) - Total: {amount}€
          </p>
        </div>

        <div className="p-6">
          {/* Sélection crypto */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Choisissez votre crypto-monnaie :
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {Object.entries(CryptoPaymentService.SUPPORTED_CRYPTOS).map(([key, crypto]) => (
                <button
                  key={key}
                  onClick={() => handleCryptoSelect(key)}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    selectedCrypto === key 
                      ? 'border-blue-500 bg-blue-50 shadow-md' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold text-gray-800">{crypto.symbol}</div>
                  <div className="text-xs text-gray-600 mt-1">{crypto.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Détails crypto sélectionnée */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-2">
              {CryptoPaymentService.SUPPORTED_CRYPTOS[selectedCrypto].name}
            </h3>
            <p className="text-sm text-gray-600">
              Réseau: {CryptoPaymentService.SUPPORTED_CRYPTOS[selectedCrypto].network}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Montant: {CryptoPaymentService.calculateRequiredAmount(selectedCrypto, amount)} {selectedCrypto}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={generatePayment}
              disabled={isProcessing}
              className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition"
            >
              {isProcessing ? 'Génération...' : `Payer avec ${selectedCrypto}`}
            </button>
            
            <button
              onClick={onCancel}
              className="px-6 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold transition"
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CryptoPayment;
