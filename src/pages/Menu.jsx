import { ArrowRight, Feather, Gauge, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { leaves } from '@/data/leaves';
import { leafCategories } from '@/data/leafPresentation';

const profiles = [
  { icon: Feather, leafId: 'tripa-olor-seco', title: 'Aroma', note: 'Los matices de la hoja', text: 'Comienza por reconocer las notas descritas en cada variedad. Compara sus diferencias antes de combinarlas.' },
  { icon: Sparkles, leafId: 'capote-criollo-98', title: 'Estructura', note: 'La función de cada parte', text: 'Observa cómo el capote sostiene el conjunto. La composición también se entiende desde la función de cada hoja.' },
  { icon: Gauge, leafId: 'tripa-corojo-ligero', title: 'Fortaleza', note: 'La presencia en la mezcla', text: 'Compara las hojas de carácter intenso con las más moderadas para orientar tu selección.' },
];

export default function MenuPage() {
  return (
    <div className="site-page">
      <section className="site-section site-shell">
        <div className="site-section-heading">
          <div><span className="site-kicker">Aprender a combinar</span><h2>Una mezcla empieza por conocer sus hojas.</h2></div>
          <p>Aroma, estructura y fortaleza: tres aspectos para explorar la colección. Las hojas de referencia muestran aportes individuales; el resultado depende del conjunto.</p>
        </div>
        <div className="site-profile-grid site-profile-grid--specimens">
          {profiles.map(({ icon: Icon, leafId, title, note, text }, index) => {
            const leaf = leaves.find(item => item.id === leafId);
            return (
              <article key={title} className="site-profile-card">
                <figure><img src={leaf.fullImg} alt={`Hoja de ${leaf.name}, ${leafCategories[leaf.category].label}`} loading="lazy" /><span>0{index + 1}</span></figure>
                <div>
                  <Icon size={22} strokeWidth={1.3} aria-hidden="true" />
                  <span className="site-kicker">{note}</span><h3>{title}</h3><p>{text}</p>
                  <div className="site-leaf-reference">
                    <span className="site-kicker">Hoja de referencia · {leafCategories[leaf.category].label}</span>
                    <h4>{leaf.name}</h4><p>{leaf.description}</p>
                  </div>
                  <Link className="site-text-link" to={`/leaf-library#${leaf.id}`}>Conocer esta hoja <ArrowRight size={16} /></Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>
      <section className="site-inline-cta site-shell">
        <div><span className="site-kicker">De la hoja a la composición</span><h2>Encuentra tu equilibrio.</h2></div>
        <p>Explora las variedades, selecciona capa, capote y tripa y continúa al recorrido visual de elaboración.</p>
        <Link className="site-button site-button--primary" to="/craft-your-cigar">Crear mi cigarro <ArrowRight size={17} /></Link>
      </section>
    </div>
  );
}
