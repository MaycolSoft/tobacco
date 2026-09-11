import { ArrowDown, ArrowRight, BookOpen, Layers3, Leaf, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { leaves } from '@/data/leaves';

const journey = [
  { number: '01', icon: Leaf, title: 'Conocer la hoja', text: 'Origen, textura y función: cada variedad aporta una parte distinta del carácter.' },
  { number: '02', icon: Layers3, title: 'Construir la mezcla', text: 'Capa, capote y tripa se encuentran en una composición pensada como un todo.' },
  { number: '03', icon: Play, title: 'Observar el oficio', text: 'La selección cobra forma en un recorrido visual que muestra el proceso paso a paso.' },
];

export default function Home() {
  return (
    <div className="site-page site-home">
      <section className="site-hero">
        <img src="/img/carousel-1.jpg" alt="Proceso artesanal del tabaco" />
        <div className="site-hero__shade" />
        <div className="site-shell site-hero__content">
          <span className="site-kicker">Tamboril · República Dominicana</span>
          <h1>El carácter comienza<br />en <em>la hoja.</em></h1>
          <p>Descubre la materia prima, entiende cómo se compone una mezcla y acompaña visualmente la creación de un cigarro.</p>
          <div className="site-actions">
            <Link className="site-button site-button--primary" to="/leaf-library">Explorar las hojas <ArrowRight size={17} /></Link>
            <Link className="site-button site-button--ghost" to="/service"><BookOpen size={17} /> Conocer el proceso</Link>
          </div>
        </div>
        <a className="site-hero__scroll" href="#recorrido"><ArrowDown size={16} /> Descubrir</a>
      </section>

      <section id="recorrido" className="site-section site-shell site-intro-grid">
        <div><span className="site-kicker">Una presentación viva</span><h2>Del cultivo al cigarro,<br />sin saltarse la historia.</h2></div>
        <div><p className="site-lead">El origen, la textura y la función de cada hoja orientan la mezcla. Conoce sus diferencias y descubre cómo se combinan para dar estructura y carácter al cigarro.</p><Link className="site-text-link" to="/about">Conocer el oficio <ArrowRight size={15} /></Link></div>
      </section>

      <section className="site-section site-section--surface">
        <div className="site-shell">
          <div className="site-section-heading"><div><span className="site-kicker">El recorrido</span><h2>Tres momentos. Una misma materia.</h2></div><p>{leaves.length} hojas documentadas para explorar sus diferencias y comprender su lugar dentro del cigarro.</p></div>
          <div className="site-journey-grid">
            {journey.map(({ number, icon: Icon, title, text }) => <article key={number} className="site-journey-card"><span>{number}</span><Icon size={25} strokeWidth={1.3} /><h3>{title}</h3><p>{text}</p></article>)}
          </div>
        </div>
      </section>

      <section className="site-feature site-shell">
        <figure className="site-feature__image"><img src="/img/about.png" alt="Composición visual de un cigarro artesanal" /><figcaption>Materia · proporción · oficio</figcaption></figure>
        <div className="site-feature__copy"><span className="site-kicker">El arte de combinar</span><h2>No se trata solo de elegir hojas. Se trata de entenderlas.</h2><p>La capa presenta, el capote sostiene y la tripa construye el corazón de la mezcla. Nuestra biblioteca permite descubrir cada función antes de crear una composición propia.</p><Link className="site-button site-button--secondary" to="/leaf-library">Entrar a la biblioteca <ArrowRight size={17} /></Link></div>
      </section>

      <section className="site-cta"><div className="site-shell"><span className="site-kicker">Experiencia interactiva</span><h2>De la selección<br />a la elaboración.</h2><p>Elige las hojas, equilibra la mezcla y observa cómo tu composición cobra forma.</p><Link className="site-button site-button--primary" to="/login">Comenzar la experiencia <ArrowRight size={17} /></Link></div></section>
    </div>
  );
}
