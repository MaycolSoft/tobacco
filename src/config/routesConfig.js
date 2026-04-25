// src/config/routesConfig.js
import { 
  Home, 
  Library, 
  Info, 
  Cigarette, 
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
    title: "The Master Blender",
    subtitle: "Bienvenido",
    icon: Home,
    showNavbar: true,
    showFooter: true,
    showHeader: false,
    navbarSticky: false
  },
  "/leaf-library": {
    title: "Biblioteca de Hojas",
    subtitle: "Catálogo Premium",
    icon: Library,
    showNavbar: true,
    showFooter: false, // Según tu log: "showFooter":false
    showHeader: false,
    navbarSticky: true  // Según tu log: "navbarSticky":true
  },
  "/about": {
    title: "Nuestra Historia",
    subtitle: "About Us",
    icon: Info,
    showNavbar: true,
    showFooter: true,
    showHeader: true,   // Según tu log: "showHeader":true
    navbarSticky: false
  },
  "/service": {
    title: "Nuestros Cigarros",
    subtitle: "Servicios Premium",
    icon: Cigarette,
    showNavbar: true,
    showFooter: true,
    showHeader: true,   // Según tu log: "showHeader":true
    navbarSticky: false
  },
  "/menu": {
    title: "Nuestras Ligas",
    subtitle: "Our Blends",
    icon: LayoutGrid,
    showNavbar: true,
    showFooter: true,
    showHeader: true,   // Según tu log: "showHeader":true
    navbarSticky: false
  },
  "/reservation": {
    title: "Reservaciones",
    subtitle: "Reserva tu Experiencia",
    icon: CalendarCheck,
    showNavbar: true,
    showFooter: true,
    showHeader: false,
    navbarSticky: false
  },
  "/testimonial": {
    title: "Testimonios",
    subtitle: "Lo que dicen nuestros clientes",
    icon: MessageSquare,
    showNavbar: true,
    showFooter: true,
    showHeader: false,
    navbarSticky: false
  },
  "/contact": {
    title: "Contacto",
    subtitle: "Habla con nosotros",
    icon: Mail,
    showNavbar: true,
    showFooter: true,
    showHeader: true,   // Según tu log: "showHeader":true
    navbarSticky: false
  },
  "/craft-your-cigar": {
    title: "Crea tu Cigarro",
    subtitle: "Configurador Maestro",
    icon: Wrench,
    showNavbar: true, 
    showFooter: false, 
    showHeader: false,
    navbarSticky: true
  },
  "/login": {
    title: "Acceso",
    subtitle: "Inicia Sesión",
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
    title: "Error 404",
    subtitle: "Página no encontrada",
    icon: Info,
    showNavbar: true,
    showFooter: true,
    showHeader: false,
    navbarSticky: false
  };
};