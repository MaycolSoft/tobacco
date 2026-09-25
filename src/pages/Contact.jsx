import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, CalendarDays, Globe2, MapPin, MessageCircle } from 'lucide-react';

export default function Contact() {
  const [sent, setSent] = useState(false);
  const handleSubmit = event => { event.preventDefault(); setSent(true); };

  return (
    <div className="site-page">
      <section className="site-section site-shell site-contact">
        <div className="site-contact__intro">
          <span className="site-kicker">Hablemos</span>
          <h2>Una presentación puede comenzar con una pregunta.</h2>
          <p className="site-lead">Si quieres conocer mejor la colección o conversar sobre el recorrido, déjanos el contexto.</p>
          <div className="site-contact__details">
            <div><MapPin size={20} aria-hidden="true" /><span><small>Origen</small>Tamboril · República Dominicana</span></div>
            <div><Globe2 size={20} aria-hidden="true" /><span><small>Sitio web</small><a href="https://tabacaleratamboril.com.do">TabacaleraTamboril.com.do <ArrowUpRight size={13} /></a></span></div>
          </div>
          {/* La presentación guiada tiene su propio formulario: no se duplica aquí. */}
          <aside className="site-contact__redirect">
            <CalendarDays size={20} aria-hidden="true" />
            <div><strong>¿Quieres coordinar una presentación guiada?</strong><p>Tiene un formulario propio con fecha, participantes y enfoque.</p></div>
            <Link className="site-text-link" to="/reservation">Solicitar presentación <ArrowRight size={15} /></Link>
          </aside>
        </div>
        <form className="site-form" onSubmit={handleSubmit}>
          <div className="site-form__heading"><MessageCircle size={25} strokeWidth={1.3} aria-hidden="true" /><div><span className="site-kicker">Tu mensaje</span><h3>Continuemos la conversación.</h3></div></div>
          <label>Nombre<input type="text" name="name" placeholder="Tu nombre" autoComplete="name" required /></label>
          <label>Correo electrónico<input type="email" name="email" placeholder="nombre@correo.com" autoComplete="email" required /></label>
          <label>Motivo<select name="subject" defaultValue="general"><option value="general">Consulta general</option><option value="information">Información</option><option value="other">Otro</option></select></label>
          <label>Mensaje<textarea name="message" rows="5" placeholder="Cuéntanos qué te gustaría conocer…" required /></label>
          <button type="submit" className="site-button site-button--primary">Enviar mensaje <ArrowRight size={17} /></button>
          {sent && <p className="site-form-status" role="status">Tu mensaje está completo. Esta versión aún no envía formularios; el envío se habilitará al conectar el servicio.</p>}
        </form>
      </section>
    </div>
  );
}
