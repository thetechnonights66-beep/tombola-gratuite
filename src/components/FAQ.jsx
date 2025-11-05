// src/components/FAQ.jsx
import React, { useState } from 'react';

const FAQ = ({ onClose }) => {
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (index) => {
    setOpenItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const faqItems = [
    {
      question: "🎯 Comment fonctionne la tombola ?",
      answer: "La tombola Excursion vous permet d'acheter des tickets numérotés. Un tirage au sort est effectué en direct pour désigner les gagnants parmi tous les tickets vendus. Chaque ticket a une chance égale de gagner !"
    },
    {
      question: "💰 Quel est le prix d'un ticket ?",
      answer: "Chaque ticket coûte 5€. Vous pouvez acheter plusieurs tickets pour augmenter vos chances de gagner. Des packs sont disponibles : 1 ticket (5€), 3 tickets (15€), 5 tickets (25€), 10 tickets (50€)."
    },
    {
      question: "🎁 Quels sont les lots à gagner ?",
      answer: "Nous offrons une sélection de lots exceptionnels : voyages, high-tech, bons d'achat, et bien d'autres surprises ! La liste complète des lots est disponible sur notre page d'accueil et est mise à jour régulièrement."
    },
    {
      question: "⏰ Quand a lieu le tirage ?",
      answer: "Les tirages sont programmés régulièrement. La date exacte du prochain tirage est affichée sur notre site. Vous pouvez suivre le tirage en direct via notre page de diffusion live."
    },
    {
      question: "📞 Comment suis-je prévenu si je gagne ?",
      answer: "Les gagnants sont notifiés immédiatement après le tirage par WhatsApp (si vous avez fourni votre numéro) et par email. Vous pouvez également consulter la liste des gagnants sur notre site."
    },
    {
      question: "🔄 Puis-je me faire rembourser ?",
      answer: "Conformément à la réglementation, les achats de tickets de tombola sont fermes et définitifs. Aucun remboursement n'est possible après l'achat, sauf en cas d'annulation de l'événement."
    },
    {
      question: "👥 Comment fonctionne le parrainage ?",
      answer: "Le système de parrainage vous permet de gagner des tickets gratuits ! Partagez votre code unique avec vos amis. Pour chaque ami qui achète un ticket avec votre code, vous gagnez 1 point. Après 5 points, vous recevez 1 ticket gratuit !"
    },
    {
      question: "🔞 Y a-t-il une limite d'âge ?",
      answer: "La participation est réservée aux personnes majeures (18 ans et plus). Une vérification d'identité peut être demandée pour la remise des lots."
    },
    {
      question: "🌍 Puis-je participer depuis l'étranger ?",
      answer: "La participation est ouverte à tous les résidents en France métropolitaine. Certaines restrictions géographiques peuvent s'appliquer pour la livraison des lots physiques."
    },
    {
      question: "📋 Comment récupérer mon lot ?",
      answer: "Les lots sont à retirer sous 30 jours après le tirage. Pour les lots physiques, nous contacterons les gagnants pour organiser la livraison. Les lots numériques sont envoyés par email sous 48h."
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* En-tête */}
        <div className="bg-purple-600 text-white p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">❓ Foire Aux Questions</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl"
            >
              ✕
            </button>
          </div>
          <p className="text-purple-200 mt-2">
            Trouvez rapidement des réponses à vos questions
          </p>
        </div>

        {/* Contenu FAQ */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full p-4 text-left flex justify-between items-center hover:bg-gray-50 rounded-lg"
                >
                  <span className="font-semibold text-gray-800">{item.question}</span>
                  <span className={`transform transition-transform ${openItems[index] ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>
                {openItems[index] && (
                  <div className="p-4 bg-gray-50 border-t border-gray-200">
                    <p className="text-gray-600 leading-relaxed">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Pied de page */}
        <div className="bg-gray-100 p-4 border-t border-gray-200">
          <div className="text-center">
            <p className="text-gray-600">
              Vous ne trouvez pas la réponse à votre question ?
            </p>
            <a 
              href="#/contact" 
              className="text-purple-600 hover:text-purple-700 font-semibold"
            >
              Contactez notre équipe ✅
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
