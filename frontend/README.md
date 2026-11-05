# JF Restaurant · Frontend

Interfaz web del sistema de gestión de reservas y pedidos de un restaurante. Consume la API REST del backend (Spring Boot, carpeta `backend/`).

**Demo:** https://jf-restaurant-sistem-front.vercel.app
> El backend está en un plan gratuito: si estaba inactivo, la primera carga puede tardar hasta un minuto.

## Stack

React 19 + Vite, con CSS propio. Sin librerías de rutas ni de componentes: el router y el cliente HTTP están en `src/lib/`.

## Correr en local

Requisitos: Node 20 o superior y el backend corriendo en `http://localhost:8080`.

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173
```

En desarrollo, Vite redirige las peticiones `/api` al backend (ver `vite.config.js`), así que no hace falta configurar CORS para probar.

## Variables de entorno

| Variable | Para qué sirve |
|---|---|
| `VITE_API_URL` | URL pública del backend, sin barra final y sin `/api`. Déjala vacía en desarrollo. |

## Personalizar para otro restaurante

Todo se edita en **`src/config.js`**: nombre, iniciales o logo, textos de portada y de login, dirección, teléfono, horarios, reglas de reserva (horas, duraciones, máximo de personas) y los colores del tema. Para usar una imagen de logo, ponla en `public/` y escribe su ruta en `logo`.

## Estructura

```
src/
├── config.js        Identidad, textos y colores del restaurante
├── lib/             api.js (cliente HTTP), auth.jsx (JWT y rol), cart.jsx, router.jsx, format.js
├── components/      ui.jsx (piezas reutilizables), Layout.jsx (navbar, carrito, footer)
└── pages/           Home, Menu, Checkout, Reserve, Reviews, Account, Auth
    └── admin/       Dashboard, Orders, Reservations, MenuAdmin, Tables, Staff, Users, ReviewsAdmin
```

## Rutas

- **Públicas:** `/`, `/carta`, `/reservar`, `/resenas`, `/ingresar`, `/registro`
- **Con sesión:** `/checkout`, `/cuenta`
- **Solo administradores:** `/admin`, `/admin/pedidos`, `/admin/reservas`, `/admin/carta`, `/admin/mesas`, `/admin/empleados`, `/admin/usuarios`, `/admin/resenas`