import { FRAME_VARIANTS_API_BASE } from '../config/animationPerformance.js';

function assetError(code, values = {}, detail = '') {
  const diagnostics = {
    connection: 'Could not reach the Asset Manager. Check your connection and CDN access.',
    request: `Asset Manager request failed (HTTP ${values.status}).`,
    response: 'Asset Manager returned an invalid response.',
    list: 'Asset Manager did not return a variants list.',
    job: 'Asset Manager did not return a valid job. Refresh the list before trying again.',
    delete: 'Only managed generated variants can be deleted.',
  };
  const error = new Error(detail || diagnostics[code]);
  error.code = `controls:api.${code}`;
  error.values = values;
  error.detail = detail;
  return error;
}

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${FRAME_VARIANTS_API_BASE}${path}`, {
      ...options,
      headers: options.body ? { 'Content-Type': 'application/json' } : undefined,
    });
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw assetError('connection');
  }
  const text = await response.text();
  let data;
  try { data = text ? JSON.parse(text) : null; } catch { /* Report non-JSON responses below. */ }
  if (!response.ok) {
    const detail = data?.detail ?? data?.error ?? data?.message;
    throw assetError('request', { status: response.status }, typeof detail === 'string' ? detail : detail ? JSON.stringify(detail) : '');
  }
  if (response.status !== 204 && text && !data) throw assetError('response');
  return data;
}

export async function listFrameVariants(signal) {
  const data = await request('/variants', { signal });
  if (!Array.isArray(data?.items)) throw assetError('list');
  return data.items;
}

function validateJob(job) {
  if (!job?.id || typeof job.status !== 'string') throw assetError('job');
  return job;
}

export async function createFrameVariant(body) {
  return validateJob(await request('/variants', { method: 'POST', body: JSON.stringify(body) }));
}

export async function getFrameVariantJob(id, signal) {
  return validateJob(await request(`/jobs/${encodeURIComponent(id)}`, { signal }));
}

export async function deleteFrameVariant(variant) {
  if (variant?.managed !== true || variant.kind !== 'generated') throw assetError('delete');
  await request(`/variants/${encodeURIComponent(variant.name)}`, { method: 'DELETE' });
}
