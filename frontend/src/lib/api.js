// Cliente HTTP único para todo el frontend.
const BASE = import.meta.env.VITE_API_URL || ''

let getToken = () => null
export const configureApi = (cfg) => { getToken = cfg.getToken }

export class ApiError extends Error {
  constructor(status, message, data) {
    super(message)
    this.status = status
    this.data = data
  }
}

const DEFAULT_MSG = {
  400: 'Revisa los datos ingresados.',
  401: 'Tu sesión expiró. Vuelve a ingresar.',
  403: 'No tienes permiso para hacer esto.',
  404: 'No encontramos lo que buscas.',
  409: 'Ese dato ya existe.',
  500: 'Algo falló en el servidor. Intenta de nuevo en un momento.',
}

async function request(method, path, { body, params, auth = true, token } = {}) {
  const headers = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  const t = token ?? (auth ? getToken() : null)
  if (t) headers.Authorization = `Bearer ${t}`

  const query = params
    ? '?' + new URLSearchParams(Object.entries(params).filter(([, v]) => v != null && v !== ''))
    : ''

  let res
  try {
    res = await fetch(`${BASE}/api${path}${query}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError(0, 'No hay conexión con el servidor. Verifica que el backend esté encendido.')
  }

  const text = await res.text()
  let data = null
  try { data = text ? JSON.parse(text) : null } catch { data = text }

  if (!res.ok) {
    const fieldMsg = Array.isArray(data?.errors) ? data.errors[0]?.defaultMessage : null
    const msg = data?.mensaje || fieldMsg || data?.message || data?.detail || DEFAULT_MSG[res.status] || 'Ocurrió un error inesperado.'
    throw new ApiError(res.status, msg, data)
  }
  return data
}

export const api = {
  get: (p, o) => request('GET', p, o),
  post: (p, body, o) => request('POST', p, { ...o, body }),
  put: (p, body, o) => request('PUT', p, { ...o, body }),
  del: (p, o) => request('DELETE', p, o),
}
