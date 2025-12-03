import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { IconShoppingBag, IconUser, IconMenu2, IconSearch } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import CartSheet from '@/components/CartSheet';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background font-sans antialiased">
      {/* Top Bar - Mint Background */}
      {/* <div className="bg-primary text-primary-foreground py-2 text-center text-xs font-bold tracking-widest uppercase">
        Envíos a todo Lima | Pedidos con 24h de anticipación
      </div>
 */}
      {/* Header - White Background */}
      <header className="sticky top-0 z-50 w-full border-b bg-white">
        <div className="container flex h-24 items-center justify-between">
          {/* Logo - Serif 32px */}
          <Link to="/" className="flex items-center">
            <span className="font-serif text-[32px] font-bold text-foreground tracking-tight leading-none">
              DulceControl
            </span>
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
                  {/* Mock: Check if user is logged in */}
                  {false ? ( // Change to actual auth state
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/mis-compras" className="cursor-pointer">
                          Mis Compras
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive focus:text-destructive cursor-pointer">
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
              <h3 className="font-serif text-2xl font-bold mb-4 text-foreground">DulceControl</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Horneando momentos especiales con los mejores ingredientes y mucho amor.
              </p>
            </div>
            <div>
              <h4 className="font-bold uppercase text-xs tracking-widest mb-4 text-foreground">Productos</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/colecciones/cupcakes" className="hover:text-primary transition-colors">Cupcakes</Link></li>
                <li><Link to="/colecciones/pasteleria" className="hover:text-primary transition-colors">Tortas</Link></li>
                <li><Link to="/colecciones/pasteleria" className="hover:text-primary transition-colors">Cheesecakes</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold uppercase text-xs tracking-widest mb-4 text-foreground">Ayuda</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/faq" className="hover:text-primary transition-colors">Preguntas Frecuentes</Link></li>
                <li><Link to="/contact" className="hover:text-primary transition-colors">Contacto</Link></li>
                <li><Link to="/shipping" className="hover:text-primary transition-colors">Envíos</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold uppercase text-xs tracking-widest mb-4 text-foreground">Síguenos</h4>
              <div className="flex gap-4">
                {/* Social Icons placeholder */}
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-foreground hover:bg-primary hover:text-white transition-colors cursor-pointer shadow-sm">
                   <span className="font-serif font-bold">Ig</span>
                </div>
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-foreground hover:bg-primary hover:text-white transition-colors cursor-pointer shadow-sm">
                   <span className="font-serif font-bold">Fb</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-foreground/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted-foreground text-center md:text-left">
              © 2024 DulceControl. Todos los derechos reservados.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">Términos</a>
              <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">Privacidad</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
