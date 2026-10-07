export function renderMessage(message, t) {
  if (!message) return '';
  if (typeof message === 'object' && message.key) {
    const translated = t(message.key, message.values || {});
    return message.detail && message.detail !== message.key ? `${translated} — ${message.detail}` : translated;
  }
  return String(message);
}

export function errorMessage(error) {
  return { key: error.code || 'controls:api.response', values: error.values || {}, detail: error.code ? error.detail : error.message };
}
