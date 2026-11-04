// Router mínimo basado en la History API (sin dependencias).
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const Ctx = createContext(null)
const current = () => window.location.pathname + window.location.search

export function Router({ children }) {
  const [url, setUrl] = useState(current)

  useEffect(() => {
    const on = () => setUrl(current())
    window.addEventListener('popstate', on)
    return () => window.removeEventListener('popstate', on)
  }, [])

  const navigate = useCallback((to, { replace = false } = {}) => {
    window.history[replace ? 'replaceState' : 'pushState']({}, '', to)
    setUrl(current())
    window.scrollTo(0, 0)
  }, [])

  const value = useMemo(() => ({ url, navigate }), [url, navigate])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const useNavigate = () => useContext(Ctx).navigate
export const usePath = () => useContext(Ctx).url.split('?')[0]
export const useQuery = () => new URLSearchParams(useContext(Ctx).url.split('?')[1] || '')

export function Link({ to, children, onClick, ...rest }) {
  const navigate = useNavigate()
  return (
    <a
      href={to}
      {...rest}
      onClick={(e) => {
        onClick?.(e)
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
        e.preventDefault()
        navigate(to)
      }}
    >
      {children}
    </a>
  )
}

export function NavLink({ to, end, className = '', activeClass = 'active', ...rest }) {
  const path = usePath()
  const on = end ? path === to : path === to || path.startsWith(to + '/')
  return <Link to={to} className={`${className} ${on ? activeClass : ''}`.trim()} aria-current={on ? 'page' : undefined} {...rest} />
}

export function Redirect({ to }) {
  const navigate = useNavigate()
  useEffect(() => navigate(to, { replace: true }), [to, navigate])
  return null
}
