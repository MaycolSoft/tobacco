import { useTranslation } from 'react-i18next';
import { Flame, Wind, Sun, ThermometerSun } from 'lucide-react';


export default function TobaccoFamiliesInfo() {
  const { t } = useTranslation();
const families = [
  { name: 'Kentucky', Icon: Flame, curing: t('guide:tobaccoFamiliesInfo.fireCured'), color: t('guide:tobaccoFamiliesInfo.darkBrown'), profile: t('guide:tobaccoFamiliesInfo.smokyAndRobust') },
  { name: 'Burley', Icon: Wind, curing: t('guide:tobaccoFamiliesInfo.airCured'), color: t('guide:tobaccoFamiliesInfo.brown'), profile: t('guide:tobaccoFamiliesInfo.nutAndCocoaNotes') },
  { name: 'Virginia', Icon: ThermometerSun, curing: t('guide:tobaccoFamiliesInfo.flueCured'), color: t('guide:tobaccoFamiliesInfo.yellowToGolden'), profile: t('guide:tobaccoFamiliesInfo.naturalSweetness') },
  { name: 'Oriental', Icon: Sun, curing: t('guide:tobaccoFamiliesInfo.sunCured'), color: t('guide:tobaccoFamiliesInfo.greenishYellow'), profile: t('guide:tobaccoFamiliesInfo.aromatic') },
];

  return (
    <div className="tg-families">
      <p className="tg-section-copy">{t('guide:tobaccoFamiliesInfo.varietyAndCuringHelpExplainTheDifferences')}</p>
      <div className="tg-family-grid">
        {families.map(({ name, Icon, curing, color, profile }) => (
          <article className="tg-family-card" key={name}>
            <Icon size={23} strokeWidth={1.5} aria-hidden="true" /><h3>{name}</h3>
            <dl><div><dt>{t('guide:tobaccoFamiliesInfo.curing')}</dt><dd>{curing}</dd></div><div><dt>{t('guide:tobaccoFamiliesInfo.indicativeColor')}</dt><dd>{color}</dd></div><div><dt>{t('guide:tobaccoFamiliesInfo.indicativeProfile')}</dt><dd>{profile}</dd></div></dl>
          </article>
        ))}
      </div>
      <p className="tg-context-note">{t('guide:tobaccoFamiliesInfo.originCultivationAndProcessingCanChangeA')}</p>
    </div>
  );
}
