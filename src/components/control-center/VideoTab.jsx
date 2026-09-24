import { Clapperboard, Layers } from 'lucide-react';
import { ColorRow, Section } from './controls';

export default function VideoTab({ tokens, onTokenChange, onOpenVariants }) {
  return (
    <div className="cc-grid cc-grid-2">
      <Section title="Video Scene" icon={Clapperboard}>
        <ColorRow label="Fondo de los fotogramas" value={tokens['--ls-video-bg']} onChange={value => onTokenChange('--ls-video-bg', value)} />
        <p className="cc-note">El tono original se conserva para integrar las imágenes del video.</p>
      </Section>

      <Section title="Frame variants" icon={Layers}>
        <p className="cc-note">Choose the frame profile (FPS and resolution) for each animation. Without a selection, the 30 fps default is used.</p>
        <button type="button" className="cc-btn cc-btn-primary cc-btn-block" onClick={onOpenVariants}>Manage frame variants</button>
      </Section>
    </div>
  );
}
