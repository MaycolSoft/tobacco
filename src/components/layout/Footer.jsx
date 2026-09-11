import { ArrowUpRight, BookOpen, Leaf, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="site-footer">
    <div className="site-shell site-footer__grid">
      <div className="site-footer__statement">
        <span className="site-kicker">Tabacalera Tamboril</span>
        <h2>La hoja cuenta la historia.<br />El oficio le da forma.</h2>
        <p>Una experiencia visual para descubrir la materia prima, comprender la mezcla y observar cómo nace un cigarro.</p>
      </div>
      <div className="site-footer__column">
        <span>Explorar</span>
        <Link to="/leaf-library"><Leaf size={15} /> Biblioteca de hojas</Link>
        <Link to="/service"><BookOpen size={15} /> El proceso</Link>
        <Link to="/menu">Perfiles de mezcla</Link>
      </div>
      <div className="site-footer__column">
        <span>Experiencia</span>
        <Link to="/about">Nuestro oficio</Link>
        <Link to="/testimonial">Experiencia sensorial</Link>
        <Link to="/reservation">Presentación guiada</Link>
        <Link to="/contact"><MapPin size={15} /> Contacto</Link>
      </div>
    </div>
    <div className="site-shell site-footer__base">
      <span>© {new Date().getFullYear()} Tabacalera Tamboril</span>
      <span>Contenido dirigido a personas adultas.</span>
      <a href="https://tabacaleratamboril.com.do">TabacaleraTamboril.com.do <ArrowUpRight size={13} /></a>
    </div>
  </footer>
);

export default Footer;
