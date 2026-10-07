import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { ArrowRight, CalendarDays, Check, Clock3, Users } from 'lucide-react';


export default function Reservation() {
  const { t } = useTranslation();
const highlights = [t('pages:reservation.aTourOfTheLeafLibrary'), t('pages:reservation.anIntroductionToWrapperBinderAndFiller'), t('pages:reservation.aVisualDemonstrationOfCrafting')];

  const [sent, setSent] = useState(false);
  const handleSubmit = event => { event.preventDefault(); setSent(true); };

  return (
    <div className="site-page">
      <section className="site-section site-shell site-request">
        <div className="site-request__intro"><span className="site-kicker">{t('pages:reservation.guidedPresentation')}</span><h2>{t('pages:reservation.aConversationAroundTheLeaf')}</h2><p className="site-lead">{t('pages:reservation.arrangeASessionToExploreOriginComposition')}</p><ul>{highlights.map(item => <li key={item}><Check size={16} aria-hidden="true" />{item}</li>)}</ul><div className="site-request__meta"><span><Clock3 size={18} aria-hidden="true" /> {t('pages:reservation.guidedPace')}</span><span><Users size={18} aria-hidden="true" /> {t('pages:reservation.sharedExperience')}</span></div></div>
        <form className="site-form" onSubmit={handleSubmit}>
          <div className="site-form__heading"><CalendarDays size={25} strokeWidth={1.3} aria-hidden="true" /><div><span className="site-kicker">{t('pages:reservation.arrangeAnExperience')}</span><h3>{t('pages:reservation.tellUsAboutYourPresentation')}</h3></div></div>
          <label>{t('pages:reservation.name')}<input type="text" name="name" placeholder={t('pages:reservation.yourName')} autoComplete="name" required /></label>
          <label>{t('pages:reservation.email')}<input type="email" name="email" placeholder={t('pages:reservation.nameExampleCom')} autoComplete="email" required /></label>
          <div className="site-form__row"><label>{t('pages:reservation.preferredDate')}<input type="date" name="date" /></label><label>{t('pages:reservation.participants')}<select name="attendees" defaultValue=""><option value="" disabled>{t('pages:reservation.select')}</option><option value="1-5">{t('pages:reservation.15People')}</option><option value="6-12">{t('pages:reservation.612People')}</option><option value="13-plus">{t('pages:reservation.moreThan12')}</option></select></label></div>
          <label>{t('pages:reservation.presentationFocus')}<select name="focus" defaultValue="complete"><option value="complete">{t('pages:reservation.completeJourney')}</option><option value="leaves">{t('pages:reservation.leafLibrary')}</option><option value="blend">{t('pages:reservation.creatingABlend')}</option></select></label>
          <button type="submit" className="site-button site-button--primary">{t('pages:reservation.requestAPresentation')} <ArrowRight size={17} /></button>
          {sent && <p className="site-form-status" role="status">{t('pages:reservation.yourRequestIsCompleteThisVersionDoes')}</p>}
          <small>{t('pages:reservation.thisFormIsPartOfTheVisual')}</small>
        </form>
      </section>
    </div>
  );
}
