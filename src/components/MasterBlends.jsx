import { ArrowRight } from "lucide-react";

// Mezclas del maestro: composiciones de referencia que se cargan como base editable.
// No se muestra nada hasta que existan composiciones definidas en src/data/masterBlends.js.
export default function MasterBlends({ blends = [], onUse }) {
  if (!blends.length) return null;
  return (
    <section className="craft-masters" aria-labelledby="craft-masters-title">
      <div className="craft-masters__heading">
        <div><span className="site-kicker">Punto de partida opcional</span><h2 id="craft-masters-title">Mezclas del maestro</h2></div>
        <p>Composiciones de referencia. Al usar una como base, sus hojas se cargan en tu mezcla y puedes cambiar cualquiera.</p>
      </div>
      <ul className="craft-masters__list">
        {blends.map(blend => {
          const count = blend.leaves.TRIPA.length + 2;
          return (
            <li key={blend.id} className="craft-master">
              <span className="site-kicker">{blend.profile}</span>
              <h3>{blend.name}</h3>
              <p>{blend.description}</p>
              <dl>
                <div><dt>Intensidad</dt><dd className="craft-dots" role="img" aria-label={`${blend.intensity} de 5`}>{[1, 2, 3, 4, 5].map(value => <i key={value} className={value <= blend.intensity ? 'is-on' : ''} />)}</dd></div>
                <div><dt>Hojas</dt><dd>{count}</dd></div>
              </dl>
              <button type="button" className="site-text-link" onClick={() => onUse(blend)}>Usar como base <ArrowRight size={15} /></button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
