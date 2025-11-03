import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, Newspaper, Calendar, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Accueil', href: '/', icon: <Home className="h-4 w-4 mr-1.5" /> },
    { name: 'Actualités', href: '/actualites', icon: <Newspaper className="h-4 w-4 mr-1.5" /> },
    { name: 'Évènements', href: '/evenement', icon: <Calendar className="h-4 w-4 mr-1.5" /> },
    { name: 'Contact', href: '/nous-soutenir#contact', icon: <Mail className="h-4 w-4 mr-1.5" /> },
  ];

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 w-full h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <img
                src="/logo.png"
                alt="CDHPE Logo"
                className="h-10 w-auto object-contain"
              />
              <div className="hidden sm:block">
                <h1 className="bg-gradient-to-r from-green-700 via-green-600 to-green-800 bg-clip-text text-transparent font-semibold">
                  CDHPE
                </h1>
                <p className="text-xs text-slate-900">
                  Droits de l'Homme & Environnement
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`relative flex items-center text-sm font-medium transition-all duration-300 
                    ${isActive(item.href)
                      ? 'text-green-700'
                      : 'text-slate-800/75 hover:text-green-700'
                    } group`}
                >
                  {item.icon}
                  {item.name}
                  <span
                    className={`absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-green-400 via-green-600 to-green-800 transition-all duration-300 group-hover:w-full origin-right group-hover:origin-left ${
                      isActive(item.href) ? 'w-full' : ''
                    }`}
                  ></span>
                </Link>
              ))}
            </nav>

            {/* CTA Button */}
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/nous-soutenir">
                <Button className="bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
                  Agir avec nous
                </Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="bg-green-50 hover:bg-green-100 focus:ring-green-500/50 focus:ring-offset-2"
                aria-expanded={isMenuOpen}
                aria-controls="mobile-menu"
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div id="mobile-menu" className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 bg-background border-t animate-fade-in">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center px-3 py-2 text-base font-medium rounded-md transition-all duration-200 ${
                      isActive(item.href)
                        ? 'text-green-700 bg-green-100'
                        : 'text-slate-500 hover:text-green-700 hover:bg-green-50'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                ))}
                <div className="pt-4 pb-2">
                  <Link to="/nous-soutenir" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-green-500 via-green-500 to-green-600 text-white shadow-md hover:shadow-lg transition-all duration-300">
                      Agir avec nous
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;