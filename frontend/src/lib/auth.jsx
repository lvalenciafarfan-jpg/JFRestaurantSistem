import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { api, ApiError, configureApi } from './api'

const KEY = 'jf_auth'
const Ctx = createContext(null)

function decodeJwt(token) {
  try {
    const b64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    const json = decodeURIComponent(atob(b64).split('').map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0')).join(''))
    return JSON.parse(json)
  } catch { return null }
}

const expired = (token) => {
  const exp = decodeJwt(token)?.exp
  return !exp || exp * 1000 < Date.now()
}

function loadSession() {
  try {
    const s = JSON.parse(localStorage.getItem(KEY))
    return s?.token && !expired(s.token) ? s : null
  } catch { return null }
}

// El token actual de la sesión: lo lee api.js en cada petición
let currentToken = null
configureApi({ getToken: () => (currentToken && !expired(currentToken) ? currentToken : null) })

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => {
    const s = loadSession()
    currentToken = s?.token ?? null
    return s
  })
  const sessionRef = useRef(session)
  sessionRef.current = session

  const save = (s) => {
    currentToken = s?.token ?? null
    setSession(s)
    if (s) localStorage.setItem(KEY, JSON.stringify(s))
    else localStorage.removeItem(KEY)
  }

  // Convierte la respuesta del backend en una sesión con rol y nombre.
  // 1) Si el backend ya manda rol/nombre (en la respuesta o dentro del JWT) los usamos.
  // 2) Si no, preguntamos a un endpoint exclusivo de ADMIN: 200 = admin, 403 = cliente.
  const buildSession = async (res, correo, nombreFallback) => {
    const { token } = res
    const claims = decodeJwt(token) || {}
    let rol = res.rol || claims.rol || claims.role || null
    if (!rol) {
      try {
        await api.get('/productos/admins', { token })
        rol = 'ADMIN'
      } catch { rol = 'CLIENTE' }
    }
    const nombre = res.nombre || claims.nombre || nombreFallback || correo.split('@')[0]
    return { token, correo, nombre, rol }
  }

  const login = useCallback(async (correo, password) => {
    try {
      const res = await api.post('/auth/login', { correo, password }, { auth: false })
      const s = await buildSession(res, correo)
      save(s)
      return s
    } catch (e) {
      if (e instanceof ApiError && [401, 403].includes(e.status)) {
        throw new ApiError(401, 'Correo o contraseña incorrectos.')
      }
      throw e
    }
  }, [])

  const register = useCallback(async (form) => {
    const res = await api.post('/auth/registro', form, { auth: false })
    const s = await buildSession(res, form.correo, form.nombre)
    save(s)
    return s
  }, [])

  const logout = useCallback(() => save(null), [])

  const value = useMemo(
    () => ({ user: session, isAdmin: session?.rol === 'ADMIN', login, register, logout }),
    [session, login, register, logout],
  )
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const useAuth = () => useContext(Ctx)
