import { FRAME_VARIANTS_API_BASE } from '../config/animationPerformance.js';

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${FRAME_VARIANTS_API_BASE}${path}`, {
      ...options,
      headers: options.body ? { 'Content-Type': 'application/json' } : undefined,
    });
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new Error('Could not reach the Asset Manager. Check your connection and CDN access.');
  }
  const text = await response.text();
  let data;
  try { data = text ? JSON.parse(text) : null; } catch { /* Report non-JSON responses below. */ }
  if (!response.ok) {
    const detail = data?.detail ?? data?.error ?? data?.message;
    throw new Error(typeof detail === 'string' ? detail : detail ? JSON.stringify(detail) : `Asset Manager request failed (HTTP ${response.status}).`);
  }
  if (response.status !== 204 && text && !data) throw new Error('Asset Manager returned an invalid response.');
  return data;
}

export async function listFrameVariants(signal) {
  const data = await request('/variants', { signal });
  if (!Array.isArray(data?.items)) throw new Error('Asset Manager did not return a variants list.');
  return data.items;
}

function validateJob(job) {
  if (!job?.id || typeof job.status !== 'string') throw new Error('Asset Manager did not return a valid job. Refresh the list before trying again.');
  return job;
}

export async function createFrameVariant(body) {
  return validateJob(await request('/variants', { method: 'POST', body: JSON.stringify(body) }));
}

export async function getFrameVariantJob(id, signal) {
  return validateJob(await request(`/jobs/${encodeURIComponent(id)}`, { signal }));
}

export async function deleteFrameVariant(variant) {
  if (variant?.managed !== true || variant.kind !== 'generated') throw new Error('Only managed generated variants can be deleted.');
  await request(`/variants/${encodeURIComponent(variant.name)}`, { method: 'DELETE' });
}
