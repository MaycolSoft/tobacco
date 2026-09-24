import { Palette, Square, Type } from 'lucide-react';
import { THEME_TOKEN_LABELS, BUTTON_TOKEN_LABELS, foregroundFor } from '@/config/designTheme';
import { visualProfiles } from '@/config/visualProfiles';
import { FONT_PAIRINGS } from './controlCenterConfig';
import { ChoiceCard, ColorRow, ResetButton, Section } from './controls';

export default function ThemeTypographyTab({ tokens, defaultTokens, appearance, onTokenChange, onResetToken, onSelectProfile, onResetProfile, activePairing, onApplyPairing, onResetPairing }) {
  const customized = Object.keys(appearance.tokenOverrides).length > 0 || appearance.fontPairingOverride !== null;
  const currentProfile = visualProfiles[appearance.profileId];
  return (
    <div className="cc-stack">
      <Section title="Visual Profile" icon={Palette}>
        <p className="cc-note" role="status">{currentProfile.label}{customized ? ' · Customized' : ''}</p>
        <div className="cc-choice-grid cc-profile-grid">
          {Object.values(visualProfiles).map(profile => {
            const palette = { ...defaultTokens, ...profile.tokens };
            return (
              <button type="button" key={profile.id} aria-pressed={appearance.profileId === profile.id}
                className={`cc-choice cc-profile${appearance.profileId === profile.id ? ' is-active' : ''}`}
                title={profile.description} onClick={() => onSelectProfile(profile.id)}>
                <span className="cc-choice-name">{profile.label}</span>
                <span className="cc-choice-desc">{profile.keywords.slice(0, 3).join(' · ')}</span>
                <span className="cc-profile-swatches" aria-hidden="true">
                  {['--ls-bg', '--ls-bg-card', '--ls-text-primary', '--ls-gold'].map(key => (
                    <span key={key} style={{ backgroundColor: palette[key] }} />
                  ))}
                </span>
              </button>
            );
          })}
        </div>
        <button type="button" className="cc-btn" onClick={onResetProfile} disabled={!customized}>Reset profile</button>
      </Section>
      <div className="cc-grid cc-grid-2">
        <Section title="Palette" icon={Palette}>
          <p className="cc-note">Colors apply across the website. Reset a customized value to inherit from the active profile.</p>
          {Object.entries(THEME_TOKEN_LABELS).map(([prop, label]) => (
            <ColorRow key={prop} label={label} value={tokens[prop]} onChange={value => onTokenChange(prop, value)}
              onReset={Object.hasOwn(appearance.tokenOverrides, prop) ? () => onResetToken(prop) : undefined} />
          ))}
        </Section>

        <Section title="Buttons" icon={Square}>
          <div className="cc-btn-preview-row">
            <span className="cc-btn-preview" style={{ background: tokens['--ls-btn-primary'], borderColor: tokens['--ls-btn-primary'], color: foregroundFor(tokens['--ls-btn-primary']) }}>Primary</span>
            <span className="cc-btn-preview" style={{ borderColor: tokens['--ls-btn-secondary'], color: tokens['--ls-btn-secondary'] }}>Secondary</span>
            <span className="cc-btn-preview cc-btn-preview-ghost" style={{ color: tokens['--ls-btn-ghost'] }}>Ghost →</span>
          </div>
          {Object.entries(BUTTON_TOKEN_LABELS).map(([prop, label]) => (
            <ColorRow key={prop} label={label} value={tokens[prop]} onChange={value => onTokenChange(prop, value)}
              onReset={Object.hasOwn(appearance.tokenOverrides, prop) ? () => onResetToken(prop) : undefined} />
          ))}
        </Section>
      </div>

      <Section title="Typography" icon={Type} action={appearance.fontPairingOverride !== null && <ResetButton onClick={onResetPairing} label="Reset typography to profile" />}>
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
