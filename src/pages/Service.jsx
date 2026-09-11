import { ArrowRight, Hand, Layers3, ScanEye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { leaves } from '@/data/leaves';
import { leafCategories } from '@/data/leafPresentation';

const components = ['capa-habana', 'capote-criollo-98', 'tripa-olor-seco'].map(id => leaves.find(leaf => leaf.id === id));

export default function Service() {
  return (
    <div className="site-page">
      <section className="site-section site-shell">
        <div className="site-section-heading site-section-heading--wide">
          <div><span className="site-kicker">Una secuencia de decisiones</span><h2>La forma final comienza en la selección.</h2></div>
          <p className="site-lead">Conoce la materia prima, descubre su lugar en el conjunto y observa la elaboración.</p>
        </div>
        <div className="site-process-chapters">
          <article className="site-process-chapter">
            <div className="site-process-chapter__copy">
              <span className="site-kicker">01 · Selección</span><ScanEye size={24} strokeWidth={1.3} aria-hidden="true" />
              <h3>Aprender a mirar.</h3><p>Color, textura e integridad ofrecen una primera lectura de cada hoja. En la biblioteca puedes acercarte a sus detalles y consultar su descripción.</p>
              <Link className="site-text-link" to="/leaf-library">Explorar la materia prima <ArrowRight size={16} /></Link>
            </div>
            <figure className="site-process-specimen"><img src={components[0].fullImg} alt="Hoja completa de capa Habana de la colección" loading="lazy" /><figcaption>Capa Habana · Imagen de la colección</figcaption></figure>
          </article>
          <article className="site-process-chapter">
            <div className="site-process-chapter__copy">
              <span className="site-kicker">02 · Composición</span><Layers3 size={24} strokeWidth={1.3} aria-hidden="true" />
              <h3>Cada parte tiene su lugar.</h3><p>La capa envuelve, el capote sostiene y la tripa forma el interior. Reconocer estas funciones ayuda a entender cómo se construye una composición.</p>
              <Link className="site-text-link" to="/menu">Comprender los aportes <ArrowRight size={16} /></Link>
            </div>
            <div className="site-process-parts">{components.map(leaf => <figure key={leaf.id}><img src={leaf.fullImg} alt={`${leafCategories[leaf.category].label}: ${leaf.name}`} loading="lazy" /><figcaption><strong>{leafCategories[leaf.category].label}</strong><span>{leafCategories[leaf.category].position}</span></figcaption></figure>)}</div>
          </article>
        </div>
      </section>
      <section className="site-process-feature">
        <div className="site-process-feature__image"><img src="/img/carousel-2.jpg" alt="Manos durante la elaboración de un cigarro" loading="lazy" /></div>
        <div className="site-process-feature__copy"><Hand size={28} strokeWidth={1.3} aria-hidden="true" /><span className="site-kicker">03 · Elaboración</span><h2>Del conocimiento al gesto.</h2><p>Abre la mesa de selección, reúne las hojas de tu composición y continúa al recorrido visual. El video permite observar cómo se forma el cigarro.</p><Link className="site-button site-button--primary" to="/craft-your-cigar">Crear mi cigarro <ArrowRight size={17} /></Link></div>
      </section>
    </div>
  );
}
