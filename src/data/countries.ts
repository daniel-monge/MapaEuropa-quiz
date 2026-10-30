export interface Country {
  /** Sequential number from the source document (1–50). */
  id: number
  /** ISO 3166-1 alpha-2 code – used for future map data matching. */
  iso: string
  /** Country name verbatim from the official document (no asterisk). */
  name: string
  /** Capital verbatim from the official document. */
  capital: string
  /** Marked with (*) in the source document. Meaning unconfirmed – not shown to students. */
  asterisk: boolean
}

export const COUNTRIES: Country[] = [
  { id: 1,  iso: 'AL', name: 'Albania',               capital: 'Tirana',               asterisk: false },
  { id: 2,  iso: 'DE', name: 'Alemania',               capital: 'Berlín',               asterisk: false },
  { id: 3,  iso: 'AD', name: 'Andorra',                capital: 'Andorra La Vieja',     asterisk: false },
  { id: 4,  iso: 'AM', name: 'Armenia',                capital: 'Ereván',               asterisk: true  },
  { id: 5,  iso: 'AT', name: 'Austria',                capital: 'Viena',                asterisk: false },
  { id: 6,  iso: 'AZ', name: 'Azerbaiyán',             capital: 'Bakú',                 asterisk: true  },
  { id: 7,  iso: 'BE', name: 'Bélgica',                capital: 'Bruselas',             asterisk: false },
  { id: 8,  iso: 'BY', name: 'Bielorrusia',            capital: 'Minsk',                asterisk: false },
  { id: 9,  iso: 'BA', name: 'Bosnia y Herzegovina',   capital: 'Sarajevo',             asterisk: false },
  { id: 10, iso: 'BG', name: 'Bulgaria',               capital: 'Sofía',                asterisk: false },
  { id: 11, iso: 'CY', name: 'Chipre',                 capital: 'Nicosia',              asterisk: true  },
  { id: 12, iso: 'VA', name: 'Ciudad del Vaticano',    capital: 'Ciudad del Vaticano',  asterisk: false },
  { id: 13, iso: 'HR', name: 'Croacia',                capital: 'Zagreb',               asterisk: false },
  { id: 14, iso: 'DK', name: 'Dinamarca',              capital: 'Copenhague',           asterisk: false },
  { id: 15, iso: 'SK', name: 'Eslovaquia',             capital: 'Bratislava',           asterisk: false },
  { id: 16, iso: 'SI', name: 'Eslovenia',              capital: 'Liubliana',            asterisk: false },
  { id: 17, iso: 'ES', name: 'España',                 capital: 'Madrid',               asterisk: false },
  { id: 18, iso: 'EE', name: 'Estonia',                capital: 'Tallín',               asterisk: false },
  { id: 19, iso: 'FI', name: 'Finlandia',              capital: 'Helsinki',             asterisk: false },
  { id: 20, iso: 'FR', name: 'Francia',                capital: 'París',                asterisk: false },
  { id: 21, iso: 'GE', name: 'Georgia',                capital: 'Tiflis',               asterisk: true  },
  { id: 22, iso: 'GR', name: 'Grecia',                 capital: 'Atenas',               asterisk: false },
  { id: 23, iso: 'HU', name: 'Hungría',                capital: 'Budapest',             asterisk: false },
  { id: 24, iso: 'IE', name: 'Irlanda',                capital: 'Dublín',               asterisk: false },
  { id: 25, iso: 'IS', name: 'Islandia',               capital: 'Reikiavik',            asterisk: false },
  { id: 26, iso: 'IT', name: 'Italia',                 capital: 'Roma',                 asterisk: false },
  { id: 27, iso: 'KZ', name: 'Kazajistán',             capital: 'Astaná',               asterisk: true  },
  { id: 28, iso: 'LV', name: 'Letonia',                capital: 'Riga',                 asterisk: false },
  { id: 29, iso: 'LI', name: 'Liechtenstein',          capital: 'Vaduz',                asterisk: false },
  { id: 30, iso: 'LT', name: 'Lituania',               capital: 'Vilna',                asterisk: false },
  { id: 31, iso: 'LU', name: 'Luxemburgo',             capital: 'Luxemburgo',           asterisk: false },
  { id: 32, iso: 'MK', name: 'Macedonia del Norte',    capital: 'Skopie',               asterisk: false },
  { id: 33, iso: 'MT', name: 'Malta',                  capital: 'La Valeta',            asterisk: false },
  { id: 34, iso: 'MD', name: 'Moldavia',               capital: 'Chisinau',             asterisk: false },
  { id: 35, iso: 'MC', name: 'Mónaco',                 capital: 'Mónaco',               asterisk: false },
  { id: 36, iso: 'ME', name: 'Montenegro',             capital: 'Podgorica',            asterisk: false },
  { id: 37, iso: 'NO', name: 'Noruega',                capital: 'Oslo',                 asterisk: false },
  { id: 38, iso: 'NL', name: 'Países Bajos',           capital: 'Ámsterdam',            asterisk: false },
  { id: 39, iso: 'PL', name: 'Polonia',                capital: 'Varsovia',             asterisk: false },
  { id: 40, iso: 'PT', name: 'Portugal',               capital: 'Lisboa',               asterisk: false },
  { id: 41, iso: 'GB', name: 'Reino Unido',            capital: 'Londres',              asterisk: false },
  { id: 42, iso: 'CZ', name: 'República Checa',        capital: 'Praga',                asterisk: false },
  { id: 43, iso: 'RO', name: 'Rumanía',                capital: 'Bucarest',             asterisk: false },
  { id: 44, iso: 'RU', name: 'Rusia',                  capital: 'Moscú',                asterisk: true  },
  { id: 45, iso: 'SM', name: 'San Marino',             capital: 'San Marino',           asterisk: false },
  { id: 46, iso: 'RS', name: 'Serbia',                 capital: 'Belgrado',             asterisk: false },
  { id: 47, iso: 'SE', name: 'Suecia',                 capital: 'Estocolmo',            asterisk: false },
  { id: 48, iso: 'CH', name: 'Suiza',                  capital: 'Berna',                asterisk: false },
  { id: 49, iso: 'TR', name: 'Turquía',                capital: 'Ankara',               asterisk: true  },
  { id: 50, iso: 'UA', name: 'Ucrania',                capital: 'Kiev',                 asterisk: false },
]
