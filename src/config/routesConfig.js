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
    title: "Tabacalera Tamboril",
    subtitle: "Del cultivo al cigarro",
    icon: Home,
    showNavbar: true,
    showFooter: true,
    showHeader: false,
    navbarSticky: false
  },
  "/leaf-library": {
    title: "Biblioteca de hojas",
    subtitle: "Materia prima",
    icon: Library,
    showNavbar: true,
    showFooter: false, // Según tu log: "showFooter":false
    showHeader: false,
    navbarSticky: true  // Según tu log: "navbarSticky":true
  },
  "/about": {
    title: "El oficio",
    subtitle: "Una cultura construida alrededor de la hoja",
    icon: Info,
    showNavbar: true,
    showFooter: true,
    showHeader: false, // La página incluye su propia portada editorial.
    navbarSticky: false
  },
  "/service": {
    title: "El proceso",
    subtitle: "De la selección al acabado",
    icon: Cigarette,
    showNavbar: true,
    showFooter: true,
    showHeader: true,   // Según tu log: "showHeader":true
    navbarSticky: false
  },
  "/menu": {
    title: "Perfiles de mezcla",
    subtitle: "Equilibrio, carácter y expresión",
    icon: LayoutGrid,
    showNavbar: true,
    showFooter: true,
    showHeader: true,   // Según tu log: "showHeader":true
    navbarSticky: false
  },
  "/reservation": {
    headerVariant: 'compact',
    title: "Presentación guiada",
    subtitle: "Una experiencia alrededor del tabaco",
    icon: CalendarCheck,
    showNavbar: true,
    showFooter: true,
    showHeader: true,
    navbarSticky: false
  },
  "/testimonial": {
    title: "La experiencia sensorial",
    subtitle: "Aprender a observar cada detalle",
    icon: MessageSquare,
    showNavbar: true,
    showFooter: true,
    showHeader: true,
    navbarSticky: false
  },
  "/contact": {
    headerVariant: 'compact',
    title: "Contacto",
    subtitle: "Continuemos la conversación",
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
