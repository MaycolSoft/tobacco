import { Flame, Wind, Sun, ThermometerSun } from 'lucide-react';

const families = [
  { name: 'Kentucky', Icon: Flame, curing: 'Al fuego', color: 'Marrón oscuro', profile: 'Ahumado y robusto' },
  { name: 'Burley', Icon: Wind, curing: 'Al aire', color: 'Marrón', profile: 'Notas de frutos secos y cacao' },
  { name: 'Virginia', Icon: ThermometerSun, curing: 'Con aire caliente', color: 'Amarillo a dorado', profile: 'Dulzor natural' },
  { name: 'Oriental', Icon: Sun, curing: 'Al sol', color: 'Amarillo verdoso', profile: 'Aromático' },
];

export default function TobaccoFamiliesInfo() {
  return (
    <div className="tg-families">
      <p className="tg-section-copy">La variedad y el curado ayudan a entender las diferencias entre tabacos. Esta comparación introduce cuatro perfiles generales; no indica que todos formen parte de nuestra colección.</p>
      <div className="tg-family-grid">
        {families.map(({ name, Icon, curing, color, profile }) => (
          <article className="tg-family-card" key={name}>
            <Icon size={23} strokeWidth={1.5} aria-hidden="true" /><h3>{name}</h3>
            <dl><div><dt>Curado</dt><dd>{curing}</dd></div><div><dt>Color orientativo</dt><dd>{color}</dd></div><div><dt>Perfil orientativo</dt><dd>{profile}</dd></div></dl>
          </article>
        ))}
      </div>
      <p className="tg-context-note">El origen, el cultivo y el procesamiento pueden cambiar la expresión de cada hoja. Una familia describe un perfil general; capa, capote y tripa describen su función en el cigarro.</p>
    </div>
  );
}
