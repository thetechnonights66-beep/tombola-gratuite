// src/components/Terms.jsx
import React from 'react';

const Terms = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* En-tête */}
        <div className="bg-blue-600 text-white p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">📝 Conditions Générales de Vente</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl"
            >
              ✕
            </button>
          </div>
          <p className="text-blue-200 mt-2">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
          </p>
        </div>

        {/* Contenu CGV */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="space-y-6 text-gray-700">
            
            <section>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">1. 🎯 Objet</h3>
              <p>
                Les présentes conditions générales régissent la participation à la tombola organisée par Tombola Excursion. 
                La participation implique l'acceptation sans réserve des présentes conditions.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">2. 👥 Conditions de participation</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Être âgé de 18 ans ou plus</li>
                <li>Résider en France métropolitaine</li>
                <li>Disposer d'une adresse email valide</li>
                <li>Accepter sans réserve les présentes conditions</li>
                <li>Un seul compte par personne est autorisé</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">3. 🎫 Achat de tickets</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Prix unitaire du ticket : 5€</li>
                <li>Paiement sécurisé par carte bancaire</li>
                <li>Les tickets sont numérotés de manière unique</li>
                <li>Aucun remboursement n'est possible après achat</li>
                <li>Les tickets sont valables pour le tirage en cours</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">4. 🏆 Tirage et lots</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Le tirage est effectué en direct et de manière aléatoire</li>
                <li>La liste des lots est disponible sur le site</li>
                <li>Les gagnants sont notifiés par email/WhatsApp sous 24h</li>
                <li>Les lots doivent être réclamés sous 30 jours</li>
                <li>En cas de litige, la décision de l'organisateur est finale</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">5. 🔒 Protection des données</h3>
              <p>
                Conformément au RGPD, vos données sont collectées pour la gestion de la tombola. 
                Vous disposez d'un droit d'accès, de rectification et de suppression de vos données.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">6. 👥 Parrainage</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>1 point par parrainage validé (achat effectué avec votre code)</li>
                <li>1 ticket gratuit offert après 5 points</li>
                <li>Pas de limite au nombre de parrainages</li>
                <li>Le système détecte et prévient les abus</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">7. ⚖️ Responsabilité</h3>
              <p>
                L'organisateur ne saurait être tenu responsable en cas de force majeure ou de problèmes techniques 
                indépendants de sa volonté affectant le bon déroulement de la tombola.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">8. 📞 Contact</h3>
              <p>
                Pour toute question :<br />
                📧 Email : contact@tombola-excursion.fr<br />
                📱 WhatsApp : +33 1 23 45 67 89<br />
                🕒 Réponse sous 24h ouvrées
              </p>
            </section>

          </div>
        </div>

        {/* Pied de page */}
        <div className="bg-gray-100 p-4 border-t border-gray-200">
          <div className="text-center text-gray-600">
            <p>En participant, vous acceptez intégralement ces conditions générales.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
