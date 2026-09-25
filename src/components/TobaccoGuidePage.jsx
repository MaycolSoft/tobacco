import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Layers, Leaf } from 'lucide-react';
import { leafCategories } from '@/data/leafPresentation';
import TobaccoFamiliesInfo from './TobaccoFamiliesInfo';
import TobaccoFamilyGallery from './TobaccoFamilyGallery';
import '@styles/tobacco-guide-page.css';

const sections = [
  { id: 'guide-composition', label: 'Composición', Icon: Layers },
  { id: 'guide-families', label: 'Familias', Icon: BookOpen },
  { id: 'guide-collection', label: 'Nuestra colección', Icon: Leaf },
];
const recipe = {
  TRIPA: { number: '01', amount: 'De 2 a 5 hojas', copy: 'Comienza por el interior. En el configurador puedes combinar de dos a cinco hojas de tripa para construir tu selección.' },
  CAPOTE: { number: '02', amount: 'Una hoja', copy: 'Continúa con el capote: una hoja que abraza la tripa y mantiene unido el conjunto.' },
  CAPA: { number: '03', amount: 'Una hoja', copy: 'Termina con la capa. Esta hoja exterior envuelve el conjunto y da su apariencia final al cigarro.' },
};

export default function TobaccoGuidePage() {
  const [part, setPart] = useState('TRIPA');
  const [activeSection, setActiveSection] = useState(sections[0].id);

  // Marca la sección visible usando el scroll normal de la página.
  useEffect(() => {
    const updateSection = () => {
      const current = sections.filter(section => document.getElementById(section.id)?.getBoundingClientRect().top <= 180).at(-1);
      setActiveSection(current?.id || sections[0].id);
    };
    updateSection();
    window.addEventListener('scroll', updateSection, { passive: true });
    return () => window.removeEventListener('scroll', updateSection);
  }, []);

  const jumpTo = (event, id) => {
    event.preventDefault();
    const target = document.getElementById(id);
    if (!target) return;
    target.scrollIntoView({ block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    setActiveSection(id);
  };
  const category = leafCategories[part];

  return (
    <article className="tg-experience" aria-labelledby="tg-title">
      <nav className="tg-nav" aria-label="Secciones de la guía">
        {sections.map(({ id, label, Icon }, index) => <a href={'#' + id} key={id} onClick={event => jumpTo(event, id)} aria-current={activeSection === id ? 'location' : undefined}><Icon size={15} aria-hidden="true" /><span>{label}</span><small>0{index + 1}</small></a>)}
      </nav>
      <div className="tg-content">
        <header className="tg-intro">
          <span className="tg-eyebrow">De la hoja al cigarro</span>
          <h1 id="tg-title">El arte de <em>combinar.</em></h1>
          <p>Conoce lo que aporta cada hoja, explora diferentes perfiles y vuelve a tu mezcla con una idea más clara.</p>
        </header>
        <section id="guide-composition" className="tg-section" aria-labelledby="tg-composition-title">
          <div className="tg-section-heading"><span className="tg-section-number">01</span><div><span className="tg-eyebrow">Tres partes, una composición</span><h2 id="tg-composition-title">De dentro hacia fuera.</h2></div></div>
          <div className="tg-composition">
            <div className="tg-anatomy">
              <span className="tg-eyebrow">Corte transversal · Esquema ilustrativo</span>
              <div className="tg-cross-section">
                {['CAPA', 'CAPOTE', 'TRIPA'].map(key => <button key={key} className={`tg-ring tg-ring-${key.toLowerCase()} ${part === key ? 'is-active' : ''}`} aria-pressed={part === key} aria-label={`Explorar ${leafCategories[key].label}`} onClick={() => setPart(key)}><span>{leafCategories[key].label}</span></button>)}
              </div>
              <p>Toca una capa para descubrir su función.</p>
            </div>
            <div className="tg-part">
              <div className="tg-part-tabs" aria-label="Partes del cigarro">
                {Object.keys(recipe).map(key => <button key={key} aria-pressed={part === key} onClick={() => setPart(key)}>{recipe[key].number} <span>{leafCategories[key].label}</span></button>)}
              </div>
              <div className="tg-part-story" aria-live="polite" aria-atomic="true">
                <span className="tg-eyebrow">{category.position} · {recipe[part].amount}</span>
                <h3>{category.role}</h3><p>{category.description}</p>
                <div className="tg-practice"><Layers size={18} aria-hidden="true" /><div><h4>En tu mezcla</h4><p>{recipe[part].copy}</p></div></div>
              </div>
            </div>
          </div>
        </section>
        <section id="guide-families" className="tg-section" aria-labelledby="tg-families-title">
          <div className="tg-section-heading"><span className="tg-section-number">02</span><div><span className="tg-eyebrow">Una mirada al tabaco</span><h2 id="tg-families-title">Diferentes expresiones.</h2></div></div>
          <TobaccoFamiliesInfo />
        </section>
        <section id="guide-collection" className="tg-section" aria-labelledby="tg-collection-title">
          <div className="tg-section-heading"><span className="tg-section-number">03</span><div><span className="tg-eyebrow">Nuestra materia prima</span><h2 id="tg-collection-title">Ahora, conoce las hojas.</h2></div></div>
          <TobaccoFamilyGallery />
          <Link className="tg-library-link" to="/leaf-library">Explorar la biblioteca completa <ArrowRight size={17} /></Link>
        </section>
        <p className="tg-end-note">Cada hoja aporta una parte. La mezcla cuenta la historia.</p>
      </div>
      <footer className="tg-footer"><span>Aplica lo aprendido en el configurador.</span><Link to="/craft-your-cigar">Crear mi mezcla <ArrowRight size={17} /></Link></footer>
    </article>
  );
}
