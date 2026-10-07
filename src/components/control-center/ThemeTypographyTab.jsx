import { useTranslation } from 'react-i18next';
import { Palette, Square, Type } from 'lucide-react';
import { THEME_TOKEN_LABELS, BUTTON_TOKEN_LABELS, foregroundFor } from '@/config/designTheme';
import { visualProfiles } from '@/config/visualProfiles';
import { FONT_PAIRINGS } from './controlCenterConfig';
import { ChoiceCard, ColorRow, ResetButton, Section } from './controls';

export default function ThemeTypographyTab({ tokens, defaultTokens, appearance, onTokenChange, onResetToken, onSelectProfile, onResetProfile, activePairing, onApplyPairing, onResetPairing }) {
  const { t } = useTranslation();
  const customized = Object.keys(appearance.tokenOverrides).length > 0 || appearance.fontPairingOverride !== null;
  const currentProfile = visualProfiles[appearance.profileId];
  return (
    <div className="cc-stack">
      <Section title={t('controls:themeTypographyTab.visualProfile')} icon={Palette}>
        <p className="cc-note" role="status">{t(`controls:profiles.${currentProfile.id}.label`)}{customized ? t('controls:customized') : ''}</p>
        <div className="cc-choice-grid cc-profile-grid">
          {Object.values(visualProfiles).map(profile => {
            const palette = { ...defaultTokens, ...profile.tokens };
            return (
              <button type="button" key={profile.id} aria-pressed={appearance.profileId === profile.id}
                className={`cc-choice cc-profile${appearance.profileId === profile.id ? ' is-active' : ''}`}
                title={t(`controls:profiles.${profile.id}.description`)} onClick={() => onSelectProfile(profile.id)}>
                <span className="cc-choice-name">{t(`controls:profiles.${profile.id}.label`)}</span>
                <span className="cc-choice-desc">{t(`controls:profiles.${profile.id}.keywords`)}</span>
                <span className="cc-profile-swatches" aria-hidden="true">
                  {['--ls-bg', '--ls-bg-card', '--ls-text-primary', '--ls-gold'].map(key => (
                    <span key={key} style={{ backgroundColor: palette[key] }} />
                  ))}
                </span>
              </button>
            );
          })}
        </div>
        <button type="button" className="cc-btn" onClick={onResetProfile} disabled={!customized}>{t('controls:themeTypographyTab.resetProfile')}</button>
      </Section>
      <div className="cc-grid cc-grid-2">
        <Section title={t('controls:themeTypographyTab.palette')} icon={Palette}>
          <p className="cc-note">{t('controls:themeTypographyTab.colorsApplyAcrossTheWebsiteResetA')}</p>
          {Object.entries(THEME_TOKEN_LABELS).map(([prop]) => (
            <ColorRow key={prop} label={t(`controls:tokens.${prop}`)} value={tokens[prop]} onChange={value => onTokenChange(prop, value)}
              onReset={Object.hasOwn(appearance.tokenOverrides, prop) ? () => onResetToken(prop) : undefined} />
          ))}
        </Section>

        <Section title={t('controls:themeTypographyTab.buttons')} icon={Square}>
          <div className="cc-btn-preview-row">
            <span className="cc-btn-preview" style={{ background: tokens['--ls-btn-primary'], borderColor: tokens['--ls-btn-primary'], color: foregroundFor(tokens['--ls-btn-primary']) }}>{t('controls:themeTypographyTab.primary')}</span>
            <span className="cc-btn-preview" style={{ borderColor: tokens['--ls-btn-secondary'], color: tokens['--ls-btn-secondary'] }}>{t('controls:themeTypographyTab.secondary')}</span>
            <span className="cc-btn-preview cc-btn-preview-ghost" style={{ color: tokens['--ls-btn-ghost'] }}>{t('controls:themeTypographyTab.ghost')}</span>
          </div>
          {Object.entries(BUTTON_TOKEN_LABELS).map(([prop]) => (
            <ColorRow key={prop} label={t(`controls:tokens.${prop}`)} value={tokens[prop]} onChange={value => onTokenChange(prop, value)}
              onReset={Object.hasOwn(appearance.tokenOverrides, prop) ? () => onResetToken(prop) : undefined} />
          ))}
        </Section>
      </div>

      <Section title={t('controls:themeTypographyTab.typography')} icon={Type} action={appearance.fontPairingOverride !== null && <ResetButton onClick={onResetPairing} label={t('controls:themeTypographyTab.resetTypographyToProfile')} />}>
        <div className="cc-choice-grid cc-choice-grid-4">
          {FONT_PAIRINGS.map(pair => (
            <ChoiceCard key={pair.id} active={activePairing === pair.id} onClick={() => onApplyPairing(pair)}
              name={pair.name} desc={`${t(`controls:fonts.${pair.id}`)} · ${pair.heading.family.split(',')[0].replaceAll("'", '')} + ${pair.body.family.split(',')[0].replaceAll("'", '')}`}
              nameStyle={{ fontFamily: pair.heading.family }} />
          ))}
        </div>
      </Section>
    </div>
  );
}
