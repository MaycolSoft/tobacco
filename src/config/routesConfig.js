// src/config/routesConfig.js
import { 
  Home, 
  Library, 
  Info, 
  LayoutGrid, 
  CalendarCheck, 
  MessageSquare, 
  Mail, 
  Wrench, 
  LogIn 
} from 'lucide-react';

/**
 * CONFIGURACIÓN CENTRALIZADA DE RUTAS
 * Basada en las preferencias guardadas en el UI Control Center
 */
export const routesConfig = {
  "/": {
    titleKey: "navigation:routes.home.title",
    subtitleKey: "navigation:routes.home.subtitle",
    icon: Home,
    showNavbar: true,
    showFooter: true,
    showHeader: false,
    navbarSticky: false
  },
  "/leaf-library": {
    titleKey: "navigation:routes.library.title",
    subtitleKey: "navigation:routes.library.subtitle",
    icon: Library,
    showNavbar: true,
    showFooter: false, // Según tu log: "showFooter":false
    showHeader: false,
    navbarSticky: true  // Según tu log: "navbarSticky":true
  },
  "/about": {
    titleKey: "navigation:routes.about.title",
    subtitleKey: "navigation:routes.about.subtitle",
    icon: Info,
    showNavbar: true,
    showFooter: true,
    showHeader: false, // La página incluye su propia portada editorial.
    navbarSticky: false
  },
  "/menu": {
    titleKey: "navigation:routes.menu.title",
    subtitleKey: "navigation:routes.menu.subtitle",
    icon: LayoutGrid,
    showNavbar: true,
    showFooter: true,
    showHeader: true,   // Según tu log: "showHeader":true
    navbarSticky: false
  },
  "/reservation": {
    headerVariant: 'compact',
    parentKey: "navigation:routes.reservation.parent",
    titleKey: "navigation:routes.reservation.title",
    subtitleKey: "navigation:routes.reservation.subtitle",
    icon: CalendarCheck,
    showNavbar: true,
    showFooter: true,
    showHeader: true,
    navbarSticky: false
  },
  "/testimonial": {
    parentKey: "navigation:routes.testimonial.parent",
    titleKey: "navigation:routes.testimonial.title",
    subtitleKey: "navigation:routes.testimonial.subtitle",
    icon: MessageSquare,
    showNavbar: true,
    showFooter: true,
    showHeader: true,
    navbarSticky: false
  },
  "/contact": {
    headerVariant: 'compact',
    titleKey: "navigation:routes.contact.title",
    subtitleKey: "navigation:routes.contact.subtitle",
    icon: Mail,
    showNavbar: true,
    showFooter: true,
    showHeader: true,   // Según tu log: "showHeader":true
    navbarSticky: false
  },
  "/craft-your-cigar": {
    titleKey: "navigation:routes.craft.title",
    subtitleKey: "navigation:routes.craft.subtitle",
    icon: Wrench,
    showNavbar: true, 
    showFooter: false, 
    showHeader: false,
    navbarSticky: true
  },
  "/login": {
    titleKey: "navigation:routes.login.title",
    subtitleKey: "navigation:routes.login.subtitle",
    icon: LogIn,
    showNavbar: true,
    showFooter: false,
    showHeader: false,
    navbarSticky: false
  }
};

/**
 * Función auxiliar para obtener la configuración
 */
export const getRouteConfig = (pathname) => {
  return routesConfig[pathname] || {
    titleKey: "navigation:routes.notFound.title",
    subtitleKey: "navigation:routes.notFound.subtitle",
    icon: Info,
    showNavbar: true,
    showFooter: true,
    showHeader: false,
    navbarSticky: false
  };
};
