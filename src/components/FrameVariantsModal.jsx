import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, RefreshCw, ChevronDown, Trash2 } from 'lucide-react';
import useBodyScrollLock from '@/hooks/useBodyScrollLock';
import useFrameVariants from '@/hooks/useFrameVariants';
import { useAnimationPerfStore } from '@/store/useAnimationPerfStore';
import { canDeleteVariant, getVariantFps, getVariantProfile, groupFrameVariants } from '@/lib/frameVariants';
import '@/styles/frame-variants.css';

const INITIAL_FORM = { source: '', source_fps: 60, target_fps: 30, width: 1920, height: 1080, quality: 82, workers: 4 };
const errorText = (error) => typeof error === 'string' ? error : JSON.stringify(error);
const formatResolution = ({ width, height }) => {
  const short = Math.min(width, height);
  if (width >= 3840 || short >= 2160) return '4K';
  return `${short}p`;
};

export default function FrameVariantsModal({ open, onClose }) {
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
      setFormError('Choose a master and a target FPS no greater than the source FPS.');
      return;
    }
    if (Object.entries(body).some(([key, value]) => key !== 'source' &&
      (!Number.isFinite(value) || (key === 'quality' ? value < 0 || value > 100 : value <= 0))) ||
      ['width', 'height', 'quality', 'workers'].some(key => !Number.isSafeInteger(body[key]))) {
      setFormError('Enter valid positive values. Dimensions and workers must be whole numbers; quality must be from 0 to 100.');
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
          <div className="fv-title"><span className="fv-eyebrow">Animation Performance</span><h2 id={titleId}>Manage frame variants</h2>
            <p id={descriptionId}>Select a frame profile per animation. Saved in this browser.</p></div>
          <button type="button" className="fv-icon" onClick={onClose} aria-label="Close frame variants"><X size={18} /></button>
        </header>
        <div className="fv-body">
          <section className="fv-create" aria-labelledby={`${titleId}-create`}>
            <h3 id={`${titleId}-create`}>Create variant</h3>
            <form onSubmit={submit}>
              <fieldset disabled={manager.busy || manager.activeJob}>
                <label>Source / master<select value={source} onChange={event => update('source', event.target.value)} required>
                  {!masters.length && <option value="">No masters available</option>}
                  {masters.map(master => <option key={master.name} value={master.name}>{master.name}</option>)}
                </select></label>
                <div className="fv-fields">
                  <label>Src FPS<input type="number" min="0.01" step="any" required value={form.source_fps} onChange={event => update('source_fps', event.target.value)} /></label>
                  <label>Target FPS<input type="number" min="0.01" max={form.source_fps} step="any" required value={form.target_fps} onChange={event => update('target_fps', event.target.value)} /></label>
                </div>
                <label>Resolution<select value={resolution} onChange={event => {
                  const preset = event.target.value;
                  setResolution(preset);
                  if (preset !== 'custom') {
                    const [width, height] = preset.split('x').map(Number);
                    setForm(previous => ({ ...previous, width, height }));
                  }
                }}>
                  <option value="2560x1440">2560 × 1440</option><option value="1920x1080">1920 × 1080</option>
                  <option value="1280x720">1280 × 720</option><option value="custom">Custom</option>
                </select></label>
                {resolution === 'custom' && <div className="fv-fields">
                  <label>Width<input type="number" min="1" step="1" required value={form.width} onChange={event => update('width', event.target.value)} /></label>
                  <label>Height<input type="number" min="1" step="1" required value={form.height} onChange={event => update('height', event.target.value)} /></label>
                </div>}
                <div className="fv-fields">
                  <label>Quality<input type="number" min="0" max="100" step="1" required value={form.quality} onChange={event => update('quality', event.target.value)} /></label>
                  <label>Workers<input type="number" min="1" step="1" required value={form.workers} onChange={event => update('workers', event.target.value)} /></label>
                </div>
                <button className="fv-primary" type="submit" disabled={!source || manager.loading}>{manager.busy ? 'Working…' : 'Create variant'}</button>
              </fieldset>
            </form>
            {(formError || manager.actionError) && <p className="fv-error" role="alert">{formError || manager.actionError}</p>}
            {job && <section className="fv-job" aria-label="Variant generation progress" aria-live="polite">
              <strong>Job: {job.status}</strong><p>{jobVariant || job.id}</p>
              <progress max="100" value={progress ?? undefined} aria-label="Generation progress" />
              <p>{completed} / {total || '—'} frames{progress !== null ? ` · ${progress.toFixed(1)}%` : ''}</p>
              {manager.activeJob && <small>You can close this window. Progress tracking resumes after a page reload.</small>}
              {job.error && <p className="fv-error" role="alert">{errorText(job.error)}</p>}
              {job.status === 'failed' && !job.error && <p className="fv-error" role="alert">Generation failed. The server did not provide details.</p>}
              {manager.pollError && <p className="fv-error" role="alert">{manager.pollError}</p>}
            </section>}
          </section>
          <section className="fv-library" aria-label="Available frame variants" aria-busy={manager.loading}>
            <div className="fv-library-heading"><h3>Available variants <small>({manager.items.length})</small></h3>
              <button type="button" className="fv-ghost" onClick={() => manager.refresh()} disabled={manager.loading || manager.busy}
                title="Profiles apply only to their source animation. Use default restores the 30 fps default profile."><RefreshCw size={13} /> Refresh</button></div>
            {notice && <p className="fv-notice" role="status">{notice}</p>}
            {manager.listError && <p className="fv-error" role="alert">{manager.listError} Use Refresh to try again.</p>}
            {manager.loading && <p role="status">Loading variants…</p>}
            {!manager.loading && !manager.listError && !manager.items.length && <p>No variants found. Add a master in the CDN Asset Manager to get started.</p>}
            {!manager.loading && !manager.listError && unavailableSelections.map(([master, profile]) => <div className="fv-warning" key={master}>
              <p>The saved profile “{profile.folder}” is missing or not ready.</p>
              <button type="button" onClick={() => clearVariant(master)}>Use default for {master}</button>
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
                    <span className="fv-group-active" title={activeName ? `Active profile: ${activeName}` : 'Using the 30 fps default profile'}>
                      {activeName ? activeName : 'Default'}
                    </span>
                    {activeName && <button type="button" className="fv-link" onClick={() => { clearVariant(group.source); setNotice(`Default profile restored for ${group.source}.`); }}>Use default</button>}
                  </div>
                  {!collapsed && <table className="fv-table" id={listId}>
                    <thead><tr><th>Name</th><th>FPS</th><th>Resolution</th><th>Quality</th><th>Type</th><th>Status</th><th><span className="fv-sr">Actions</span></th></tr></thead>
                    <tbody>
                      {group.variants.map(variant => {
                        const profile = getVariantProfile(variant);
                        const metadata = variant.metadata;
                        const selected = activeName === variant.name;
                        const status = metadata?.status ?? (variant.kind === 'generated' ? 'Unknown' : 'Available');
                        const hasSize = metadata?.width && metadata?.height;
                        const details = [
                          `Frames: ${variant.frame_count ?? '—'}`,
                          hasSize && `Resolution: ${metadata.width} × ${metadata.height}`,
                          metadata?.source_fps && `Source FPS: ${metadata.source_fps}`,
                          metadata?.source && `Source: ${metadata.source}`,
                        ].filter(Boolean).join('\n');
                        return <tr className={selected ? 'fv-selected' : undefined} key={variant.name}>
                          <td className="fv-name" title={details}>
                            <span>{variant.name}</span>
                            {selected && <span className="fv-badge fv-badge-active">Active</span>}
                            <small>{variant.frame_count ?? '—'} frames</small>
                          </td>
                          <td data-label="FPS">{getVariantFps(variant) ?? '—'}</td>
                          <td data-label="Res" title={hasSize ? `${metadata.width} × ${metadata.height}` : undefined}>{hasSize ? formatResolution(metadata) : '—'}</td>
                          <td data-label="Q">{metadata?.quality ?? '—'}</td>
                          <td data-label="Type"><span className={`fv-badge fv-kind-${variant.kind}`}>{variant.kind}</span></td>
                          <td data-label="Status"><span className={`fv-status fv-status-${String(status).toLowerCase()}`}>{status}</span></td>
                          <td className="fv-row-actions">
                            <button type="button" className="fv-use" disabled={!profile || manager.busy || selected} aria-pressed={selected}
                              title={profile ? undefined : 'Available after generation completes with valid frame and FPS metadata.'}
                              onClick={() => {
                                selectVariant(group.source, profile);
                                setNotice(`${variant.name} will be used for ${group.source}.`);
                              }}>{selected ? 'In use' : 'Use'}</button>
                            {canDeleteVariant(variant) && <button className="fv-delete" type="button" disabled={manager.busy || manager.activeJob}
                              aria-label={`Delete ${variant.name}`} title="Delete variant" onClick={() => {
                                if (window.confirm(`Delete "${variant.name}" from the CDN? This cannot be undone.${selected ? ' This animation will return to its default profile.' : ''}`)) {
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
