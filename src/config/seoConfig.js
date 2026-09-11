import { leaves } from '../data/leaves.js';

export const siteIdentity = {
  url: 'https://tabacaleratamboril.com.do',
  name: 'Tabacalera Tamboril',
  image: '/img/carousel-1.jpg',
  imageAlt: 'Tabacalera Tamboril — colección de cigarros',
};

// Only confirmed editorial pages belong in the sitemap. Template pages remain available.
export const seoRoutes = {
  '/': { title: 'Tabacalera Tamboril | Del cultivo al cigarro', description: 'Explora las hojas de tabaco, comprende la composición de una mezcla y descubre visualmente el oficio detrás de cada cigarro.', label: 'Inicio', language: 'es', index: true },
  '/leaf-library': { title: 'Biblioteca de hojas de tabaco | Tabacalera Tamboril', description: 'Explora nuestra colección de hojas de tabaco. Descubre sus orígenes, el carácter de cada variedad y la función de capa, capote y tripa en un recorrido visual.', label: 'Biblioteca de hojas', language: 'es', index: true },
  '/about': { title: 'El oficio | Tabacalera Tamboril', description: 'Conoce el enfoque artesanal y la cultura de la hoja que orientan la experiencia de Tabacalera Tamboril.', label: 'El oficio', language: 'es', index: true },
  '/service': { title: 'El proceso del cigarro | Tabacalera Tamboril', description: 'Descubre las etapas que conectan la selección de hojas, la composición de la mezcla y la formación del cigarro.', label: 'El proceso', language: 'es', index: true },
  '/menu': { title: 'Perfiles de mezcla | Tabacalera Tamboril', description: 'Comprende cómo el cuerpo, el equilibrio y la intensidad orientan diferentes perfiles de mezcla de tabaco.', label: 'Perfiles de mezcla', language: 'es', index: true },
  '/contact': { title: 'Contacto | Tabacalera Tamboril', description: 'Contacta a Tabacalera Tamboril para conocer la colección de hojas o preparar una presentación guiada.', label: 'Contacto', language: 'es', index: true },
  '/reservation': { title: 'Presentación guiada | Tabacalera Tamboril', description: 'Prepara una experiencia guiada alrededor de las hojas, la mezcla y el proceso de elaboración del cigarro.', label: 'Presentación guiada', language: 'es', index: false },
  '/testimonial': { title: 'Experiencia sensorial | Tabacalera Tamboril', description: 'Aprende a observar la apariencia, el tacto, el aroma y la evolución del tabaco.', label: 'Experiencia sensorial', language: 'es', index: true },
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
