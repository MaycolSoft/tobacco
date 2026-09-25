/**
 * MEZCLAS DEL MAESTRO
 * Composiciones de referencia que se cargan como base editable en la mesa de composición.
 * Pendiente: definir las composiciones reales. La sección se oculta mientras la lista esté vacía.
 *
 * Forma esperada de cada mezcla (los ids deben existir en src/data/leaves.js):
 * {
 *   id: 'bright-mild',
 *   name: 'Bright & Mild',
 *   profile: 'Aromático · Suave',          // Perfil descrito por el maestro
 *   intensity: 2,                          // 1 a 5
 *   description: 'Descripción breve.',
 *   leaves: { TRIPA: ['tripa-olor-seco', 'tripa-seco-cubano'], CAPOTE: 'capote-criollo-98', CAPA: 'capa-habana' },
 * }
 */
export const masterBlends = [];
