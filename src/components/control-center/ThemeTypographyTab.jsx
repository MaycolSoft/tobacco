import { Palette, Square, Type } from 'lucide-react';
import { THEME_TOKEN_LABELS, BUTTON_TOKEN_LABELS, foregroundFor } from '@/config/designTheme';
import { FONT_PAIRINGS } from './controlCenterConfig';
import { ChoiceCard, ColorRow, ResetButton, Section } from './controls';

export default function ThemeTypographyTab({ tokens, onTokenChange, onResetTokens, activePairing, onApplyPairing }) {
  return (
    <div className="cc-stack">
      <div className="cc-grid cc-grid-2">
        <Section title="Palette" icon={Palette} action={<ResetButton onClick={onResetTokens} label="Restaurar paleta Tabaco editorial" />}>
          <p className="cc-note">Base: Tabaco editorial. Los colores se comparten entre la biblioteca y el configurador.</p>
          {Object.entries(THEME_TOKEN_LABELS).map(([prop, label]) => (
            <ColorRow key={prop} label={label} value={tokens[prop]} onChange={value => onTokenChange(prop, value)} />
          ))}
          <button type="button" className="cc-btn cc-btn-primary cc-btn-block" onClick={onResetTokens}>Aplicar paleta base</button>
        </Section>

        <Section title="Buttons" icon={Square}>
          <div className="cc-btn-preview-row">
            <span className="cc-btn-preview" style={{ background: tokens['--ls-btn-primary'], borderColor: tokens['--ls-btn-primary'], color: foregroundFor(tokens['--ls-btn-primary']) }}>Primary</span>
            <span className="cc-btn-preview" style={{ borderColor: tokens['--ls-btn-secondary'], color: tokens['--ls-btn-secondary'] }}>Secondary</span>
            <span className="cc-btn-preview cc-btn-preview-ghost" style={{ color: tokens['--ls-btn-ghost'] }}>Ghost →</span>
          </div>
          {Object.entries(BUTTON_TOKEN_LABELS).map(([prop, label]) => (
            <ColorRow key={prop} label={label} value={tokens[prop]} onChange={value => onTokenChange(prop, value)} />
          ))}
        </Section>
      </div>

      <Section title="Typography" icon={Type}>
        <div className="cc-choice-grid cc-choice-grid-4">
          {FONT_PAIRINGS.map(pair => (
            <ChoiceCard key={pair.id} active={activePairing === pair.id} onClick={() => onApplyPairing(pair)}
              name={pair.name} desc={`${pair.desc} · ${pair.heading.family.split(',')[0].replaceAll("'", '')} + ${pair.body.family.split(',')[0].replaceAll("'", '')}`}
              nameStyle={{ fontFamily: pair.heading.family }} />
          ))}
        </div>
      </Section>
    </div>
  );
}
