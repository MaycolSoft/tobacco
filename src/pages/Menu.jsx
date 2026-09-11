import { ArrowRight, Feather, Gauge, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const profiles = [
  { icon: Feather, image: '/img/menu-1.jpg', index: '01', title: 'Sutil', note: 'Ligereza y definición', text: 'Una lectura delicada donde la armonía y los matices ocupan el primer plano.', tags: ['Aromático', 'Ligero', 'Limpio'] },
  { icon: Sparkles, image: '/img/menu-2.jpg', index: '02', title: 'Equilibrado', note: 'Cuerpo y balance', text: 'Una composición donde ninguna parte domina y el carácter se desarrolla progresivamente.', tags: ['Redondo', 'Armónico', 'Expresivo'] },
  { icon: Gauge, image: '/img/menu-3.jpg', index: '03', title: 'Intenso', note: 'Profundidad y presencia', text: 'Una expresión de mayor cuerpo construida desde la estructura interna de la mezcla.', tags: ['Profundo', 'Persistente', 'Con carácter'] },
];

export default function MenuPage() {
  return (
    <div className="site-page">
      <section className="site-section site-shell"><div className="site-section-heading"><div><span className="site-kicker">No son recetas cerradas</span><h2>Tres maneras de orientar una composición.</h2></div><p>Los perfiles funcionan como punto de partida para comprender cómo cambian el cuerpo, el balance y la presencia.</p></div><div className="site-profile-grid">{profiles.map(({ icon: Icon, image, index, title, note, text, tags }) => <article key={title} className="site-profile-card"><figure><img src={image} alt={`Perfil de mezcla ${title.toLowerCase()}`} /><span>{index}</span></figure><div><Icon size={22} strokeWidth={1.3} /><span className="site-kicker">{note}</span><h3>{title}</h3><p>{text}</p><ul>{tags.map(tag => <li key={tag}>{tag}</li>)}</ul></div></article>)}</div></section>
      <section className="site-inline-cta site-shell"><div><span className="site-kicker">Ahora llévalo a la práctica</span><h2>Construye tu propio perfil.</h2></div><p>Selecciona capa, capote y tripa mientras descubres la función de cada hoja.</p><Link className="site-button site-button--secondary" to="/login">Comenzar <ArrowRight size={17} /></Link></section>
    </div>
  );
}
