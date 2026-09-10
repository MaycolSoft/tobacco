import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getSeo, siteIdentity } from '@/config/seoConfig';

function setMeta(key, content, property = false) {
  const attribute = property ? 'property' : 'name';
  let element = document.head.querySelector(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = content;
}

export default function Seo() {
  const { pathname } = useLocation();
  useEffect(() => {
    const seo = getSeo(pathname, import.meta.env.VITE_SITE_URL || '');
    document.title = seo.title;
    document.documentElement.lang = seo.language;
    setMeta('description', seo.description);
    setMeta('robots', seo.robots);
    setMeta('og:title', seo.title, true);
    setMeta('og:description', seo.description, true);
    setMeta('og:type', 'website', true);
    setMeta('og:site_name', siteIdentity.name, true);
    setMeta('og:locale', seo.language === 'es' ? 'es_DO' : 'en_US', true);
    setMeta('og:image', seo.image, true);
    setMeta('og:image:alt', siteIdentity.imageAlt, true);
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', seo.title);
    setMeta('twitter:description', seo.description);
    setMeta('twitter:image', seo.image);
    setMeta('twitter:image:alt', siteIdentity.imageAlt);
    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (seo.url) {
      if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical); }
      canonical.href = seo.url;
      setMeta('og:url', seo.url, true);
    } else {
      canonical?.remove();
      document.head.querySelector('meta[property="og:url"]')?.remove();
    }
    let structuredData = document.getElementById('site-structured-data');
    if (!structuredData) { structuredData = document.createElement('script'); structuredData.id = 'site-structured-data'; structuredData.type = 'application/ld+json'; document.head.appendChild(structuredData); }
    structuredData.textContent = JSON.stringify(seo.schema).replace(/</g, '\\u003c');
  }, [pathname]);
  return null;
}
