import { Eye, Hand, Leaf, Wind } from 'lucide-react';

const senses = [
  { icon: Eye, index: '01', title: 'Apariencia', text: 'Color, uniformidad y textura ofrecen las primeras pistas sobre el carácter de una hoja.' },
  { icon: Hand, index: '02', title: 'Tacto', text: 'Flexibilidad, cuerpo y superficie ayudan a comprender su comportamiento en la composición.' },
  { icon: Leaf, index: '03', title: 'Aroma', text: 'El aroma en frío permite reconocer familias de matices antes de iniciar la experiencia.' },
  { icon: Wind, index: '04', title: 'Evolución', text: 'La mezcla se expresa por etapas; observar sus cambios es parte esencial de la lectura.' },
];

export default function Testimonial() {
  return (
    <div className="site-page"><section className="site-section site-shell"><div className="site-section-heading site-section-heading--wide"><div><span className="site-kicker">Mirar antes de interpretar</span><h2>Una experiencia que se descubre por capas.</h2></div><p className="site-lead">Conocer el tabaco también significa aprender a detenerse en los detalles.</p></div><div className="site-senses">{senses.map(({ icon: Icon, index, title, text }) => <article key={title}><span>{index}</span><Icon size={26} strokeWidth={1.25} /><h3>{title}</h3><p>{text}</p></article>)}</div></section><section className="site-sensory-quote"><div className="site-shell"><span className="site-kicker">Una lectura consciente</span><blockquote>La experiencia no empieza con una conclusión, sino con la atención.</blockquote><p>La interfaz acompaña ese ritmo: información precisa, imágenes amplias y espacios que permiten observar sin prisa.</p></div></section></div>
  );
}
