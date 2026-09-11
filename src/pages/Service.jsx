import { ArrowRight, Boxes, CircleDot, Hand, Layers3, ScanEye } from 'lucide-react';
import { Link } from 'react-router-dom';

const stages = [
  { icon: ScanEye, title: 'Selección', label: 'Leer la materia', text: 'Se observan integridad, textura y cualidades visuales para reconocer el potencial de cada hoja.' },
  { icon: Layers3, title: 'Composición', label: 'Definir la estructura', text: 'Capa, capote y tripa se organizan según la función que cumplirán dentro del cigarro.' },
  { icon: Boxes, title: 'Proporción', label: 'Buscar equilibrio', text: 'La relación entre las hojas determina el cuerpo, la evolución y la expresión de la mezcla.' },
  { icon: Hand, title: 'Formación', label: 'Dar forma', text: 'La técnica convierte la selección en una pieza coherente, cuidando construcción y acabado.' },
];

export default function Service() {
  return (
    <div className="site-page">
      <section className="site-section site-shell"><div className="site-section-heading site-section-heading--wide"><div><span className="site-kicker">Una secuencia de decisiones</span><h2>La forma final comienza mucho antes de enrollar.</h2></div><p className="site-lead">Cada etapa conecta conocimiento técnico, sensibilidad y respeto por la materia prima.</p></div><div className="site-process-list">{stages.map(({ icon: Icon, title, label, text }, index) => <article key={title}><span className="site-process-list__number">0{index + 1}</span><div className="site-process-list__icon"><Icon size={25} strokeWidth={1.3} /></div><div><span className="site-kicker">{label}</span><h3>{title}</h3></div><p>{text}</p></article>)}</div></section>
      <section className="site-process-feature"><div className="site-process-feature__image"><img src="/img/service-2.jpg" alt="Detalle del proceso artesanal del tabaco" /></div><div className="site-process-feature__copy"><CircleDot size={28} strokeWidth={1.3} /><span className="site-kicker">Aprender mirando</span><h2>El proceso también se puede recorrer.</h2><p>En la experiencia de creación, la selección de hojas se conecta con una secuencia visual para mostrar cómo esa composición se transforma en un cigarro.</p><Link className="site-button site-button--primary" to="/login">Crear una composición <ArrowRight size={17} /></Link></div></section>
    </div>
  );
}
