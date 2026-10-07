import { renderMessage } from '@/i18n/messages';
import { useTranslation, Trans } from 'react-i18next';
import React, { useState } from 'react';
import { useAuthStore } from '@store/authStore';
import { useNavigate, useLocation, Link } from '@/i18n/navigation';
import { ArrowLeft, ArrowRight, LockKeyhole } from 'lucide-react';

// Recorrido que abre el acceso: composición, resultado y elaboración.

export default function Login() {
  const { t } = useTranslation();
const journey = [t('pages:login.blendingTable'), t('pages:login.fillerBinderWrapper'), t('pages:login.yourCigar'), t('pages:login.watchItTakeShape')];

  const [credentials, setCredentials] = useState({ user: 'admin', pass: '1234' });
  const [error, setError] = useState('');
  const login = useAuthStore(state => state.login);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from;
  const destination = from ? `${from.pathname}${from.search || ''}${from.hash || ''}` : '/craft-your-cigar';

  const handleLogin = event => {
    event.preventDefault();
    if (login(credentials.user, credentials.pass)) navigate(destination, { replace: true });
    else setError({ key: 'pages:login.weCouldNotOpenTheExperienceWith' });
  };

  return (
    <div className="site-login">
      <div className="site-login__visual">
        <img src="/assets/full/CAPA HABANA.png" alt={t('pages:login.tobaccoLeafSelectedForAComposition')} />
        <div className="site-login__visual-copy">
          <span className="site-kicker">{t('pages:login.createMyCigarPrivateExperience')}</span>
          <h1><Trans ns="pages" i18nKey="login.hero" components={{ line: <br />, emphasis: <em /> }} /></h1>
          <p>{t('pages:login.composeYourBlendLeafByLeafAnd')}</p>
          <ol className="site-login__journey">{journey.map((step, index) => <li key={step}><span>0{index + 1}</span>{step}</li>)}</ol>
        </div>
      </div>
      <div className="site-login__panel">
        <Link className="site-login__back" to="/"><ArrowLeft size={16} /> {t('pages:login.backToTheJourney')}</Link>
        <form onSubmit={handleLogin} aria-describedby="login-intro">
          <div className="site-login__mark"><LockKeyhole size={22} strokeWidth={1.4} aria-hidden="true" /></div>
          <span className="site-kicker">{t('pages:login.privateAccess')}</span>
          <h2>{t('pages:login.accessYourExperience')}</h2>
          <p id="login-intro">{t('pages:login.theBlendingTableIsReservedSignIn')}</p>
          <label>{t('pages:login.username')}<input type="text" autoComplete="username" value={credentials.user} onChange={event => setCredentials({ ...credentials, user: event.target.value })} required /></label>
          <label>{t('pages:login.password')}<input type="password" autoComplete="current-password" value={credentials.pass} onChange={event => setCredentials({ ...credentials, pass: event.target.value })} required /></label>
          {error && <span className="site-form-error" role="alert">{renderMessage(error, t)}</span>}
          <button type="submit" className="site-button site-button--primary">{t('pages:login.enterTheBlendingTable')} <ArrowRight size={17} /></button>
          <p className="site-login__help">{t('pages:login.donTHaveAccessYet')} <Link to="/reservation">{t('pages:login.requestAGuidedPresentation')}</Link></p>
        </form>
      </div>
    </div>
  );
}
