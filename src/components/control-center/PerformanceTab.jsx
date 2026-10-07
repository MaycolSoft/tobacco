import { renderMessage } from '@/i18n/messages';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { Activity, Eye, Gauge, Trash2 } from 'lucide-react';
import { useAnimationPerfStore } from '@/store/useAnimationPerfStore';
import { ANIMATION_PERF_LIMITS } from '@/config/animationPerformance';
import { clearFrameCache, enforceCacheBudget } from '@/lib/frameCache';
import { getFrameDiagnostics } from '@/lib/frameScheduler';
import { PERF_RANGES, PERF_STATS } from './controlCenterConfig';
import { ResetButton, Section, ToggleRow } from './controls';

// Only mounted while the Control Center is open on this tab, so diagnostics poll only then.
export default function PerformanceTab() {
  const { t } = useTranslation();
  const { config: perfConfig, updateConfig: updatePerfConfig, resetConfig: resetPerfConfig } = useAnimationPerfStore();
  const [perfStats, setPerfStats] = useState(null);
  const [cacheStatus, setCacheStatus] = useState('');

  useEffect(() => {
    enforceCacheBudget(); // calcula el tamaño aproximado de la caché
    const update = () => setPerfStats(getFrameDiagnostics());
    update();
    const interval = setInterval(update, 500);
    return () => clearInterval(interval);
  }, []);

  const handleClearFrameCache = async () => {
    setCacheStatus({ key: 'controls:performanceTab.clearing' });
    try {
      await clearFrameCache();
      setCacheStatus({ key: 'controls:performanceTab.animationCacheCleared' });
    } catch (error) {
      setCacheStatus({ key: 'controls:performanceTab.couldNotClear', values: { value1: error.message } });
    }
  };

  return (
    <div className="cc-grid cc-grid-2">
      <div className="cc-stack">
        <Section title={t('controls:performanceTab.animationPerformance')} icon={Gauge} action={<ResetButton onClick={resetPerfConfig} label={t('controls:performanceTab.restoreDefaultPerformanceSettings')} />}>
          <p className="cc-note">{t('controls:performanceTab.settingsSavedInThisBrowser')}</p>
          {PERF_RANGES.map(({ key, step, format }) => (
            <label key={key} className="cc-range-row">
              <span>{t(`controls:ranges.${key}`)}</span>
              <code>{format ? format(perfConfig[key]) : perfConfig[key]}</code>
              <input
                type="range"
                min={ANIMATION_PERF_LIMITS[key][0]}
                max={ANIMATION_PERF_LIMITS[key][1]}
                step={step}
                value={perfConfig[key]}
                onChange={(event) => updatePerfConfig({ [key]: Number(event.target.value) })}
              />
            </label>
          ))}
        </Section>

        <Section title={t('controls:performanceTab.tools')} icon={Trash2}>
          <ToggleRow icon={Eye} label={t('controls:performanceTab.showLoaderStats')} checked={perfConfig.showLoaderStats}
            onToggle={() => updatePerfConfig({ showLoaderStats: !perfConfig.showLoaderStats })} />
          <button type="button" className="cc-btn cc-btn-block" onClick={handleClearFrameCache}>{t('controls:performanceTab.clearAnimationCache')}</button>
          {cacheStatus && <p className="cc-note" role="status">{renderMessage(cacheStatus, t)}</p>}
        </Section>
      </div>

      <Section title={t('controls:performanceTab.diagnostics')} icon={Activity} className="cc-diagnostics" action={<span className="cc-live">{t('controls:performanceTab.live500Ms')}</span>}>
        <table className="cc-stats">
          <tbody>
            {PERF_STATS.map(([key, , format]) => (
              <tr key={key}>
                <th scope="row">{t(`controls:stats.${key}`)}</th>
                <td>{perfStats ? (format ? format(perfStats[key]) : (perfStats[key] ?? '—')) : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>
    </div>
  );
}
