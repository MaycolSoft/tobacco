import { useTranslation } from 'react-i18next';
import { Clapperboard, Layers } from 'lucide-react';
import { ColorRow, Section } from './controls';

export default function VideoTab({ tokens, appearance, onTokenChange, onResetToken, onOpenVariants }) {
  const { t } = useTranslation();
  return (
    <div className="cc-grid cc-grid-2">
      <Section title={t('controls:videoTab.videoScene')} icon={Clapperboard}>
        <ColorRow label={t('controls:videoTab.frameBackground')} value={tokens['--ls-video-bg']} onChange={value => onTokenChange('--ls-video-bg', value)}
          onReset={Object.hasOwn(appearance.tokenOverrides, '--ls-video-bg') ? () => onResetToken('--ls-video-bg') : undefined} />
        <p className="cc-note">{t('controls:videoTab.theVisualProfileDefinesThisBackgroundAdjust')}</p>
      </Section>

      <Section title={t('controls:videoTab.frameVariants')} icon={Layers}>
        <p className="cc-note">{t('controls:videoTab.chooseTheFrameProfileFpsAndResolution')}</p>
        <button type="button" className="cc-btn cc-btn-primary cc-btn-block" onClick={onOpenVariants}>{t('controls:videoTab.manageFrameVariants')}</button>
      </Section>
    </div>
  );
}
