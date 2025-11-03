import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Youtube, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showLegalModal, setShowLegalModal] = useState(false);

  return (
    <>
      <footer className="bg-muted/50 border-t">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Organisation */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <img
                  src="/logo.png"
                  alt="CDHPE Logo"
                  className="h-10 w-auto object-contain"
                />
                <div>
                  <h3 className="bg-gradient-to-r from-green-700 via-green-600 to-green-800 bg-clip-text text-transparent font-semibold">
                    CDHPE
                  </h3>
                  <p className="text-sm text-slate-700">
                    Droits de l'Homme &amp; Environnement
                  </p>
                </div>
              </div>
              <p className="text-sm text-slate-800 leading-relaxed">
                <span className="mr-1">
                  <span className="bg-gradient-to-r from-green-400 via-green-600 to-green-800 bg-clip-text text-transparent font-semibold">C</span>omité de
                </span>
                <span className="mr-1">
                  <span className="bg-gradient-to-r from-green-400 via-green-600 to-green-800 bg-clip-text text-transparent font-semibold">D</span>éfense des
                </span>
                <span className="mr-1">
                  <span className="bg-gradient-to-r from-green-400 via-green-600 to-green-800 bg-clip-text text-transparent font-semibold">D</span>roits de l'
                </span>
                <span className="mr-1">
                  <span className="bg-gradient-to-r from-green-400 via-green-600 to-green-800 bg-clip-text text-transparent font-semibold">H</span>omme
                </span>
                <span className="mr-1">et de la</span>
                <span className="mr-1">
                  <span className="bg-gradient-to-r from-green-400 via-green-600 to-green-800 bg-clip-text text-transparent font-semibold">P</span>rotection de
                </span>
                <span>
                  <span className="bg-gradient-to-r from-green-400 via-green-600 to-green-800 bg-clip-text text-transparent font-semibold">E</span>nvironnement, ensemble pour un avenir juste et durable.
                </span>
              </p>
            </div>

            {/* Navigation */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-slate-800">Navigation</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/"
                    className="text-sm text-slate-700 hover:text-green-600 transition-colors"
                  >
                    Accueil
                  </Link>
                </li>
                <li>
                  <Link
                    to="/actualites"
                    className="text-sm text-slate-700 hover:text-green-600 transition-colors"
                  >
                    Actualités
                  </Link>
                </li>
                <li>
                  <Link
                    to="/evenement"
                    className="text-sm text-slate-700 hover:text-green-600 transition-colors"
                  >
                    Évènements
                  </Link>
                </li>
              </ul>
              <div className="pt-4 border-t border-border">
                <Link
                  to="/nous-soutenir"
                  className="inline-flex items-center text-sm font-medium bg-gradient-to-r from-green-400 via-green-600 to-green-800 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
                >
                  Nous soutenir
                </Link>
                <p className="text-xs text-slate-700 mt-2">
                  Soutenez nos actions pour les droits humains et l'environnement
                </p>
              </div>
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-slate-800">Contact</h4>
              <ul className="space-y-3">
                <li className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-slate-700">
                    Abidjan, Côte d'Ivoire
                  </span>
                </li>
                <li className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-slate-700">
                    +225 0757489615
                  </span>
                </li>
                <li className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-slate-700">
                    ddsdefenseur@gmail.com
                  </span>
                </li>
              </ul>
            </div>

            {/* Suivez-nous */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-slate-800">Suivez-nous</h4>
              <div className="flex space-x-4">
                <a
                  href="https://www.facebook.com/share/1GWCwXwMon/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-gradient-to-r hover:from-green-400 hover:via-green-600 hover:to-green-800 hover:text-white transition-colors shadow-md"
                  aria-label="Facebook"
                >
                  <Facebook className="h-4 w-4" />
                </a>
                <a
                  href="http://www.youtube.com/@dieudonnesoroofficiel1319"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-gradient-to-r hover:from-green-400 hover:via-green-600 hover:to-green-800 hover:text-white transition-colors shadow-md"
                  aria-label="YouTube"
                >
                  <Youtube className="h-4 w-4" />
                </a>
                <a
                  href="#"
                  className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-gradient-to-r hover:from-green-400 hover:via-green-600 hover:to-green-800 hover:text-white transition-colors shadow-md"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
              </div>
              <p className="text-xs text-slate-700">
                Restez informé de nos actions et événements sur les réseaux sociaux
              </p>
            </div>
          </div>

          {/* Bas de page */}
          <div className="mt-8 pt-8 border-t border-border">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-sm text-slate-700">
                © {currentYear} CDHPE. Tous droits réservés.
              </p>
              <div className="flex space-x-6">
                <button
                  type="button"
                  onClick={() => setShowPrivacyModal(true)}
                  className="text-sm text-slate-700 hover:text-green-600 transition-colors"
                >
                  Politique de confidentialité
                </button>
                <button
                  type="button"
                  onClick={() => setShowLegalModal(true)}
                  className="text-sm text-slate-700 hover:text-green-600 transition-colors"
                >
                  Mentions légales
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <Dialog open={showPrivacyModal} onOpenChange={setShowPrivacyModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Politique de confidentialité</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2 text-sm text-slate-700">
            <p>
              Chez CDHPE, nous respectons votre vie privée. Cette politique décrit les catégories de données que nous collectons,
              les finalités de traitement, les bases légales, ainsi que vos droits et les moyens de les exercer.
            </p>
            <p>
              Nous collectons uniquement les informations strictement nécessaires pour fournir nos services, gérer les inscriptions
              et répondre aux demandes. Vos données sont sécurisées et ne sont jamais partagées sans votre accord.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              className="border-green-600 text-green-600 hover:bg-green-50"
              onClick={() => setShowPrivacyModal(false)}
            >
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showLegalModal} onOpenChange={setShowLegalModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Mentions légales</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2 text-sm text-slate-700">
            <p>
              Éditeur du site : Comité de Défense des Droits de l'Homme et de la Protection de l'Environnement (CDHPE).
              Siège social : Abidjan, Côte d'Ivoire.
            </p>
            <p>
              Propriété intellectuelle : l'ensemble des contenus (textes, images, logos, vidéos) publiés sur ce site est protégé
              par le droit d'auteur. Toute reproduction totale ou partielle est interdite sans autorisation préalable.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              className="border-green-600 text-green-600 hover:bg-green-50"
              onClick={() => setShowLegalModal(false)}
            >
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Footer;
