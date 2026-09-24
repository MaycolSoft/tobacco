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
    setCacheStatus('Limpiando…');
    try {
      await clearFrameCache();
      setCacheStatus('Caché de animación eliminada.');
    } catch (error) {
      setCacheStatus(`No se pudo limpiar: ${error.message}`);
    }
  };

  return (
    <div className="cc-grid cc-grid-2">
      <div className="cc-stack">
        <Section title="Animation Performance" icon={Gauge} action={<ResetButton onClick={resetPerfConfig} label="Restaurar valores por defecto de rendimiento" />}>
          <p className="cc-note">Ajustes guardados en este navegador.</p>
          {PERF_RANGES.map(({ key, label, step, format }) => (
            <label key={key} className="cc-range-row">
              <span>{label}</span>
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

        <Section title="Tools" icon={Trash2}>
          <ToggleRow icon={Eye} label="Show loader stats" checked={perfConfig.showLoaderStats}
            onToggle={() => updatePerfConfig({ showLoaderStats: !perfConfig.showLoaderStats })} />
          <button type="button" className="cc-btn cc-btn-block" onClick={handleClearFrameCache}>Clear animation cache</button>
          {cacheStatus && <p className="cc-note" role="status">{cacheStatus}</p>}
        </Section>
      </div>

      <Section title="Diagnostics" icon={Activity} className="cc-diagnostics" action={<span className="cc-live">Live · 500 ms</span>}>
        <table className="cc-stats">
          <tbody>
            {PERF_STATS.map(([key, label, format]) => (
              <tr key={key}>
                <th scope="row">{label}</th>
                <td>{perfStats ? (format ? format(perfStats[key]) : (perfStats[key] ?? '—')) : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>
    </div>
  );
}
