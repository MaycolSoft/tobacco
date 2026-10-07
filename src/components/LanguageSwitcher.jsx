import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useLocaleLocation } from '@/i18n/navigation';
import { Globe2 } from 'lucide-react';
import { languages } from '@/i18n/config';
import { localizePath, parseLocalePath } from '@/i18n/routing';
import '@/styles/language-switcher.css';

export default function LanguageSwitcher({ floating = false }) {
  const { t } = useTranslation('common');
  const location = useLocaleLocation();
  const navigate = useNavigate();
  const { language } = parseLocalePath(location.pathname);
  return (
    <label className={`language-switcher${floating ? ' language-switcher--floating' : ''}`}>
      <Globe2 size={16} aria-hidden="true" />
      <span className="sr-only">{t('language')}</span>
      <select value={language} onChange={event => {
        const next = event.target.value;
        navigate(localizePath(`${location.pathname}${location.search}${location.hash}`, next), { replace: true, state: location.state });
      }}>
        {Object.entries(languages).map(([code, { name }]) => <option key={code} value={code} lang={code}>{name}</option>)}
      </select>
    </label>
  );
}
