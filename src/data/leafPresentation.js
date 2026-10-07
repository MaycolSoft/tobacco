export const getLeafCategories = t => ({
  ALL: { label: t('leaves:categories.ALL.label'), title: t('leaves:categories.ALL.title'), description: t('leaves:categories.ALL.description') },
  CAPA: { label: t('leaves:categories.CAPA.label'), title: t('leaves:categories.CAPA.title'), description: t('leaves:categories.CAPA.description'), role: t('leaves:categories.CAPA.role'), position: t('leaves:categories.CAPA.position'), detail: t('leaves:categories.CAPA.detail') },
  CAPOTE: { label: t('leaves:categories.CAPOTE.label'), title: t('leaves:categories.CAPOTE.title'), description: t('leaves:categories.CAPOTE.description'), role: t('leaves:categories.CAPOTE.role'), position: t('leaves:categories.CAPOTE.position'), detail: t('leaves:categories.CAPOTE.detail') },
  TRIPA: { label: t('leaves:categories.TRIPA.label'), title: t('leaves:categories.TRIPA.title'), description: t('leaves:categories.TRIPA.description'), role: t('leaves:categories.TRIPA.role'), position: t('leaves:categories.TRIPA.position'), detail: t('leaves:categories.TRIPA.detail') },
});
export const getLeafOrigin = (leaf, t) => t(`leaves:origins.${originIds[leaf.origin] || leaf.origin}`, { defaultValue: leaf.origin });
const originIds = {
  'Ecuador / Cuba': 'ecuadorCuba', USA: 'usa', 'Dominican Republic': 'dominicanRepublic',
  Nicaragua: 'nicaragua', Indonesia: 'indonesia', Ecuador: 'ecuador', Cuba: 'cuba', Various: 'various', Hybrid: 'hybrid',
};

// Use existing inventory descriptions, without simulated measurements.
export const getLeafChapters = (leaf, t) => {
  const category = getLeafCategories(t)[leaf.category];
  return [
    { label: t('leaves:chapters.Identidad'), title: leaf.name, text: t(`leaves:chapters.identityText.${leaf.category}`), detail: getLeafOrigin(leaf, t), x: 50, y: 25 },
    { label: t('leaves:chapters.Forma'), title: t('leaves:chapters.Los_detalles_de_la_hoja'), text: t('leaves:chapters.Observa_su_silueta_la_nervadura_central_y_las_variaciones_de'), detail: t('leaves:chapters.Silueta_Nervadura_Textura'), x: 48, y: 44 },
    { label: t('leaves:chapters.Car_cter'), title: t('leaves:chapters.Su_propia_expresi_n'), text: t(`leaves:items.${leaf.id}.description`), detail: t('leaves:chapters.Perfil_de_la_colecci_n'), x: 60, y: 61 },
    { label: t('leaves:chapters.En_el_cigarro'), title: category.role, text: category.detail, detail: `${category.label} · ${category.position}`, x: 47, y: 79 },
  ];
};

// Datos pendientes del inventario. Cuando existan en leaves.js se muestran sin cambiar la interfaz:
// profile: { fortaleza, aroma, cuerpo } en escala 1–5, family, contributes: [], pairsWith: [ids].
export const PROFILE_AXES = [
  { key: 'fortaleza', labelKey: 'leaves:axes.fortaleza' },
  { key: 'aroma', labelKey: 'leaves:axes.aroma' },
  { key: 'cuerpo', labelKey: 'leaves:axes.cuerpo' },
];
export const getLeafProfile = leaf => leaf?.profile || null;

// Promedio de la composición; null mientras alguna hoja no tenga perfil.
export const getBlendProfile = blendLeaves => {
  if (!blendLeaves.length || blendLeaves.some(leaf => !getLeafProfile(leaf))) return null;
  return Object.fromEntries(PROFILE_AXES.map(({ key }) => [key, Math.round(blendLeaves.reduce((sum, leaf) => sum + leaf.profile[key], 0) / blendLeaves.length)]));
};

export const getProfileAxes = t => PROFILE_AXES.map(axis => ({ ...axis, label: t(axis.labelKey) }));
