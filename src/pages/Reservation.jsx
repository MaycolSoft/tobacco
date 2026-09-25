import { useState } from 'react';
import { ArrowRight, CalendarDays, Check, Clock3, Users } from 'lucide-react';

const highlights = ['Recorrido por la biblioteca de hojas', 'Explicación de capa, capote y tripa', 'Demostración visual de la elaboración'];

export default function Reservation() {
  const [sent, setSent] = useState(false);
  const handleSubmit = event => { event.preventDefault(); setSent(true); };

  return (
    <div className="site-page">
      <section className="site-section site-shell site-request">
        <div className="site-request__intro"><span className="site-kicker">Presentación guiada</span><h2>Una conversación alrededor de la hoja.</h2><p className="site-lead">Coordina una sesión para recorrer el origen, la composición y el proceso de elaboración con una narrativa clara y visual.</p><ul>{highlights.map(item => <li key={item}><Check size={16} aria-hidden="true" />{item}</li>)}</ul><div className="site-request__meta"><span><Clock3 size={18} aria-hidden="true" /> Ritmo guiado</span><span><Users size={18} aria-hidden="true" /> Experiencia compartida</span></div></div>
        <form className="site-form" onSubmit={handleSubmit}>
          <div className="site-form__heading"><CalendarDays size={25} strokeWidth={1.3} aria-hidden="true" /><div><span className="site-kicker">Coordinar experiencia</span><h3>Cuéntanos sobre tu presentación.</h3></div></div>
          <label>Nombre<input type="text" name="name" placeholder="Tu nombre" autoComplete="name" required /></label>
          <label>Correo electrónico<input type="email" name="email" placeholder="nombre@correo.com" autoComplete="email" required /></label>
          <div className="site-form__row"><label>Fecha de interés<input type="date" name="date" /></label><label>Participantes<select name="attendees" defaultValue=""><option value="" disabled>Seleccionar</option><option>1–5 personas</option><option>6–12 personas</option><option>Más de 12</option></select></label></div>
          <label>Enfoque de la presentación<select name="focus" defaultValue="complete"><option value="complete">Recorrido completo</option><option value="leaves">Biblioteca de hojas</option><option value="blend">Creación de una mezcla</option></select></label>
          <button type="submit" className="site-button site-button--primary">Solicitar presentación <ArrowRight size={17} /></button>
          {sent && <p className="site-form-status" role="status">Tu solicitud está completa. Esta versión aún no envía formularios; el envío se habilitará al conectar el servicio.</p>}
          <small>Este formulario forma parte de la presentación visual y no realiza pagos.</small>
        </form>
      </section>
    </div>
  );
}
