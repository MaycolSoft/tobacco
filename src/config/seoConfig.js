import { leaves } from '../data/leaves.js';

export const siteIdentity = {
  url: 'https://tabacaleratamboril.com.do',
  name: 'Tabacalera Tamboril',
  image: '/img/carousel-1.jpg',
  imageAlt: 'Tabacalera Tamboril — colección de cigarros',
};

// Only confirmed editorial pages belong in the sitemap. Template pages remain available.
export const seoRoutes = {
  '/': { title: 'Tabacalera Tamboril | The Art of Tobacco', description: 'Discover Tabacalera Tamboril: explore tobacco leaves, cigar blends and the craft behind each cigar through a visual, interactive experience.', label: 'Home', language: 'en', index: true },
  '/leaf-library': { title: 'Biblioteca de hojas de tabaco | Tabacalera Tamboril', description: 'Explora nuestra colección de hojas de tabaco. Descubre sus orígenes, el carácter de cada variedad y la función de capa, capote y tripa en un recorrido visual.', label: 'Biblioteca de hojas', language: 'es', index: true },
  '/about': { title: 'Our Story | Tabacalera Tamboril', description: 'Discover the presentation of Tabacalera Tamboril and its approach to the world of tobacco and cigars.', label: 'Our story', language: 'en', index: false },
  '/service': { title: 'Our Cigars | Tabacalera Tamboril', description: 'Explore the cigar collection and discover the leaves and blends presented by Tabacalera Tamboril.', label: 'Our cigars', language: 'en', index: false },
  '/menu': { title: 'Tobacco Blends | Tabacalera Tamboril', description: 'Explore tobacco blends and the different expressions of the Tabacalera Tamboril collection.', label: 'Blends', language: 'en', index: false },
  '/contact': { title: 'Contact | Tabacalera Tamboril', description: 'Contact page for Tabacalera Tamboril.', label: 'Contact', language: 'en', index: false },
  '/reservation': { title: 'Reservations | Tabacalera Tamboril', description: 'Reservation presentation for Tabacalera Tamboril.', label: 'Reservations', language: 'en', index: false },
  '/testimonial': { title: 'Testimonials | Tabacalera Tamboril', description: 'Testimonials presentation for Tabacalera Tamboril.', label: 'Testimonials', language: 'en', index: false },
  '/login': { title: 'Acceso | Tabacalera Tamboril', description: 'Accede a la experiencia de creación de cigarros de Tabacalera Tamboril.', label: 'Acceso', language: 'es', index: false },
  '/craft-your-cigar': { title: 'Crea tu cigarro | Tabacalera Tamboril', description: 'Explora las hojas, combina capa, capote y tripa y descubre visualmente la formación de un cigarro.', label: 'Crea tu cigarro', language: 'es', index: false },
};

export function normalizeSiteUrl(value = '') {
  if (!value.trim()) return '';
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol) ? url.origin : '';
  } catch { return ''; }
}

export function getSeo(pathname, publicUrl = '') {
  const path = pathname === '/' ? '/' : pathname.replace(/\/+$/, '');
  const page = seoRoutes[path] || { title: 'Página no encontrada | Tabacalera Tamboril', description: 'Vuelve a la biblioteca de hojas de Tabacalera Tamboril para seguir explorando.', label: 'Página no encontrada', language: 'es', index: false };
  const origin = normalizeSiteUrl(publicUrl || siteIdentity.url);
  const url = origin ? `${origin}${path}` : '';
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Organization', '@id': origin ? `${origin}/#organization` : '#organization', name: siteIdentity.name, ...(origin ? { url: `${origin}/`, logo: `${origin}/img/logo.png` } : {}) },
      { '@type': 'WebSite', '@id': origin ? `${origin}/#website` : '#website', name: siteIdentity.name, ...(origin ? { url: `${origin}/` } : {}), inLanguage: ['en', 'es'], publisher: { '@id': origin ? `${origin}/#organization` : '#organization' } },
      { '@type': path === '/leaf-library' ? 'CollectionPage' : 'WebPage', name: page.title, description: page.description, inLanguage: page.language, ...(url ? { '@id': `${url}#webpage`, url, isPartOf: { '@id': `${origin}/#website` } } : {}),
        ...(path === '/leaf-library' ? { mainEntity: {
          '@type': 'ItemList', name: 'Biblioteca de hojas de tabaco', numberOfItems: leaves.length,
          itemListElement: leaves.map((leaf, index) => ({ '@type': 'ListItem', position: index + 1, item: {
            '@type': 'Thing', name: `${leaf.category} · ${leaf.name}`, description: leaf.description,
            ...(origin ? { url: `${url}#${leaf.id}`, image: new URL(leaf.thumbImg, origin).href } : {}),
          } })),
        } } : {}),
      },
      ...(origin && seoRoutes[path] && path !== '/' ? [{ '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Tabacalera Tamboril', item: `${origin}/` },
        { '@type': 'ListItem', position: 2, name: page.label, item: url },
      ] }] : []),
    ],
  };
  return { ...page, path, url, schema, image: `${origin}${siteIdentity.image}`, robots: page.index ? 'index, follow, max-image-preview:large' : 'noindex, follow' };
}
