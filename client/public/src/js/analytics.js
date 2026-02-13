// Simple client-side traffic tracking using localStorage
// Note: data ini hanya tersimpan per-device (bukan global server-side)

const TRAFFIC_STORAGE_KEY = 'arutalaPersonaTraffic';

function getInitialTrafficState() {
  return {
    pageViews: {},      // { '/index.html': number, '/chatbot.html': number, ... }
    personaOpens: {},   // { '1': number, '2': number, ... }
    chatMessages: 0,
    // Lokasi (berdasarkan IP) untuk browser ini
    location: null,     // { country, countryCode, region, city, latitude, longitude }
    locationCounts: {}, // { 'ID | Jawa Barat | Bandung': number, ... }
    locationUpdatedAt: null,
    firstSeenAt: null,
    lastUpdatedAt: null,
  };
}

function readTraffic() {
  if (typeof window === 'undefined' || !window.localStorage) {
    return getInitialTrafficState();
  }

  try {
    const raw = window.localStorage.getItem(TRAFFIC_STORAGE_KEY);
    if (!raw) return getInitialTrafficState();
    const parsed = JSON.parse(raw);
    return { ...getInitialTrafficState(), ...parsed };
  } catch {
    return getInitialTrafficState();
  }
}

function writeTraffic(data) {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    window.localStorage.setItem(TRAFFIC_STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore quota / JSON errors
  }
}

// Global helper untuk tracking event
function trackEvent(type, payload) {
  const data = readTraffic();
  const nowIso = new Date().toISOString();
  if (!data.firstSeenAt) data.firstSeenAt = nowIso;
  data.lastUpdatedAt = nowIso;

  switch (type) {
    case 'page_view': {
      const path = payload || window.location.pathname || 'unknown';
      data.pageViews[path] = (data.pageViews[path] || 0) + 1;
      break;
    }
    case 'persona_open': {
      const id = String(payload || '');
      if (!id) break;
      data.personaOpens[id] = (data.personaOpens[id] || 0) + 1;
      break;
    }
    case 'chat_message': {
      data.chatMessages = (data.chatMessages || 0) + 1;
      break;
    }
    default:
      break;
  }

  writeTraffic(data);

  // Kirim juga ke server (Supabase) via endpoint /api/track
  if (typeof fetch === 'function') {
    try {
      const body = { type };

      if (type === 'page_view') {
        body.path = payload || (typeof window !== 'undefined' ? window.location.pathname : null);
      } else if (type === 'persona_open') {
        body.personaId = payload || null;
        body.path = typeof window !== 'undefined' ? window.location.pathname : null;
      } else if (type === 'chat_message') {
        body.path = typeof window !== 'undefined' ? window.location.pathname : null;
      }

      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }).catch(() => {
        // diamkan error network
      });
    } catch {
      // abaikan error serialisasi
    }
  }
}

// Ambil & simpan geo-location (berbasis IP) secara ringan
// Menggunakan layanan publik ipapi.co (tanpa API key, cukup untuk demo kecil).
async function fetchAndStoreLocation() {
  if (typeof window === 'undefined' || !window.fetch) return;

  const data = readTraffic();

  // Hindari terlalu sering memanggil API: maksimal 1x per 24 jam per browser
  const ONE_DAY = 24 * 60 * 60 * 1000;
  if (data.locationUpdatedAt) {
    const last = new Date(data.locationUpdatedAt).getTime();
    if (!Number.isNaN(last) && Date.now() - last < ONE_DAY) {
      return;
    }
  }

  try {
    const res = await fetch('https://ipapi.co/json/');
    if (!res.ok) return;
    const json = await res.json();

    const loc = {
      country: json.country_name || null,
      countryCode: json.country || null,
      region: json.region || json.region_code || null,
      city: json.city || null,
      latitude: json.latitude || null,
      longitude: json.longitude || null,
    };

    const key = [
      loc.countryCode || loc.country || 'Unknown',
      loc.region || '',
      loc.city || '',
    ].filter(Boolean).join(' | ') || 'Unknown';

    data.location = loc;
    data.locationCounts = data.locationCounts || {};
    data.locationCounts[key] = (data.locationCounts[key] || 0) + 1;
    data.locationUpdatedAt = new Date().toISOString();

    writeTraffic(data);
  } catch {
    // diamkan saja kalau API gagal
  }
}

// Helper untuk dashboard
function getTrafficData() {
  return readTraffic();
}

// Ekspos ke window
if (typeof window !== 'undefined') {
  window.trackEvent = trackEvent;
  window.getTrafficData = getTrafficData;
  window.fetchAndStoreLocation = fetchAndStoreLocation;

  // Jalankan pengambilan lokasi secara pasif
  // (tidak mengganggu kalau gagal).
  fetchAndStoreLocation();
}

