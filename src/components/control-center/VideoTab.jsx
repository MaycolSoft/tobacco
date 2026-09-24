import { Clapperboard, Layers } from 'lucide-react';
import { ColorRow, Section } from './controls';

export default function VideoTab({ tokens, appearance, onTokenChange, onResetToken, onOpenVariants }) {
  return (
    <div className="cc-grid cc-grid-2">
      <Section title="Video Scene" icon={Clapperboard}>
        <ColorRow label="Fondo de los fotogramas" value={tokens['--ls-video-bg']} onChange={value => onTokenChange('--ls-video-bg', value)}
          onReset={Object.hasOwn(appearance.tokenOverrides, '--ls-video-bg') ? () => onResetToken('--ls-video-bg') : undefined} />
        <p className="cc-note">El perfil visual define este fondo. Puedes ajustarlo para integrarlo con los fotogramas.</p>
      </Section>

      <Section title="Frame variants" icon={Layers}>
        <p className="cc-note">Choose the frame profile (FPS and resolution) for each animation. Without a selection, the 30 fps default is used.</p>
        <button type="button" className="cc-btn cc-btn-primary cc-btn-block" onClick={onOpenVariants}>Manage frame variants</button>
      </Section>
    </div>
  );
}
