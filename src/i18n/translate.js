import { resources } from './resources.js';
import { defaultLanguage } from './config.js';

// Metadata in the browser and in the Node build reads the exact same catalogs.
export const translate = (language, id) => {
  const [namespace, key] = id.split(':');
  return resources[language]?.[namespace]?.[key] ?? resources[defaultLanguage]?.[namespace]?.[key] ?? id;
};
