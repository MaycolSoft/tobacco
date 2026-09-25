import { useEffect } from 'react';
import { ArrowDown, ArrowRight, Eye, Hand, Layers3, Scale, ScanEye } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useLayoutStore } from '@/store/useLayoutStore';
import { useAuthStore } from '@store/authStore';
import { leaves } from '@/data/leaves';
import { leafCategories } from '@/data/leafPresentation';

// El oficio reúne el conocimiento del tabaquero y el proceso que antes vivía en /service.
const principles = [
  { icon: Eye, title: 'Observar', text: 'Leer el color, la textura y la estructura antes de tomar una decisión.' },
  { icon: Hand, title: 'Comprender', text: 'Reconocer lo que cada hoja puede aportar dentro de una composición.' },
  { icon: Scale, title: 'Equilibrar', text: 'Construir carácter sin perder armonía entre aroma, cuerpo y fortaleza.' },
  { icon: Layers3, title: 'Elaborar', text: 'Reunir capa, capote y tripa y darles forma con las manos, paso a paso.' },
];
const chapters = [
  { id: 'seleccion', label: 'Selección' },
  { id: 'composicion', label: 'Composición' },
  { id: 'elaboracion', label: 'Elaboración' },
];
const components = ['capa-habana', 'capote-criollo-98', 'tripa-olor-seco'].map(id => leaves.find(leaf => leaf.id === id));

export default function About() {
  const showHeader = useLayoutStore(state => state.currentConfig.showHeader);
  const user = useAuthStore(state => state.user);
  const { hash } = useLocation();
  const Title = showHeader ? 'h2' : 'h1';

  // Permite llegar directamente al proceso desde /service o desde otras páginas.
  useEffect(() => {
    if (!hash) return;
    const frame = requestAnimationFrame(() => document.getElementById(hash.slice(1))?.scrollIntoView({ block: 'start' }));
    return () => cancelAnimationFrame(frame);
  }, [hash]);

  return (
    <div className="site-page">
      <section className="site-shell site-about-intro" aria-labelledby="about-title">
        <div className="site-about-intro__copy">
          <span className="site-kicker">Materia prima · Conocimiento · Tradición</span>
          <Title id="about-title">{showHeader ? 'La hoja guía cada gesto.' : <>El oficio.<br /><em>La hoja guía cada gesto.</em></>}</Title>
          <p className="site-lead">Observar la hoja, reconocer su carácter y encontrar su lugar en la mezcla: ahí comienza el trabajo del tabaquero.</p>
          <p>Su textura, flexibilidad y estructura orientan la selección. Las manos reúnen esas diferencias y les dan forma, cuidando cada parte del cigarro.</p>
          <a className="site-text-link" href="#proceso">Conocer el proceso <ArrowDown size={17} /></a>
        </div>
        <figure className="site-about-intro__image">
          <img src="/img/oficio-manos-editorial-v1.jpg" alt="Ilustración de manos examinando la textura de una hoja de tabaco sobre una mesa de madera" width="1122" height="1402" fetchPriority="high" />
          <figcaption>La materia se conoce. El oficio se practica.</figcaption>
        </figure>
      </section>

      <section className="site-section site-section--surface" aria-labelledby="principles-title">
        <div className="site-shell">
          <div className="site-section-heading"><div><span className="site-kicker">Principios del oficio</span><h2 id="principles-title">Atención, conocimiento y equilibrio.</h2></div><p>Una línea de trabajo donde la técnica acompaña a los sentidos.</p></div>
          <ol className="site-principles site-principles--flow">{principles.map(({ icon: Icon, title, text }, index) => <li key={title}><span>0{index + 1}</span><Icon size={24} strokeWidth={1.3} aria-hidden="true" /><h3>{title}</h3><p>{text}</p></li>)}</ol>
        </div>
      </section>

      <section id="proceso" className="site-section site-shell site-anchor" aria-labelledby="process-title">
        <div className="site-section-heading site-section-heading--wide">
          <div><span className="site-kicker">El proceso · Una secuencia de decisiones</span><h2 id="process-title">La forma final comienza en la selección.</h2></div>
          <p className="site-lead">Conoce la materia prima, descubre su lugar en el conjunto y observa la elaboración.</p>
        </div>
        <nav className="site-chapter-nav" aria-label="Etapas del proceso">
          {chapters.map(({ id, label }, index) => <a key={id} href={`#${id}`}><span>0{index + 1}</span>{label}</a>)}
        </nav>
        <div className="site-process-chapters">
          <article id="seleccion" className="site-process-chapter site-anchor">
            <div className="site-process-chapter__copy">
              <span className="site-kicker">01 · Selección</span><ScanEye size={24} strokeWidth={1.3} aria-hidden="true" />
              <h3>Aprender a mirar.</h3><p>Color, textura e integridad ofrecen una primera lectura de cada hoja. En la biblioteca puedes acercarte a sus detalles y consultar su descripción.</p>
              <Link className="site-text-link" to="/leaf-library">Explorar la colección <ArrowRight size={16} /></Link>
            </div>
            <figure className="site-process-specimen"><img src={components[0].fullImg} alt="Hoja completa de capa Habana de la colección" loading="lazy" /><figcaption>Capa Habana · Imagen de la colección</figcaption></figure>
          </article>
          <article id="composicion" className="site-process-chapter site-anchor">
            <div className="site-process-chapter__copy">
              <span className="site-kicker">02 · Composición</span><Layers3 size={24} strokeWidth={1.3} aria-hidden="true" />
              <h3>Cada parte tiene su lugar.</h3><p>La capa envuelve, el capote sostiene y la tripa forma el interior. Reconocer estas funciones ayuda a entender cómo se construye una composición.</p>
              <div className="site-link-row">
                <Link className="site-text-link" to="/leaf-library?categoria=TRIPA">Explorar hojas de tripa <ArrowRight size={16} /></Link>
                <Link className="site-text-link" to="/menu">Explorar perfiles <ArrowRight size={16} /></Link>
              </div>
            </div>
            <div className="site-process-parts">{components.map(leaf => <figure key={leaf.id}><img src={leaf.fullImg} alt={`${leafCategories[leaf.category].label}: ${leaf.name}`} loading="lazy" /><figcaption><strong>{leafCategories[leaf.category].label}</strong><span>{leafCategories[leaf.category].position}</span></figcaption></figure>)}</div>
          </article>
        </div>
      </section>

      <section id="elaboracion" className="site-process-feature site-anchor" aria-labelledby="craft-title">
        <div className="site-process-feature__image"><img src="/img/carousel-2.jpg" alt="Manos durante la elaboración de un cigarro" loading="lazy" /></div>
        <div className="site-process-feature__copy"><Hand size={28} strokeWidth={1.3} aria-hidden="true" /><span className="site-kicker">03 · Elaboración</span><h2 id="craft-title">Del conocimiento al gesto.</h2><p>En la mesa de composición reúnes tripa, capote y capa. Cuando tu cigarro está completo, puedes ver cómo cobra forma en una secuencia visual.</p><Link className="site-button site-button--primary" to={user ? '/craft-your-cigar' : '/login'}>Crear mi cigarro <ArrowRight size={17} /></Link></div>
      </section>

      <section className="site-section site-shell site-quote"><span aria-hidden="true">“</span><blockquote>Conocer la hoja transforma la manera de entender el cigarro.</blockquote><Link className="site-text-link" to="/leaf-library">Explorar la colección <ArrowRight size={15} /></Link></section>
    </div>
  );
}
