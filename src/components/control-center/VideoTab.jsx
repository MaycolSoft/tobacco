import { Clapperboard, Film, Layers } from 'lucide-react';
import { useAnimationPerfStore } from '@/store/useAnimationPerfStore';
import { FRAME_SOURCES } from './controlCenterConfig';
import { ChoiceCard, ColorRow, Section } from './controls';

export default function VideoTab({ tokens, onTokenChange, onOpenVariants }) {
  const sourceMode = useAnimationPerfStore(state => state.config.sourceMode);
  const updatePerfConfig = useAnimationPerfStore(state => state.updateConfig);

  return (
    <div className="cc-grid cc-grid-2">
      <Section title="Video Scene" icon={Clapperboard}>
        <ColorRow label="Fondo de los fotogramas" value={tokens['--ls-video-bg']} onChange={value => onTokenChange('--ls-video-bg', value)} />
        <p className="cc-note">El tono original se conserva para integrar las imágenes del video.</p>
      </Section>

      <div className="cc-stack">
        <Section title="Frame source" icon={Film}>
          <div className="cc-choice-grid">
            {FRAME_SOURCES.map(source => (
              <ChoiceCard key={source.id} active={sourceMode === source.id} onClick={() => updatePerfConfig({ sourceMode: source.id })}
                name={source.name} desc={source.desc} />
            ))}
          </div>
          <p className="cc-note">Las variantes elegidas por animación tienen prioridad sobre Frame source.</p>
        </Section>

        <Section title="Frame variants" icon={Layers}>
          <p className="cc-note">Create, select or delete frame profiles per animation.</p>
          <button type="button" className="cc-btn cc-btn-primary cc-btn-block" onClick={onOpenVariants}>Manage frame variants</button>
        </Section>
      </div>
    </div>
  );
}
