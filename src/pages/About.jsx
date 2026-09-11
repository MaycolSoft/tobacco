import { ArrowRight, Eye, Hand, Scale } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLayoutStore } from '@/store/useLayoutStore';

const principles = [
  { icon: Eye, title: 'Observar', text: 'Leer el color, la textura y la estructura antes de tomar una decisión.' },
  { icon: Hand, title: 'Comprender', text: 'Reconocer lo que cada hoja puede aportar dentro de una composición.' },
  { icon: Scale, title: 'Equilibrar', text: 'Construir carácter sin perder armonía entre aroma, cuerpo y fortaleza.' },
];

export default function About() {
  const showHeader = useLayoutStore(state => state.currentConfig.showHeader);
  const Title = showHeader ? 'h2' : 'h1';
  return (
    <div className="site-page">
      <section className="site-shell site-about-intro" aria-labelledby="about-title">
        <div className="site-about-intro__copy">
          <span className="site-kicker">Materia prima · Conocimiento · Tradición</span>
          <Title id="about-title">{showHeader ? 'La hoja guía cada gesto.' : <>El oficio.<br /><em>La hoja guía cada gesto.</em></>}</Title>
          <p className="site-lead">Observar la hoja, reconocer su carácter y encontrar su lugar en la mezcla: ahí comienza el trabajo del tabaquero.</p>
          <p>Su textura, flexibilidad y estructura orientan la selección. Las manos reúnen esas diferencias y les dan forma, cuidando cada parte del cigarro.</p>
          <Link className="site-text-link" to="/service">Conocer el proceso <ArrowRight size={17} /></Link>
        </div>
        <figure className="site-about-intro__image">
          <img src="/img/oficio-manos-editorial-v1.jpg" alt="Ilustración de manos examinando la textura de una hoja de tabaco sobre una mesa de madera" width="1122" height="1402" fetchPriority="high" />
          <figcaption>La materia se conoce. El oficio se practica.</figcaption>
        </figure>
      </section>
      <section className="site-section site-section--surface"><div className="site-shell"><div className="site-section-heading"><div><span className="site-kicker">Principios del oficio</span><h2>Atención, conocimiento y equilibrio.</h2></div><p>Una línea de trabajo donde la técnica acompaña a los sentidos.</p></div><div className="site-principles">{principles.map(({ icon: Icon, title, text }, index) => <article key={title}><span>0{index + 1}</span><Icon size={24} strokeWidth={1.3} /><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>
      <section className="site-section site-shell site-quote"><span aria-hidden="true">“</span><blockquote>Conocer la hoja transforma la manera de entender el cigarro.</blockquote><Link className="site-text-link" to="/leaf-library">Explorar la colección <ArrowRight size={15} /></Link></section>
    </div>
  );
}
