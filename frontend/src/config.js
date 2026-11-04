// =====================================================================
//  ÚNICO ARCHIVO QUE SE EDITA PARA ADAPTAR LA WEB A UN RESTAURANTE
// =====================================================================
export const RESTAURANT = {
  // --- Identidad ---
  name: 'JF Restaurant',      // título de la pestaña y lectores de pantalla
  initials: 'JF',             // letras del logo (se usan si no hay imagen)
  wordmark: 'Restaurant',     // texto junto al logo ('' para ocultarlo)
  logo: '',                   // ruta de una imagen en /public, ej: '/logo.png' (opcional)

  // --- Contacto y horarios (se muestran en el footer) ---
  address: 'Calle 00 # 00-00',
  phone: '+57 300 000 0000',
  hours: [
    { days: 'Lunes a jueves', time: '11:00 a 22:00' },
    { days: 'Viernes y sábado', time: '11:00 a 23:30' },
    { days: 'Domingo', time: '12:00 a 18:00' },
  ],

  // --- Reservas ---
  openHour: 11,               // primera hora en que se acepta una reserva (24h)
  closeHour: 22,              // hora en que debe terminar la última
  durations: [60, 90, 120, 180], // opciones de duración, en minutos
  maxParty: 12,               // máximo de personas por reserva

  // --- Textos ---
  tagline: 'Cocina hecha al momento. Pide, reserva y disfruta sin filas.',
  hero: {
    title: 'Tu mesa está lista. La cocina también.',
    text: 'Mira la carta de hoy, pide a domicilio o para recoger, o reserva tu mesa en menos de un minuto.',
  },
  featuredTitle: 'Del fogón a tu mesa',
  reviewsTitle: 'Lo que dicen quienes ya comieron aquí',
  auth: {
    quote: 'Una buena mesa empieza antes de sentarte.',
    text: 'Con tu cuenta guardas tus pedidos, reservas mesas y sigues cada estado en tiempo real.',
  },

  // --- Colores ---
  theme: {
    dark: '#151212',        // negro principal: navbar, hero, footer, panel admin
    darkSoft: '#2a2424',    // tarjetas sobre fondo oscuro
    accent: '#e5202e',      // color de acción: botones, marca
    accentLight: '#ff5361', // versión clara del acento, para texto sobre fondo oscuro
    accentMid: '#d4202e',   // bordes de foco y enlaces
    paper: '#f7f5f3',       // fondo de la página
  },
}

// Aplica nombre, colores y favicon al arrancar la app.
export function applyBrand() {
  const t = RESTAURANT.theme
  const root = document.documentElement.style
  const vars = {
    '--pino': t.dark, '--pino-2': t.darkSoft, '--pino-3': t.accentMid,
    '--acento': t.accent, '--acento-2': t.accentLight, '--papel': t.paper,
  }
  Object.entries(vars).forEach(([k, v]) => v && root.setProperty(k, v))

  document.title = RESTAURANT.name
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', t.dark)

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="24" fill="${t.dark}"/><text x="50" y="66" font-size="${RESTAURANT.initials.length > 2 ? 38 : 52}" text-anchor="middle" fill="${t.accent}" font-family="Georgia,serif">${RESTAURANT.initials}</text></svg>`
  const icon = document.querySelector('link[rel="icon"]')
  if (icon) icon.href = `data:image/svg+xml,${encodeURIComponent(svg)}`
}