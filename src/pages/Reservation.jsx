import { CalendarDays, Check, Clock3, Users } from 'lucide-react';

const highlights = ['Recorrido por la biblioteca de hojas', 'Explicación de capa, capote y tripa', 'Demostración visual de la elaboración'];

export default function Reservation() {
  return (
    <div className="site-page">
      <section className="site-section site-shell site-request">
        <div className="site-request__intro"><span className="site-kicker">Presentación guiada</span><h2>Una conversación alrededor de la hoja.</h2><p className="site-lead">Prepara una sesión para recorrer el origen, la composición y el proceso de elaboración con una narrativa clara y visual.</p><ul>{highlights.map(item => <li key={item}><Check size={16} />{item}</li>)}</ul><div className="site-request__meta"><span><Clock3 size={18} /> Ritmo guiado</span><span><Users size={18} /> Experiencia compartida</span></div></div>
        <form className="site-form" onSubmit={event => event.preventDefault()}><div className="site-form__heading"><CalendarDays size={25} strokeWidth={1.3} /><div><span className="site-kicker">Coordinar experiencia</span><h3>Cuéntanos sobre tu presentación.</h3></div></div><label>Nombre<input type="text" name="name" placeholder="Tu nombre" /></label><label>Correo electrónico<input type="email" name="email" placeholder="nombre@correo.com" /></label><div className="site-form__row"><label>Fecha de interés<input type="date" name="date" /></label><label>Participantes<select name="attendees" defaultValue=""><option value="" disabled>Seleccionar</option><option>1–5 personas</option><option>6–12 personas</option><option>Más de 12</option></select></label></div><label>Enfoque de la presentación<select name="focus" defaultValue="complete"><option value="complete">Recorrido completo</option><option value="leaves">Biblioteca de hojas</option><option value="blend">Creación de una mezcla</option></select></label><button type="submit" className="site-button site-button--primary">Preparar solicitud</button><small>Este formulario forma parte de la presentación visual y no realiza pagos.</small></form>
      </section>
    </div>
  );
}
