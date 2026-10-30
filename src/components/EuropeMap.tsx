import * as maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { useEffect, useRef, useState } from 'react'
import { buildEuropeGeoJSON, MICROSTATE_MARKERS, numToName } from '../data/geoData.ts'

interface Props {
  targetNumId: number
  clickedNumId: number | null
  feedback: 'correct' | 'incorrect' | null
  onCountryClick: (numId: number, name: string) => void
}

const DEFAULT_CENTER: [number, number] = [15, 52]
const DEFAULT_ZOOM = 3.2

const MS_GEOJSON = {
  type: 'FeatureCollection' as const,
  features: MICROSTATE_MARKERS.map(m => ({
    type: 'Feature' as const,
    geometry: { type: 'Point' as const, coordinates: [m.lon, m.lat] as [number, number] },
    properties: { numId: m.numId, name: numToName(m.numId), iso: m.iso },
  })),
}

export function EuropeMap({ targetNumId, clickedNumId, feedback, onCountryClick }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef       = useRef<maplibregl.Map | null>(null)
  const onClickRef   = useRef(onCountryClick)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => { onClickRef.current = onCountryClick }, [onCountryClick])

  // ── Inicialización (una sola vez) ──────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const geojson = buildEuropeGeoJSON()

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: {
        version: 8,
        sources: {
          countries: {
            type: 'geojson', data: geojson,
            attribution: '© <a href="https://www.naturalearthdata.com/" target="_blank" rel="noopener">Natural Earth</a>',
          },
          microstates: { type: 'geojson', data: MS_GEOJSON },
        },
        layers: [
          { id: 'bg', type: 'background', paint: { 'background-color': '#c8e6f5' } },

          // ── Países ──
          { id: 'fill-other', type: 'fill', source: 'countries',
            filter: ['==', ['get', 'isTarget'], 0],
            paint: { 'fill-color': '#d9dfe6' } },
          { id: 'fill-target', type: 'fill', source: 'countries',
            filter: ['==', ['get', 'isTarget'], 1],
            paint: { 'fill-color': '#2c6fad' } },
          { id: 'fill-correct', type: 'fill', source: 'countries',
            filter: ['==', ['get', 'numId'], -1],
            paint: { 'fill-color': '#27ae60' } },
          { id: 'fill-wrong', type: 'fill', source: 'countries',
            filter: ['==', ['get', 'numId'], -1],
            paint: { 'fill-color': '#c0392b' } },
          { id: 'borders', type: 'line', source: 'countries',
            paint: { 'line-color': '#ffffff', 'line-width': 0.7 } },

          // ── Microestados (círculos WebGL — sin DOM, sin transform issues) ──
          { id: 'ms-dot', type: 'circle', source: 'microstates',
            paint: { 'circle-radius': 5, 'circle-color': '#2c6fad',
                     'circle-stroke-width': 2, 'circle-stroke-color': '#fff' } },
          { id: 'ms-correct', type: 'circle', source: 'microstates',
            filter: ['==', ['get', 'numId'], -1],
            paint: { 'circle-radius': 5, 'circle-color': '#27ae60',
                     'circle-stroke-width': 2, 'circle-stroke-color': '#fff' } },
          { id: 'ms-wrong', type: 'circle', source: 'microstates',
            filter: ['==', ['get', 'numId'], -1],
            paint: { 'circle-radius': 5, 'circle-color': '#c0392b',
                     'circle-stroke-width': 2, 'circle-stroke-color': '#fff' } },
        ],
      },
      center: DEFAULT_CENTER,
      zoom:   DEFAULT_ZOOM,
      minZoom: 1.5,
      maxZoom: 18,
    })

    map.on('load', () => {
      setLoaded(true)

      const clickableLayers = ['fill-target', 'fill-other', 'fill-correct', 'fill-wrong', 'ms-dot', 'ms-correct', 'ms-wrong']
      const hoverLayers     = ['fill-target', 'fill-other', 'ms-dot']

      map.on('mouseenter', hoverLayers, () => { map.getCanvas().style.cursor = 'pointer' })
      map.on('mouseleave', hoverLayers, () => { map.getCanvas().style.cursor = '' })

      map.on('click', clickableLayers, e => {
        const feat = e.features?.[0]
        if (!feat) return
        const numId = Number(feat.properties.numId)
        const name  = String(feat.properties.name ?? '')
        onClickRef.current(numId, name)
      })
    })

    mapRef.current = map
    return () => { map.remove(); mapRef.current = null }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Nueva pregunta: resetear vista y overlays ───────────────────────────────
  useEffect(() => {
    const map = mapRef.current
    if (!map?.isStyleLoaded()) return
    map.setFilter('fill-correct', ['==', ['get', 'numId'], -1])
    map.setFilter('fill-wrong',   ['==', ['get', 'numId'], -1])
    map.setFilter('ms-correct',   ['==', ['get', 'numId'], -1])
    map.setFilter('ms-wrong',     ['==', ['get', 'numId'], -1])
    map.flyTo({ center: DEFAULT_CENTER, zoom: DEFAULT_ZOOM, duration: 600 })
  }, [targetNumId])

  // ── Feedback: colorear tras el clic ───────────────────────────────────────
  useEffect(() => {
    const map = mapRef.current
    if (!map?.isStyleLoaded()) return

    if (feedback === 'correct') {
      map.setFilter('fill-correct', ['==', ['get', 'numId'], targetNumId])
      map.setFilter('fill-wrong',   ['==', ['get', 'numId'], -1])
      map.setFilter('ms-correct',   ['==', ['get', 'numId'], targetNumId])
      map.setFilter('ms-wrong',     ['==', ['get', 'numId'], -1])
    } else if (feedback === 'incorrect' && clickedNumId !== null) {
      map.setFilter('fill-wrong',   ['==', ['get', 'numId'], clickedNumId])
      map.setFilter('fill-correct', ['==', ['get', 'numId'], targetNumId])
      map.setFilter('ms-wrong',     ['==', ['get', 'numId'], clickedNumId])
      map.setFilter('ms-correct',   ['==', ['get', 'numId'], targetNumId])
    }
  }, [feedback, targetNumId, clickedNumId])

  return (
    <>
      <div
        ref={containerRef}
        style={{ position: 'absolute', inset: 0 }}
        aria-label="Mapa de Europa interactivo"
      />
      {!loaded && (
        <div style={{
          position: 'absolute', inset: 0,
          background: '#c8e6f5',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column', gap: '0.75rem',
          color: '#2c6fad', fontWeight: 600, fontSize: '1rem',
          pointerEvents: 'none',
        }}>
          <svg width="36" height="36" viewBox="0 0 36 36" style={{ animation: 'spin 1s linear infinite' }}>
            <circle cx="18" cy="18" r="14" fill="none" stroke="#2c6fad" strokeWidth="3" strokeOpacity="0.25" />
            <path d="M18 4 A14 14 0 0 1 32 18" fill="none" stroke="#2c6fad" strokeWidth="3" strokeLinecap="round" />
          </svg>
          Cargando mapa…
        </div>
      )}
    </>
  )
}
