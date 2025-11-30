import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { IconShoppingBag, IconUser, IconMenu2 } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import CartSheet from '@/components/CartSheet';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background font-sans antialiased">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          {/* Logo & Desktop Nav */}
          <div className="flex items-center gap-6 md:gap-10">
            <Link to="/" className="flex items-center space-x-2">
              <span className="inline-block font-bold text-xl text-primary">Dulce Control</span>
            </Link>
            <nav className="hidden md:flex gap-6">
              <Link to="/" className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                Inicio
              </Link>
              <Link to="/catalogo" className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                Catálogo
              </Link>
            </nav>
          </div>



          {/* Mobile Nav & Actions */}
          <div className="flex items-center gap-4">
            <CartSheet />
            
            <Button variant="ghost" size="icon" aria-label="Usuario">
               <IconUser className="h-5 w-5" />
            </Button>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <IconMenu2 className="h-5 w-5" />
                  <span className="sr-only">Menú</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <div className="flex flex-col gap-4 py-4">
                  <Link to="/" className="text-lg font-medium">Inicio</Link>
                  <Link to="/catalogo" className="text-lg font-medium">Catálogo</Link>
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
      <footer className="border-t bg-muted/40">
        <div className="container py-8 md:py-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © 2024 Dulce Control. Todos los derechos reservados.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-sm text-muted-foreground hover:underline">Términos</a>
              <a href="#" className="text-sm text-muted-foreground hover:underline">Privacidad</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
