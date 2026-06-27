// frameCache.js

const DB_NAME = "scroll-video-cache";
const DB_VERSION = 1;
const STORE_NAME = "frames";

export const FRAME_TTL_MS = 14 * 24 * 60 * 60 * 1000; // 14 días

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, {
          keyPath: "key",
        });

        store.createIndex("expiresAt", "expiresAt");
        store.createIndex("videoName", "videoName");
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function getFromStore(db, key) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(key);

    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

function putInStore(db, value) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const request = store.put(value);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

function deleteFromStore(db, key) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const request = store.delete(key);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function getCachedFrame(key) {
  const db = await openDB();
  const record = await getFromStore(db, key);

  if (!record) return null;

  const now = Date.now();

  if (record.expiresAt && record.expiresAt < now) {
    await deleteFromStore(db, key);
    return null;
  }

  return record.blob;
}

export async function saveCachedFrame({
  key,
  blob,
  videoName,
  frame,
  ttlMs = FRAME_TTL_MS,
}) {
  const db = await openDB();

  const now = Date.now();

  await putInStore(db, {
    key,
    blob,
    videoName,
    frame,
    size: blob.size,
    createdAt: now,
    lastAccessedAt: now,
    expiresAt: now + ttlMs,
  });
}

export async function getOrDownloadFrame({
  key,
  url,
  videoName,
  frame,
  ttlMs = FRAME_TTL_MS,
}) {
  const cachedBlob = await getCachedFrame(key);

  if (cachedBlob) {
    return {
      blob: cachedBlob,
      fromCache: true,
    };
  }

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`No se pudo descargar el frame ${frame}`);
  }

  const blob = await response.blob();

  await saveCachedFrame({
    key,
    blob,
    videoName,
    frame,
    ttlMs,
  });

  return {
    blob,
    fromCache: false,
  };
}

export function blobToImage(blob) {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(blob);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(img);
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("No se pudo convertir el Blob en imagen"));
    };

    img.src = objectUrl;
  });
}


