import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { IconShoppingBag, IconUser, IconMenu2, IconSearch, IconBrandFacebook, IconBrandInstagram, IconBrandTiktok, IconBrandPinterest, IconBrandWhatsapp } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import CartSheet from '@/components/CartSheet';
import { useTiendaConfig } from '../context/TiendaConfigContext';
import { useAuthStore } from '../stores/authStore';

const MainLayout = () => {
  const navigate = useNavigate();
  const { config, loading } = useTiendaConfig();
  const { isAuthenticated, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Parse redesSociales JSON
  const redesSociales = React.useMemo(() => {
    if (!config?.redesSociales) return null;
    try {
      return JSON.parse(config.redesSociales);
    } catch (error) {
      console.error('Error parsing redesSociales:', error);
      return null;
    }
  }, [config?.redesSociales]);

  // Mapeo de redes sociales a íconos
  const socialIcons = {
    facebook: { Icon: IconBrandFacebook, label: 'Facebook' },
    instagram: { Icon: IconBrandInstagram, label: 'Instagram' },
    tiktok: { Icon: IconBrandTiktok, label: 'TikTok' },
    pinterest: { Icon: IconBrandPinterest, label: 'Pinterest' },
    whatsapp: { Icon: IconBrandWhatsapp, label: 'WhatsApp' },
  };

  // Mostrar loader mientras carga la configuración
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">Cargando tienda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans antialiased">
      {/* Header - White Background */}
      <header className="sticky top-0 z-50 w-full border-b bg-white">
        <div className="container flex h-24 items-center justify-between">
          {/* Logo dinámico desde backend */}
          <Link to="/" className="flex items-center">
            {config?.urlLogo ? (
              <img 
                src={config.urlLogo} 
                alt="Logo" 
                className="h-16 w-auto object-contain"
              />
            ) : (
              <span className="font-serif text-[32px] font-bold text-foreground tracking-tight leading-none">
                DulceControl
              </span>
            )}
          </Link>

          {/* Desktop Nav - Centered */}
          <nav className="hidden md:flex gap-10 items-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Link to="/" className="text-sm font-bold uppercase tracking-widest text-foreground/80 hover:text-primary transition-colors">
              Inicio
            </Link>
            <Link to="/colecciones" className="text-sm font-bold uppercase tracking-widest text-foreground/80 hover:text-primary transition-colors">
              Productos
            </Link>
            <Link to="/sobre-nosotros" className="text-sm font-bold uppercase tracking-widest text-foreground/80 hover:text-primary transition-colors">
              Sobre Nosotros
            </Link>
            <Link to="/contactanos" className="text-sm font-bold uppercase tracking-widest text-foreground/80 hover:text-primary transition-colors">
              Contáctanos
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* CTA Button - Pink Pill */}
            <Button asChild variant="default" className="hidden md:inline-flex rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 font-bold uppercase text-xs tracking-wider px-6 h-10 shadow-none">
              <Link to="/custom-order">
                Pide tu Pastel
              </Link>
            </Button>
            
            <div className="flex items-center gap-2">
              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Usuario">
                    <IconUser className="h-5 w-5"/>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {isAuthenticated ? (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/mis-compras" className="cursor-pointer">
                          Mis Compras
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive cursor-pointer">
                        Cerrar Sesión
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/login" className="cursor-pointer">
                          Iniciar Sesión
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/register" className="cursor-pointer">
                          Registrarse
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
              <CartSheet />
            </div>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden text-foreground">
                  <IconMenu2 className="h-6 w-6" strokeWidth={1.5} />
                  <span className="sr-only">Menú</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <div className="flex flex-col gap-6 py-8">
                  <Link to="/" className="text-xl font-serif font-bold text-foreground">Inicio</Link>
                  <Link to="/colecciones" className="text-xl font-serif font-bold text-foreground">Productos</Link>
                  <Link to="/sobre-nosotros" className="text-xl font-serif font-bold text-foreground">Sobre Nosotros</Link>
                  <Link to="/contactanos" className="text-xl font-serif font-bold text-foreground">Contáctanos</Link>
                  <Link to="/custom-order" className="text-xl font-serif font-bold text-secondary-foreground">Pide tu Pastel</Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-secondary/30 pt-16 pb-8">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="font-serif text-2xl font-bold mb-4 text-foreground">{config?.nombreTienda || 'Tienda'}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {config?.mensajeBienvenida}
              </p>
            </div>
            <div>
              <h4 className="font-bold uppercase text-xs tracking-widest mb-4 text-foreground">Productos</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/colecciones" className="hover:text-primary transition-colors">Ver Catálogo</Link></li>
                <li><Link to="/custom-order" className="hover:text-primary transition-colors">Pedidos Personalizados</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold uppercase text-xs tracking-widest mb-4 text-foreground">Ayuda</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/sobre-nosotros" className="hover:text-primary transition-colors">Sobre Nosotros</Link></li>
                <li><Link to="/contactanos" className="hover:text-primary transition-colors">Contacto</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold uppercase text-xs tracking-widest mb-4 text-foreground">Síguenos</h4>
              <div className="flex gap-4">
                {redesSociales && Object.entries(redesSociales).length > 0 ? (
                  Object.entries(redesSociales).map(([red, url]) => {
                    const socialData = socialIcons[red.toLowerCase()];
                    if (!socialData || !url) return null;
                    
                    const { Icon, label } = socialData;
                    return (
                      <a
                        key={red}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-foreground hover:bg-primary hover:text-white transition-colors shadow-sm"
                      >
                        <Icon className="h-5 w-5" />
                      </a>
                    );
                  })
                ) : (
                  <>
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-foreground hover:bg-primary hover:text-white transition-colors cursor-pointer shadow-sm">
                      <span className="font-serif font-bold">Ig</span>
                    </div>
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-foreground hover:bg-primary hover:text-white transition-colors cursor-pointer shadow-sm">
                      <span className="font-serif font-bold">Fb</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="border-t border-foreground/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted-foreground text-center md:text-left">
              © {new Date().getFullYear()} {config?.nombreTienda || 'Tienda'}. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
