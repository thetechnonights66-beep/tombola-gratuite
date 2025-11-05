// src/components/Footer.jsx
import React, { useState } from 'react';
import FAQ from './FAQ';
import Terms from './Terms';

const Footer = () => {
  const [showFAQ, setShowFAQ] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  return (
    <>
      {/* Footer principal */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Logo et description */}
            <div className="mb-4 md:mb-0">
              <h3 className="text-2xl font-bold text-purple-400">🎪 Tombola Excursion</h3>
              <p className="text-gray-400 mt-2">Votre chance de gagner des lots exceptionnels !</p>
            </div>
            
            {/* Liens légaux */}
            <div className="flex gap-6">
              <button
                onClick={() => setShowFAQ(true)}
                className="text-gray-300 hover:text-white transition hover:scale-105"
              >
                ❓ FAQ
              </button>
              <button
                onClick={() => setShowTerms(true)}
                className="text-gray-300 hover:text-white transition hover:scale-105"
              >
                📝 Conditions Générales
              </button>
              <a 
                href="#/contact" 
                className="text-gray-300 hover:text-white transition hover:scale-105"
              >
                📞 Contact
              </a>
            </div>
          </div>
          
          {/* Copyright */}
          <div className="border-t border-gray-700 mt-6 pt-4 text-center text-gray-400">
            <p>&copy; 2024 Tombola Excursion. Tous droits réservés.</p>
          </div>
        </div>
      </footer>

      {/* Modals pour FAQ et CGV */}
      {showFAQ && <FAQ onClose={() => setShowFAQ(false)} />}
      {showTerms && <Terms onClose={() => setShowTerms(false)} />}
    </>
  );
};

export default Footer;
