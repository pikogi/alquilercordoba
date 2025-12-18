
import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { auth } from '@/api/client';
import { Menu, X, UserCircle } from 'lucide-react';

export default function Layout({ children }) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await auth.me();
        setUser(currentUser);
      } catch (e) {
        // Not logged in
      }
    };
    checkUser();
  }, []);

  const handleLogin = () => {
    window.location.href = `${createPageUrl('Login')}?returnUrl=${encodeURIComponent(window.location.href)}`;
  };

  const handleLogout = async () => {
    await auth.logout();
    setUser(null);
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-white font-sans text-neutral-900 selection:bg-neutral-200">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-neutral-100 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to={createPageUrl('Home')} className="text-xl font-medium tracking-tight hover:opacity-70 transition-opacity">
            Alquiler <span className="font-light text-neutral-500">Córdoba</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide">
            
            {user ? (
              <div className="flex items-center gap-6">
                <Link to={createPageUrl('OwnerDashboard')} className="hover:text-neutral-500 transition-colors">
                  Mis Propiedades
                </Link>
                <button onClick={handleLogout} className="text-neutral-400 hover:text-red-500 transition-colors">
                  Salir
                </button>
                <div className="h-8 w-8 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-500">
                   <UserCircle size={18} />
                </div>
              </div>
            ) : (
              <>
                <a 
                  href="https://wa.me/5493572502550?text=Hola,%20esta%20es%20la%20propiedad%20que%20quisiera%20que%20me%20administren:"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2 border border-neutral-300 rounded-full hover:bg-neutral-50 transition-all duration-300 text-xs uppercase tracking-wider"
                >
                  ¿Tenés una propiedad?
                </a>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-neutral-100 p-6 flex flex-col gap-6 animate-in slide-in-from-top-5">
            {user ? (
              <>
                <Link to={createPageUrl('OwnerDashboard')} className="text-lg">Panel de Propietario</Link>
                <button onClick={handleLogout} className="text-lg text-left text-neutral-500">Cerrar Sesión</button>
              </>
            ) : (
              <>
                <a 
                  href="https://wa.me/5493572502550?text=Hola,%20esta%20es%20la%20propiedad%20que%20quisiera%20que%20me%20administren:"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg text-left"
                >
                  ¿Tenés una propiedad?
                </a>
              </>
            )}
          </div>
        )}
      </nav>

      <main className="pt-20 min-h-screen">
        {children}
      </main>

      <footer className="bg-neutral-50 py-16 px-6 mt-20 border-t border-neutral-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-10">
          <div>
            <h3 className="font-medium text-lg mb-2">ALQUILER CORDOBA</h3>
            <p className="text-neutral-500 max-w-xs text-sm leading-relaxed">
              Curaduría de espacios excepcionales para experiencias temporales inolvidables.
            </p>
          </div>
          <div className="flex gap-8 text-sm text-neutral-500">
            <a href="#" className="hover:text-neutral-900">Instagram</a>
            <a href="#" className="hover:text-neutral-900">Contacto</a>
            <button onClick={() => window.scrollTo(0,0)} className="hover:text-neutral-900">Volver arriba</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
