import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const columns = [
  { title: 'Explorar', links: [['/leaf-library', 'Las hojas'], ['/about', 'El oficio'], ['/menu', 'Perfiles de mezcla']] },
  { title: 'Experiencias', links: [['/testimonial', 'Experiencia sensorial'], ['/reservation', 'Presentación guiada'], ['/contact', 'Contacto']] },
];

const Footer = () => (
  <footer className="site-footer">
    <div className="site-shell site-footer__grid">
      <div className="site-footer__statement">
        <span className="site-kicker">Tabacalera Tamboril</span>
        <h2>La hoja cuenta la historia.<br />El oficio le da forma.</h2>
        <p>Una experiencia visual para descubrir la materia prima, comprender la mezcla y observar cómo nace un cigarro.</p>
      </div>
      {columns.map(({ title, links }) => (
        <nav className="site-footer__column" key={title} aria-label={title}>
          <span>{title}</span>
          {links.map(([to, label]) => <Link key={to} to={to}>{label}</Link>)}
        </nav>
      ))}
    </div>
    <div className="site-shell site-footer__base">
      <span>© {new Date().getFullYear()} Tabacalera Tamboril</span>
      <span>Contenido dirigido a personas adultas.</span>
      <a href="https://tabacaleratamboril.com.do">TabacaleraTamboril.com.do <ArrowUpRight size={13} /></a>
    </div>
  </footer>
);

export default Footer;
