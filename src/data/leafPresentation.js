export const leafCategories = {
  ALL: { label: 'Todas', title: 'Cada hoja tiene una historia.', description: 'Explora nuestra colección y descubre el papel de cada hoja en la composición de un cigarro.' },
  CAPA: { label: 'Capa', title: 'La primera impresión.', description: 'La hoja exterior envuelve el cigarro y aporta su apariencia, textura y parte de su carácter.', role: 'Envuelve el cigarro', position: 'Exterior', detail: 'Es la superficie visible del cigarro. Su selección une presentación y carácter en una misma hoja.' },
  CAPOTE: { label: 'Capote', title: 'La estructura que lo une.', description: 'Abraza la tripa y mantiene unido el conjunto bajo la capa exterior.', role: 'Sostiene el conjunto', position: 'Intermedia', detail: 'Rodea la tripa y ayuda a mantener la forma del cigarro. Trabaja junto a las demás hojas para dar estructura al conjunto.' },
  TRIPA: { label: 'Tripa', title: 'El corazón de la mezcla.', description: 'En el interior, las hojas se combinan para construir el cuerpo, el aroma y el sabor de la liga.', role: 'Construye la mezcla', position: 'Interior', detail: 'Forma el interior del cigarro. Su aportación se combina con otras hojas para construir el carácter de cada liga.' },
};
export const getLeafOrigin = (leaf) => ({
  'Dominican Republic': 'República Dominicana', USA: 'Estados Unidos', Various: 'Varios orígenes', Hybrid: 'Híbrido',
}[leaf.origin] || leaf.origin);

// Use existing inventory descriptions, without simulated measurements.
export const getLeafChapters = (leaf) => {
  const category = leafCategories[leaf.category];
  return [
    { label: 'Identidad', title: leaf.name, text: `Una hoja de nuestra colección de ${category.label.toLowerCase()}. Explora su forma, su carácter y el lugar que ocupa dentro del cigarro.`, detail: getLeafOrigin(leaf), x: 50, y: 25 },
    { label: 'Forma', title: 'Los detalles de la hoja.', text: 'Observa su silueta, la nervadura central y las variaciones de textura. Una mirada cercana a la materia prima de la mezcla.', detail: 'Silueta · Nervadura · Textura', x: 48, y: 44 },
    { label: 'Carácter', title: 'Su propia expresión.', text: leaf.description, detail: 'Perfil de la colección', x: 60, y: 61 },
    { label: 'En el cigarro', title: category.role, text: category.detail, detail: `${category.label} · ${category.position}`, x: 47, y: 79 },
  ];
};

// Datos pendientes del inventario. Cuando existan en leaves.js se muestran sin cambiar la interfaz:
// profile: { fortaleza, aroma, cuerpo } en escala 1–5, family, contributes: [], pairsWith: [ids].
export const PROFILE_AXES = [
  { key: 'fortaleza', label: 'Fortaleza' },
  { key: 'aroma', label: 'Aroma' },
  { key: 'cuerpo', label: 'Cuerpo' },
];
export const getLeafProfile = leaf => leaf?.profile || null;

// Promedio de la composición; null mientras alguna hoja no tenga perfil.
export const getBlendProfile = blendLeaves => {
  if (!blendLeaves.length || blendLeaves.some(leaf => !getLeafProfile(leaf))) return null;
  return Object.fromEntries(PROFILE_AXES.map(({ key }) => [key, Math.round(blendLeaves.reduce((sum, leaf) => sum + leaf.profile[key], 0) / blendLeaves.length)]));
};
