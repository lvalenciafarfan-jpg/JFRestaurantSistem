import { useCallback, useEffect, useRef, useState } from 'react'

// Carga datos de la API y expone loading / error / reload. `interval` (ms) refresca en segundo plano.
export function useApi(fn, deps = [], { interval } = {}) {
  const [state, setState] = useState({ data: null, loading: true, error: null })
  const seq = useRef(0)

  const run = useCallback(async (silent) => {
    const id = ++seq.current
    if (!silent) setState((s) => ({ ...s, loading: true, error: null }))
    try {
      const data = await fn()
      if (id === seq.current) setState({ data, loading: false, error: null })
    } catch (error) {
      if (id === seq.current) setState((s) => ({ data: silent ? s.data : null, loading: false, error }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => {
    run(false)
    if (!interval) return
    const t = setInterval(() => run(true), interval)
    return () => clearInterval(t)
  }, [run, interval])

  return { ...state, reload: () => run(true) }
}
