# Mapa Europa — Quiz de Geografía

Juego educativo de geografía europea para niños de 6.º de Primaria.

**Jugar online:** https://daniel-monge.github.io/MapaEuropa-quiz/

## Modalidades

- **Quiz texto** — escribe la capital dado el país, o el país dada la capital
- **Selección múltiple** — elige la capital correcta entre cuatro opciones
- **Mapa interactivo** — pincha en el país correcto sobre el mapa de Europa

## Tecnología

- React 18 + TypeScript + Vite
- MapLibre GL JS — mapa renderizado en WebGL
- Datos geográficos: [Natural Earth](https://www.naturalearthdata.com/) vía [world-atlas](https://github.com/topojson/world-atlas)
- Sin llamadas externas en tiempo de ejecución — funciona offline

## Desarrollo local

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm test
```

## Licencia

Datos geográficos © Natural Earth (dominio público).
Código © 2026, disponible bajo MIT.
