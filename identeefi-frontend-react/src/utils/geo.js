import { GOOGLE_MAPS_KEY } from '../config';

// Gets the device position. Rejects with a readable message.
export const getPosition = () =>
  new Promise((resolve, reject) => {
    if (!navigator.geolocation) return reject(new Error('This browser cannot share location.'));
    navigator.geolocation.getCurrentPosition(
      (p) => resolve({ lat: p.coords.latitude, lng: p.coords.longitude }),
      (e) => reject(new Error(e.code === 1 ? 'Location permission is blocked. Allow it in the browser address bar, or type the location.' : 'Could not read your position. Type the location instead.')),
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 60000 }
    );
  });

const viaGoogle = async (lat, lng) => {
  if (!GOOGLE_MAPS_KEY) throw new Error('no key');
  const r = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_KEY}`);
  const j = await r.json();
  if (j.status !== 'OK' || !j.results?.[0]) throw new Error(j.error_message || j.status);
  return j.results[0].formatted_address;
};

// Free fallback (OpenStreetMap) so a Google key problem does not block the form.
const viaOpenStreetMap = async (lat, lng) => {
  const r = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&zoom=16&lat=${lat}&lon=${lng}`, { headers: { Accept: 'application/json' } });
  if (!r.ok) throw new Error('osm failed');
  const j = await r.json();
  if (!j.display_name) throw new Error('osm empty');
  return j.display_name;
};

// Returns { address, source } where source is 'google', 'osm' or 'coordinates'. Never throws.
export const reverseGeocode = async (lat, lng) => {
  try { return { address: await viaGoogle(lat, lng), source: 'google' }; } catch (e) { console.warn('Google geocoding failed:', e.message); }
  try { return { address: await viaOpenStreetMap(lat, lng), source: 'osm' }; } catch (e) { console.warn('OpenStreetMap geocoding failed:', e.message); }
  return { address: `${Number(lat).toFixed(5)}; ${Number(lng).toFixed(5)}`, source: 'coordinates' };
};
