/**
 * Client-side SEO and Schema.org Structured Data Manager for Biorals
 */

export function updatePageSEO(options: {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogType?: 'website' | 'article' | 'product';
  jsonLd?: Record<string, any>;
}) {
  const fullTitle = `${options.title} | Biorals`;
  document.title = fullTitle;

  // Meta description
  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement('meta');
    metaDesc.setAttribute('name', 'description');
    document.head.appendChild(metaDesc);
  }
  metaDesc.setAttribute('content', options.description);

  // OG Title
  let ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', fullTitle);

  // OG Description
  let ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.setAttribute('content', options.description);

  // OG Type
  let ogType = document.querySelector('meta[property="og:type"]');
  if (ogType) ogType.setAttribute('content', options.ogType || 'website');

  // JSON-LD Structured Data
  let jsonLdScript = document.getElementById('biorals-dynamic-jsonld') as HTMLScriptElement | null;
  if (options.jsonLd) {
    if (!jsonLdScript) {
      jsonLdScript = document.createElement('script');
      jsonLdScript.id = 'biorals-dynamic-jsonld';
      jsonLdScript.type = 'application/ld+json';
      document.head.appendChild(jsonLdScript);
    }
    jsonLdScript.textContent = JSON.stringify(options.jsonLd);
  } else if (jsonLdScript) {
    jsonLdScript.remove();
  }
}
