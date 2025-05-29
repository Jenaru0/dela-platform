'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from '@/components/auth/AuthModal';
import { useCart } from '@/context/CarContext';
import {
  Menu,
  X,
  Search,
  ShoppingCart,
  User,
  Heart,
  Phone,
  Mail,
  LogOut,
  Settings,
  ShoppingBag,
  ChevronDown,
  Users,
} from 'lucide-react';

interface HeaderProps {
  wishlistCount?: number;
}

const Header: React.FC<HeaderProps> = ({
  wishlistCount = 0,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const { isAuthenticated, usuario, cerrarSesion, isLoading } = useAuth();
  const { cart } = useCart();
  const router = useRouter();
  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);  const navigation = [
    { name: 'Inicio', href: '/' },
    { name: 'Productos', href: '/productos' },
    { name: 'Categorías', href: '/#categorias', isScroll: true },
    { name: 'Nosotros', href: '/nosotros' },
    { name: 'Contacto', href: '/contacto' },
  ];  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, item: { name: string; href: string; isScroll?: boolean }) => {
    if (item.isScroll && item.href === '/#categorias') {
      e.preventDefault();
      
      // Si ya estamos en la página de inicio, hacer scroll directo
      if (window.location.pathname === '/') {
        const element = document.getElementById('categorias');
        if (element) {
          const headerHeight = 80;
          const offsetTop = element.offsetTop - headerHeight + 10;
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      } else {
        // Si estamos en otra página, navegar a inicio y después hacer scroll
        router.push('/');
        // Esperar a que la página cargue y luego hacer scroll
        setTimeout(() => {
          const element = document.getElementById('categorias');
          if (element) {
            const headerHeight = 80;
            const offsetTop = element.offsetTop - headerHeight + 10;
            window.scrollTo({
              top: offsetTop,
              behavior: 'smooth'
            });
          }
        }, 100);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await cerrarSesion();
      setShowUserMenu(false);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }  };  const userMenuItems = [
    { icon: User, label: 'Mi Perfil', href: '/perfil' },
    { icon: ShoppingBag, label: 'Mis Pedidos', href: '/pedidos' },
    { icon: Heart, label: 'Lista de Deseos', href: '/wishlist' },
    { icon: Settings, label: 'Configuración', href: '/configuracion' },
    ...(usuario?.tipoUsuario === 'ADMIN' ? [
      { icon: Users, label: 'Gestión de Usuarios', href: '/usuarios' }
    ] : [])
  ];

  return (
    <>
      {/* Top Bar */}
      <div className="bg-[#3A3A3A] text-white text-sm py-2">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4" />
              <span>+51 912 949 652</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <span>comercial@dela.com.pe</span>
            </div>
          </div>
          <div className="hidden md:block">
            <span>🚚 Envío gratis en pedidos superiores a S/100</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-sm shadow-lg'
            : 'bg-white border-b border-[#E6D5A8]'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}            <Link href="/" className="flex items-center space-x-3">
              <div className="relative h-10 w-10 md:h-12 md:w-12">
                <Image
                  src="https://dela.com.pe/img/lodo-dela-header.png"
                  alt="DELA Logo"
                  fill
                  className="object-contain"
                  onError={(e) => {
                    e.currentTarget.src = '/images/logo.svg';
                  }}
                />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl md:text-2xl font-bold text-[#3A3A3A]">
                  <span className="text-[#CC9F53]">DELA</span>
                  <span className="text-sm md:text-base font-normal text-gray-600 block leading-none">
                    Deleites del Valle
                  </span>
                </h1>
              </div>
            </Link>            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item)}
                  className="text-gray-700 hover:text-[#CC9F53] font-medium transition-colors duration-200 relative group"
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#CC9F53] transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ))}
            </nav>

            {/* Search Bar (Desktop) */}
            <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-[#E6D5A8] rounded-full focus:outline-none focus:ring-2 focus:ring-[#CC9F53] focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2 md:space-x-4">
              {/* Wishlist */}
              <Button variant="ghost" size="icon" className="relative">
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    {wishlistCount}
                  </Badge>
                )}
              </Button>              {/* Cart */}
              <Link href="/carrito">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {cartItemsCount > 0 && (
                    <Badge
                      variant="default"
                      className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-[#CC9F53] hover:bg-[#B88D42]"
                    >
                      {cartItemsCount}
                    </Badge>
                  )}
                </Button>
              </Link>{/* User Account */}
              {isLoading ? (
                // Skeleton que replica exactamente el layout de los botones originales
                <div className="flex items-center space-x-2">
                  {/* Skeleton para botones desktop - coincide con h-9 px-3 del Button size="sm" */}
                  <div className="hidden md:flex items-center space-x-2">
                    <div className="h-9 px-3 bg-gray-200 rounded-md animate-pulse text-xs">
                      <span className="invisible">Iniciar Sesión</span>
                    </div>
                    <div className="h-9 px-3 bg-gray-200 rounded-md animate-pulse text-xs">
                      <span className="invisible">Registrarse</span>
                    </div>
                  </div>
                  {/* Skeleton para botón mobile - coincide con size="icon" h-10 w-10 */}
                  <div className="w-10 h-10 bg-gray-200 rounded-md animate-pulse md:hidden"></div>
                </div>
              ) : isAuthenticated ? (
                <div className="relative user-menu-container">
                  <Button
                    variant="ghost"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 px-3 py-2 hover:bg-[#F5EFD7]/60"
                  >
                    <div className="flex items-center justify-center w-8 h-8 bg-[#CC9F53] text-white rounded-full text-sm font-medium">
                      {usuario?.nombres?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <ChevronDown 
                      className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${
                        showUserMenu ? 'rotate-180' : ''
                      }`} 
                    />
                  </Button>

                  {/* User Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-[#E6D5A8] py-2 z-50">
                      {/* User Info Header */}
                      <div className="px-4 py-3 border-b border-[#E6D5A8]">
                        <div className="flex items-center space-x-3">
                          <div className="flex-none w-10 h-10 bg-[#CC9F53] text-white rounded-full flex items-center justify-center font-bold select-none">
                            {usuario?.nombres?.charAt(0)?.toUpperCase() || 'U'}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-[#3A3A3A]">
                              {usuario?.nombres} {usuario?.apellidos}
                            </p>
                            <p className="text-xs text-gray-500">
                              {usuario?.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-1">
                        {userMenuItems.map((item, index) => (
                          <Link
                            key={index}
                            href={item.href}
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-[#F5EFD7]/60 hover:text-[#CC9F53] transition-colors duration-200"
                          >
                            <item.icon className="h-4 w-4 mr-3" />
                            {item.label}
                          </Link>
                        ))}
                      </div>

                      {/* Logout */}
                      <div className="border-t border-[#E6D5A8] mt-1 pt-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                        >
                          <LogOut className="h-4 w-4 mr-3" />
                          Cerrar Sesión
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setAuthModalMode('login');
                      setShowAuthModal(true);
                    }}
                    className="hidden md:flex hover:bg-[#F5EFD7]/60"
                  >
                    Iniciar Sesión
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={() => {
                      setAuthModalMode('register');
                      setShowAuthModal(true);
                    }}
                    className="hidden md:flex"
                  >
                    Registrarse
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => {
                      setAuthModalMode('login');
                      setShowAuthModal(true);
                    }}
                    className="md:hidden hover:bg-[#F5EFD7]/60"
                  >
                    <User className="h-5 w-5" />
                  </Button>
                </div>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-[#E6D5A8] rounded-full focus:outline-none focus:ring-2 focus:ring-[#CC9F53] focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-[#E6D5A8] bg-white">
            <div className="container mx-auto px-4 py-4">              <nav className="flex flex-col space-y-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-gray-700 hover:text-[#CC9F53] font-medium py-2 border-b border-gray-100 transition-colors duration-200"
                    onClick={(e) => {
                      handleNavClick(e, item);
                      setIsMenuOpen(false);
                    }}
                  >
                    {item.name}
                  </Link>
                ))}
                  {/* Aquí antes estaban los botones de Iniciar Sesión y Registrarse para mobile
                    Se eliminaron para evitar duplicación ya que se usa el icono de usuario
                    en la parte superior para mostrar estos botones */}
                  {/* User info for mobile */}
                {!isLoading && isAuthenticated && usuario && (
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-3 p-3 bg-[#F5EFD7]/60 rounded-lg mb-3">
                      <div className="flex items-center justify-center w-10 h-10 bg-[#CC9F53] text-white rounded-full text-sm font-medium">
                        {usuario.nombres?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#3A3A3A]">
                          {usuario.nombres} {usuario.apellidos}
                        </p>
                        <p className="text-xs text-gray-500">
                          {usuario.email}
                        </p>
                      </div>
                    </div>
                    
                    {/* Mobile user menu items */}
                    <div className="space-y-1">
                      {userMenuItems.map((item, index) => (
                        <Link
                          key={index}
                          href={item.href}
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-[#F5EFD7]/60 hover:text-[#CC9F53] transition-colors duration-200 rounded-lg"
                        >
                          <item.icon className="h-4 w-4 mr-3" />
                          {item.label}
                        </Link>
                      ))}
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 rounded-lg"
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        Cerrar Sesión
                      </button>
                    </div>
                  </div>
                )}
              </nav>
            </div>
          </div>
        )}
      </header>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authModalMode}
      />
    </>
  );
};

export default Header;