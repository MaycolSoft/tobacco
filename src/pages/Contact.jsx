import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Link } from '@/i18n/navigation';
import { ArrowRight, ArrowUpRight, CalendarDays, Globe2, MapPin, MessageCircle } from 'lucide-react';

export default function Contact() {
  const { t } = useTranslation();
  const [sent, setSent] = useState(false);
  const handleSubmit = event => { event.preventDefault(); setSent(true); };

  return (
    <div className="site-page">
      <section className="site-section site-shell site-contact">
        <div className="site-contact__intro">
          <span className="site-kicker">{t('pages:contact.letSTalk')}</span>
          <h2>{t('pages:contact.aPresentationCanBeginWithAQuestion')}</h2>
          <p className="site-lead">{t('pages:contact.ifYouWantToLearnMoreAbout')}</p>
          <div className="site-contact__details">
            <div><MapPin size={20} aria-hidden="true" /><span><small>{t('pages:contact.origin')}</small>{t('pages:contact.tamborilDominicanRepublic')}</span></div>
            <div><Globe2 size={20} aria-hidden="true" /><span><small>{t('pages:contact.website')}</small><a href="https://tabacaleratamboril.com.do">TabacaleraTamboril.com.do <ArrowUpRight size={13} /></a></span></div>
          </div>
          {/* La presentación guiada tiene su propio formulario: no se duplica aquí. */}
          <aside className="site-contact__redirect">
            <CalendarDays size={20} aria-hidden="true" />
            <div><strong>{t('pages:contact.wouldYouLikeToArrangeAGuided')}</strong><p>{t('pages:contact.itHasItsOwnFormForDate')}</p></div>
            <Link className="site-text-link" to="/reservation">{t('pages:contact.requestAPresentation')} <ArrowRight size={15} /></Link>
          </aside>
        </div>
        <form className="site-form" onSubmit={handleSubmit}>
          <div className="site-form__heading"><MessageCircle size={25} strokeWidth={1.3} aria-hidden="true" /><div><span className="site-kicker">{t('pages:contact.yourMessage')}</span><h3>{t('pages:contact.letSContinueTheConversation')}</h3></div></div>
          <label>{t('pages:contact.name')}<input type="text" name="name" placeholder={t('pages:contact.yourName')} autoComplete="name" required /></label>
          <label>{t('pages:contact.email')}<input type="email" name="email" placeholder={t('pages:contact.nameExampleCom')} autoComplete="email" required /></label>
          <label>{t('pages:contact.subject')}<select name="subject" defaultValue="general"><option value="general">{t('pages:contact.generalInquiry')}</option><option value="information">{t('pages:contact.information')}</option><option value="other">{t('pages:contact.other')}</option></select></label>
          <label>{t('pages:contact.message')}<textarea name="message" rows="5" placeholder={t('pages:contact.tellUsWhatYouWouldLikeTo')} required /></label>
          <button type="submit" className="site-button site-button--primary">{t('pages:contact.sendMessage')} <ArrowRight size={17} /></button>
          {sent && <p className="site-form-status" role="status">{t('pages:contact.yourMessageIsCompleteThisVersionDoes')}</p>}
        </form>
      </section>
    </div>
  );
}
