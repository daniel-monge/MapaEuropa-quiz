import worldDataRaw from 'world-atlas/countries-10m.json'
import { feature } from 'topojson-client'
import type { Topology, GeometryCollection } from 'topojson-specification'
import type { FeatureCollection, Geometry, Polygon, MultiPolygon } from 'geojson'
import { COUNTRIES } from './countries.ts'

// ── Bounding box Europa ──────────────────────────────────────────────────────
// Excluye: DOM-TOM franceses, Groenlandia, territorios caribeños NL/UK, etc.
// Incluye: Canarias, Azores, Madeira, Islas Feroe, Svalbard.
const EU = { w: -35, e: 70, s: 22, n: 82 }

// Transcontinentales cuyo centroide cae fuera del bbox europeo → conservar completos.
const KEEP_ALL = new Set([643, 398]) // Rusia, Kazajistán

// ── ISO alpha-2 → ISO 3166-1 numérico ───────────────────────────────────────
export const ISO_NUMERIC: Record<string, number> = {
  AL: 8,   DE: 276, AD: 20,  AM: 51,  AT: 40,  AZ: 31,
  BE: 56,  BY: 112, BA: 70,  BG: 100, CY: 196, VA: 336,
  HR: 191, DK: 208, SK: 703, SI: 705, ES: 724, EE: 233,
  FI: 246, FR: 250, GE: 268, GR: 300, HU: 348, IE: 372,
  IS: 352, IT: 380, KZ: 398, LV: 428, LI: 438, LT: 440,
  LU: 442, MK: 807, MT: 470, MD: 498, MC: 492, ME: 499,
  NO: 578, NL: 528, PL: 616, PT: 620, GB: 826, CZ: 203,
  RO: 642, RU: 643, SM: 674, RS: 688, SE: 752, CH: 756,
  TR: 792, UA: 804,
}

// Reverse lookup
const NUM_TO_ISO: Record<number, string> = {}
for (const [iso, num] of Object.entries(ISO_NUMERIC)) NUM_TO_ISO[num] = iso

// Spanish name lookup (numeric → name)
const NUM_TO_NAME: Record<number, string> = {}
for (const c of COUNTRIES) {
  const num = ISO_NUMERIC[c.iso]
  if (num) NUM_TO_NAME[num] = c.name
}

/** Obtiene el código ISO alpha-2 a partir del código numérico. */
export function numToIso(num: number): string {
  return NUM_TO_ISO[num] ?? ''
}

/** Obtiene el nombre en español a partir del código numérico. */
export function numToName(num: number): string {
  return NUM_TO_NAME[num] ?? ''
}

// ── Microestados que necesitan marcador visible en el mapa ───────────────────
// Su polígono en Natural Earth 1:10m es sub-pixel o muy pequeño para ser clicado.
export const MICROSTATE_MARKERS: ReadonlyArray<{ iso: string; numId: number; lon: number; lat: number }> = [
  { iso: 'VA', numId: 336, lon: 12.4534, lat: 41.9029 }, // Vaticano: sub-pixel
  { iso: 'MC', numId: 492, lon:  7.4246, lat: 43.7384 }, // Mónaco
  { iso: 'SM', numId: 674, lon: 12.4578, lat: 43.9424 }, // San Marino
]

// ── Filtro geométrico ────────────────────────────────────────────────────────
function polygonCentroid(ring: number[][]): [number, number] {
  let x = 0, y = 0
  for (const p of ring) { x += p[0]; y += p[1] }
  return [x / ring.length, y / ring.length]
}

function inEurope([lon, lat]: [number, number]): boolean {
  return lon >= EU.w && lon <= EU.e && lat >= EU.s && lat <= EU.n
}

function clipToEurope(geom: Geometry | null, numId: number): Geometry | null {
  if (!geom || KEEP_ALL.has(numId)) return geom
  if (geom.type === 'Polygon') {
    const g = geom as Polygon
    return inEurope(polygonCentroid(g.coordinates[0])) ? geom : null
  }
  if (geom.type === 'MultiPolygon') {
    const g = geom as MultiPolygon
    const kept = g.coordinates.filter(poly => inEurope(polygonCentroid(poly[0])))
    if (kept.length === 0) return geom // fallback
    if (kept.length === 1) return { type: 'Polygon', coordinates: kept[0] } as Polygon
    return { ...g, coordinates: kept } as MultiPolygon
  }
  return geom
}

// ── GeoJSON procesado (singleton) ───────────────────────────────────────────
let _cache: FeatureCollection | null = null

export function buildEuropeGeoJSON(): FeatureCollection {
  if (_cache) return _cache

  const topo = worldDataRaw as unknown as Topology<{ countries: GeometryCollection }>
  const raw  = feature(topo, topo.objects.countries) as FeatureCollection<Geometry | null>

  const features = raw.features
    .map(f => {
      const numId = parseInt(String(f.id), 10)
      const geom  = clipToEurope(f.geometry, numId)
      return {
        ...f,
        geometry: geom,
        properties: {
          numId,
          iso:      NUM_TO_ISO[numId]  ?? '',
          name:     NUM_TO_NAME[numId] ?? '',
          isTarget: NUM_TO_NAME[numId] ? 1 : 0,
        },
      }
    })
    .filter(f => f.geometry !== null)

  _cache = { type: 'FeatureCollection', features } as FeatureCollection
  return _cache
}
