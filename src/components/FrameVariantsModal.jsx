import LanguageSwitcher from '@/components/LanguageSwitcher';
import { renderMessage } from '@/i18n/messages';
import { useTranslation } from 'react-i18next';
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, RefreshCw, ChevronDown, Trash2 } from 'lucide-react';
import useBodyScrollLock from '@/hooks/useBodyScrollLock';
import useFrameVariants from '@/hooks/useFrameVariants';
import { useAnimationPerfStore } from '@/store/useAnimationPerfStore';
import { canDeleteVariant, formatResolution, getVariantFps, getVariantProfile, groupFrameVariants } from '@/lib/frameVariants';
import '@/styles/frame-variants.css';

const INITIAL_FORM = { source: '', source_fps: 60, target_fps: 30, width: 1920, height: 1080, quality: 82, workers: 4 };
const errorText = (error) => typeof error === 'string' ? error : JSON.stringify(error);

export default function FrameVariantsModal({ open, onClose }) {
  const { t, i18n } = useTranslation();
  const formatNumber = (value, options) => new Intl.NumberFormat(i18n.resolvedLanguage, options).format(value);
  const dialogRef = useRef(null);
  const titleId = useId();
  const descriptionId = useId();
  const [form, setForm] = useState(INITIAL_FORM);
  const [resolution, setResolution] = useState('1920x1080');
  const [formError, setFormError] = useState('');
  const [notice, setNotice] = useState('');
  const [collapsedGroups, setCollapsedGroups] = useState(() => new Set());
  const manager = useFrameVariants(open);
  const selections = useAnimationPerfStore(state => state.config.frameVariants);
  const selectVariant = useAnimationPerfStore(state => state.selectFrameVariant);
  const clearVariant = useAnimationPerfStore(state => state.clearFrameVariant);
  const groups = useMemo(() => groupFrameVariants(manager.items), [manager.items]);
  const masters = manager.items.filter(item => item.kind === 'master');
  const source = masters.some(item => item.name === form.source) ? form.source : masters[0]?.name ?? '';
  const unavailableSelections = Object.entries(selections).filter(([, profile]) =>
    !manager.items.some(item => item.name === profile.folder && getVariantProfile(item)));
  useBodyScrollLock(open);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const toggleGroup = (name) => setCollapsedGroups(previous => {
    const next = new Set(previous);
    if (!next.delete(name)) next.add(name);
    return next;
  });
  const update = (key, value) => setForm(previous => ({ ...previous, [key]: value }));
  const submit = (event) => {
    event.preventDefault();
    setFormError('');
    setNotice('');
    const body = Object.fromEntries(Object.entries({ ...form, source }).map(([key, value]) => [key, key === 'source' ? value : Number(value)]));
    if (!source || body.target_fps > body.source_fps) {
      setFormError({ key: 'controls:frameVariantsModal.chooseAMasterAndATargetFps' });
      return;
    }
    if (Object.entries(body).some(([key, value]) => key !== 'source' &&
      (!Number.isFinite(value) || (key === 'quality' ? value < 0 || value > 100 : value <= 0))) ||
      ['width', 'height', 'quality', 'workers'].some(key => !Number.isSafeInteger(body[key]))) {
      setFormError({ key: 'controls:frameVariantsModal.enterValidPositiveValuesDimensionsAndWorkers' });
      return;
    }
    manager.create(body);
  };

  const job = manager.job;
  const completed = Math.max(0, Number(job?.completed) || 0);
  const total = Math.max(0, Number(job?.total) || 0);
  // Prefer counts, avoiding assumptions about whether the API's progress is 0..1 or 0..100.
  const progress = total > 0 ? Math.min(100, completed / total * 100) : null;
  const jobVariant = typeof job?.variant === 'string' ? job.variant : job?.variant?.name;

  return createPortal(
    <dialog ref={dialogRef} className="fv-dialog" aria-labelledby={titleId} aria-describedby={descriptionId}
      onCancel={event => { event.preventDefault(); onClose(); }}
      onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="fv-shell">
        <header className="fv-header">
          <LanguageSwitcher />
          <div className="fv-title"><span className="fv-eyebrow">{t('controls:frameVariantsModal.animationPerformance')}</span><h2 id={titleId}>{t('controls:frameVariantsModal.manageFrameVariants')}</h2>
            <p id={descriptionId}>{t('controls:frameVariantsModal.selectAFrameProfilePerAnimationSaved')}</p></div>
          <button type="button" className="fv-icon" onClick={onClose} aria-label={t('controls:frameVariantsModal.closeFrameVariants')}><X size={18} /></button>
        </header>
        <div className="fv-body">
          <section className="fv-create" aria-labelledby={`${titleId}-create`}>
            <h3 id={`${titleId}-create`}>{t('controls:frameVariantsModal.createVariant')}</h3>
            <form onSubmit={submit}>
              <fieldset disabled={manager.busy || manager.activeJob}>
                <label>{t('controls:frameVariantsModal.sourceMaster')}<select value={source} onChange={event => update('source', event.target.value)} required>
                  {!masters.length && <option value="">{t('controls:frameVariantsModal.noMastersAvailable')}</option>}
                  {masters.map(master => <option key={master.name} value={master.name}>{master.name}</option>)}
                </select></label>
                <div className="fv-fields">
                  <label>{t('controls:frameVariantsModal.sourceFps')}<input type="number" min="0.01" step="any" required value={form.source_fps} onChange={event => update('source_fps', event.target.value)} /></label>
                  <label>{t('controls:frameVariantsModal.targetFps')}<input type="number" min="0.01" max={form.source_fps} step="any" required value={form.target_fps} onChange={event => update('target_fps', event.target.value)} /></label>
                </div>
                <label>{t('controls:frameVariantsModal.resolution')}<select value={resolution} onChange={event => {
                  const preset = event.target.value;
                  setResolution(preset);
                  if (preset !== 'custom') {
                    const [width, height] = preset.split('x').map(Number);
                    setForm(previous => ({ ...previous, width, height }));
                  }
                }}>
                  <option value="2560x1440">2560 × 1440</option><option value="1920x1080">1920 × 1080</option>
                  <option value="1280x720">1280 × 720</option><option value="custom">{t('controls:frameVariantsModal.custom')}</option>
                </select></label>
                {resolution === 'custom' && <div className="fv-fields">
                  <label>{t('controls:frameVariantsModal.width')}<input type="number" min="1" step="1" required value={form.width} onChange={event => update('width', event.target.value)} /></label>
                  <label>{t('controls:frameVariantsModal.height')}<input type="number" min="1" step="1" required value={form.height} onChange={event => update('height', event.target.value)} /></label>
                </div>}
                <div className="fv-fields">
                  <label>{t('controls:frameVariantsModal.quality')}<input type="number" min="0" max="100" step="1" required value={form.quality} onChange={event => update('quality', event.target.value)} /></label>
                  <label>{t('controls:frameVariantsModal.workers')}<input type="number" min="1" step="1" required value={form.workers} onChange={event => update('workers', event.target.value)} /></label>
                </div>
                <button className="fv-primary" type="submit" disabled={!source || manager.loading}>{manager.busy ? t('controls:frameVariantsModal.working') : t('controls:frameVariantsModal.createVariant')}</button>
              </fieldset>
            </form>
            {(formError || manager.actionError) && <p className="fv-error" role="alert">{renderMessage(formError || manager.actionError, t)}</p>}
            {job && <section className="fv-job" aria-label={t('controls:frameVariantsModal.variantGenerationProgress')} aria-live="polite">
              <strong>{t('controls:frameVariantsModal.job')} {t(`controls:status.${job.status}`, { defaultValue: job.status })}</strong><p>{jobVariant || job.id}</p>
              <progress max="100" value={progress ?? undefined} aria-label={t('controls:frameVariantsModal.generationProgress')} />
              <p>{t('controls:variant.progress', { completed: formatNumber(completed), total: total ? formatNumber(total) : '—' })}{progress !== null ? ` · ${formatNumber(progress, { maximumFractionDigits: 1 })}%` : ''}</p>
              {manager.activeJob && <small>{t('controls:frameVariantsModal.youCanCloseThisWindowProgressTracking')}</small>}
              {job.error && <p className="fv-error" role="alert">{errorText(job.error)}</p>}
              {job.status === 'failed' && !job.error && <p className="fv-error" role="alert">{t('controls:frameVariantsModal.generationFailedTheServerDidNotProvide')}</p>}
              {manager.pollError && <p className="fv-error" role="alert">{renderMessage(manager.pollError, t)} {t('controls:api.retry')}</p>}
            </section>}
          </section>
          <section className="fv-library" aria-label={t('controls:frameVariantsModal.availableFrameVariants')} aria-busy={manager.loading}>
            <div className="fv-library-heading"><h3>{t('controls:frameVariantsModal.availableVariants')} <small>({manager.items.length})</small></h3>
              <button type="button" className="fv-ghost" onClick={() => manager.refresh()} disabled={manager.loading || manager.busy}
                title={t('controls:frameVariantsModal.profilesApplyOnlyToTheirSourceAnimation')}><RefreshCw size={13} /> {t('controls:frameVariantsModal.refresh')}</button></div>
            {notice && <p className="fv-notice" role="status">{renderMessage(notice, t)}</p>}
            {manager.listError && <p className="fv-error" role="alert">{renderMessage(manager.listError, t)} {t('controls:frameVariantsModal.useRefreshToTryAgain')}</p>}
            {manager.loading && <p role="status">{t('controls:frameVariantsModal.loadingVariants')}</p>}
            {!manager.loading && !manager.listError && !manager.items.length && <p>{t('controls:frameVariantsModal.noVariantsFoundAddAMasterIn')}</p>}
            {!manager.loading && !manager.listError && unavailableSelections.map(([master, profile]) => <div className="fv-warning" key={master}>
              <p>{t('controls:variant.missing', { folder: profile.folder })}</p>
              <button type="button" onClick={() => clearVariant(master)}>{t('controls:variant.defaultFor', { master })}</button>
            </div>)}
            <div className="fv-list">
              {groups.map(group => {
                const collapsed = collapsedGroups.has(group.source);
                const activeName = selections[group.source]?.folder;
                const listId = `${titleId}-${group.source}`;
                return <section className="fv-group" key={group.source} aria-label={group.source}>
                  <div className="fv-group-heading">
                    <button type="button" className="fv-group-toggle" aria-expanded={!collapsed} aria-controls={listId} onClick={() => toggleGroup(group.source)}>
                      <ChevronDown size={14} className="fv-chevron" aria-hidden="true" />
                      <h4>{group.source}</h4>
                      <span className="fv-count">{group.variants.length}</span>
                    </button>
                    <span className="fv-group-active" title={activeName ? t('controls:frameVariantsModal.activeProfile', { value1: activeName }) : t('controls:frameVariantsModal.usingThe30FpsDefaultProfile')}>
                      {activeName ? activeName : t('controls:frameVariantsModal.default')}
                    </span>
                    {activeName && <button type="button" className="fv-link" onClick={() => { clearVariant(group.source); setNotice({ key: 'controls:frameVariantsModal.defaultProfileRestoredFor', values: { value1: group.source } }); }}>{t('controls:frameVariantsModal.useDefault')}</button>}
                  </div>
                  {!collapsed && <table className="fv-table" id={listId}>
                    <thead><tr><th>{t('controls:frameVariantsModal.name')}</th><th>FPS</th><th>{t('controls:frameVariantsModal.resolution')}</th><th>{t('controls:frameVariantsModal.quality')}</th><th>{t('controls:frameVariantsModal.type')}</th><th>{t('controls:frameVariantsModal.status')}</th><th><span className="fv-sr">{t('controls:frameVariantsModal.actions')}</span></th></tr></thead>
                    <tbody>
                      {group.variants.map(variant => {
                        const profile = getVariantProfile(variant);
                        const metadata = variant.metadata;
                        const selected = activeName === variant.name;
                        const status = metadata?.status ?? (variant.kind === 'generated' ? 'Unknown' : 'Available');
                        const hasSize = metadata?.width && metadata?.height;
                        const details = [
                          t('controls:frameVariantsModal.frames', { value1: variant.frame_count ?? '—' }),
                          hasSize && t('controls:frameVariantsModal.resolution2', { value1: metadata.width, value2: metadata.height }),
                          metadata?.source_fps && t('controls:frameVariantsModal.sourceFps2', { value1: metadata.source_fps }),
                          metadata?.source && t('controls:frameVariantsModal.source', { value1: metadata.source }),
                        ].filter(Boolean).join('\n');
                        return <tr className={selected ? 'fv-selected' : undefined} key={variant.name}>
                          <td className="fv-name" title={details}>
                            <span>{variant.name}</span>
                            {selected && <span className="fv-badge fv-badge-active">{t('controls:frameVariantsModal.active')}</span>}
                            <small>{t('controls:variant.frames', { count: variant.frame_count ?? 0 })}</small>
                          </td>
                          <td data-label="FPS">{getVariantFps(variant) ?? '—'}</td>
                          <td data-label={t('controls:frameVariantsModal.res')} title={hasSize ? `${metadata.width} × ${metadata.height}` : undefined}>{hasSize ? formatResolution(metadata) : '—'}</td>
                          <td data-label={t('controls:frameVariantsModal.q')}>{metadata?.quality ?? '—'}</td>
                          <td data-label={t('controls:frameVariantsModal.type')}><span className={`fv-badge fv-kind-${t(`controls:kind.${variant.kind}`, { defaultValue: variant.kind })}`}>{t(`controls:kind.${variant.kind}`, { defaultValue: variant.kind })}</span></td>
                          <td data-label={t('controls:frameVariantsModal.status')}><span className={`fv-status fv-status-${String(status).toLowerCase()}`}>{t(`controls:status.${status}`, { defaultValue: status })}</span></td>
                          <td className="fv-row-actions">
                            <button type="button" className="fv-use" disabled={!profile || manager.busy || selected} aria-pressed={selected}
                              title={profile ? undefined : t('controls:frameVariantsModal.availableAfterGenerationCompletesWithValidFrame')}
                              onClick={() => {
                                selectVariant(group.source, profile);
                                setNotice({ key: 'controls:frameVariantsModal.willBeUsedFor', values: { value1: variant.name, value2: group.source } });
                              }}>{selected ? t('controls:frameVariantsModal.inUse') : t('controls:frameVariantsModal.use')}</button>
                            {canDeleteVariant(variant) && <button className="fv-delete" type="button" disabled={manager.busy || manager.activeJob}
                              aria-label={t('controls:frameVariantsModal.delete', { value1: variant.name })} title={t('controls:frameVariantsModal.deleteVariant')} onClick={() => {
                                if (window.confirm(t(selected ? 'controls:variant.deleteSelected' : 'controls:variant.delete', { name: variant.name }))) {
                                  setNotice('');
                                  manager.remove(variant);
                                }
                              }}><Trash2 size={14} /></button>}
                          </td>
                        </tr>;
                      })}
                    </tbody>
                  </table>}
                </section>;
              })}
            </div>
          </section>
        </div>
      </div>
    </dialog>, document.body
  );
}
