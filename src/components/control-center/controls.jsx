import { RotateCcw } from 'lucide-react';

export function Section({ title, icon: Icon, action, className = '', children }) {
  return (
    <section className={`cc-section ${className}`}>
      <header className="cc-section-heading">
        {Icon && <Icon size={13} aria-hidden="true" />}
        <h3>{title}</h3>
        {action}
      </header>
      {children}
    </section>
  );
}

export function ToggleRow({ icon: Icon, label, checked, disabled, onToggle }) {
  return (
    <button type="button" role="switch" aria-checked={checked} className="cc-toggle" disabled={disabled} onClick={onToggle}>
      {Icon && <Icon size={15} aria-hidden="true" />}
      <span className={checked ? '' : 'cc-muted'}>{label}</span>
      <span className="cc-switch" aria-hidden="true" />
    </button>
  );
}

export function ColorRow({ label, value, onChange }) {
  return (
    <label className="cc-color-row">
      <span className="cc-color-label">{label}</span>
      <code>{value}</code>
      <input type="color" aria-label={label} title={value} value={value} onChange={event => onChange(event.target.value)} />
    </label>
  );
}

export function ChoiceCard({ active, onClick, name, desc, nameStyle }) {
  return (
    <button type="button" className={`cc-choice${active ? ' is-active' : ''}`} aria-pressed={active} onClick={onClick}>
      <span className="cc-choice-name" style={nameStyle}>{name}</span>
      <span className="cc-choice-desc">{desc}</span>
    </button>
  );
}

export function ResetButton({ onClick, label }) {
  return (
    <button type="button" className="cc-icon-btn" onClick={onClick} title={label} aria-label={label}>
      <RotateCcw size={12} />
    </button>
  );
}
