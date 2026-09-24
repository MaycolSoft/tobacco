// Base inherits the CSS defaults; named profiles override only supported colors.
const profile = (id, label, description, keywords, fontPairingId, colors) => ({
  id, label, description, keywords, fontPairingId,
  tokens: Object.fromEntries([
    '--ls-gold', '--ls-bg', '--ls-bg-card', '--ls-bg-surface',
    '--ls-text-primary', '--ls-text-secondary', '--ls-text-dim',
    '--ls-btn-primary', '--ls-btn-secondary', '--ls-btn-ghost', '--ls-video-bg',
  ].map((key, index) => [key, colors[index]])),
});

export const visualProfiles = {
  base: {
    id: 'base', label: 'Base / Original', description: 'The original Tabacalera palette.',
    keywords: ['Original', 'Editorial', 'Warm'], tokens: {}, fontPairingId: 'legacy',
  },
  heritage: profile('heritage', 'Heritage Luxury', 'A refined historic tobacco house.',
    ['Tradition', 'Craftsmanship', 'Warmth', 'Legacy', 'Premium'], 'havana',
    ['#B78D58', '#120E0B', '#1C1510', '#261D16', '#F1E5D5', '#C1AD98', '#A38B78', '#B78D58', '#C09A69', '#A9845B', '#C9B49A']),
  modernLuxury: profile('modernLuxury', 'Modern Luxury', 'Contemporary international luxury.',
    ['Contemporary', 'Exclusive', 'Sophisticated', 'Precise', 'International'], 'reserve',
    ['#D2B36B', '#0D0D0D', '#181818', '#222222', '#F3EFE7', '#B9B7B2', '#96938C', '#D2B36B', '#D2B36B', '#D2B36B', '#D6C8B9']),
  executive: profile('executive', 'Executive', 'Graphite, stone and quiet authority.',
    ['Corporate', 'Sober', 'Authoritative', 'Refined', 'High-end'], 'legacy',
    ['#A79576', '#111214', '#191B1D', '#222428', '#EEEDE8', '#B8B8B5', '#949591', '#D8D6CF', '#A79576', '#A79576', '#C9C6BF']),
  quietLuxury: profile('quietLuxury', 'Quiet Luxury', 'Refinement without display.',
    ['Discreet', 'Refined', 'Minimal', 'Understated', 'Expensive'], 'reserve',
    ['#A59B86', '#141413', '#1D1D1B', '#252523', '#EAE7DF', '#ACA89E', '#99958C', '#D7D2C7', '#928A7A', '#A59B86', '#D7D0C4']),
  editorialNoir: profile('editorialNoir', 'Editorial Noir', 'Photography-led editorial contrast.',
    ['Editorial', 'Artistic', 'Photographic', 'Dramatic', 'Sophisticated'], 'havana',
    ['#BEBBB5', '#0B0B0B', '#131313', '#1A1A1A', '#F5F3ED', '#BEBDB9', '#93918C', '#F2F0EA', '#BEBBB5', '#BDBBB7', '#D1C7B9']),
};
