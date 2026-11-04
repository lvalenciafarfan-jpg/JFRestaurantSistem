# JF Restaurant · Frontend

React + Vite. Consume la API de Spring Boot del directorio `backend/`.

## Cómo correrlo

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173
```

Con el backend encendido en `http://localhost:8080`. En desarrollo, Vite reenvía `/api` al backend
(ver `vite.config.js`), así que no necesitas configurar CORS para probar.

Para producción: `npm run build` genera `dist/`. Copia `.env.example` a `.env` y pon en
`VITE_API_URL` la URL pública del backend (y habilita CORS allí).

## Personalizar

- `src/config.js`: dirección, teléfono, horarios y rango de horas de reserva.
- `src/styles.css`: colores y tipografías en las variables de `:root`.

## Estructura

```
src/
├── lib/          api.js (cliente HTTP), auth.jsx (JWT + rol), cart.jsx, router.jsx, format.js
├── components/   ui.jsx (piezas reutilizables), Layout.jsx (navbar, carrito, footer)
└── pages/        Home, Menu, Checkout, Reserve, Reviews, Account, Auth
    └── admin/    Dashboard, Orders, Reservations, MenuAdmin, Tables, Staff, ReviewsAdmin
```

## Rutas

Públicas: `/`, `/carta`, `/reservar`, `/resenas`, `/ingresar`, `/registro`
Con sesión: `/checkout`, `/cuenta`
Solo ADMIN: `/admin`, `/admin/pedidos`, `/admin/reservas`, `/admin/carta`, `/admin/mesas`, `/admin/empleados`, `/admin/resenas`
