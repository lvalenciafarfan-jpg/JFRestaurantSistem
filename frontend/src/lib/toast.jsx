import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const Ctx = createContext(null)
let seq = 0

export function ToastProvider({ children }) {
  const [list, setList] = useState([])

  const push = useCallback((kind, text) => {
    const id = ++seq
    setList((l) => [...l, { id, kind, text }])
    setTimeout(() => setList((l) => l.filter((t) => t.id !== id)), kind === 'error' ? 6000 : 3500)
  }, [])

  const api = useMemo(() => ({ ok: (t) => push('ok', t), err: (t) => push('error', t) }), [push])

  return (
    <Ctx.Provider value={api}>
      {children}
      <div className="toasts" role="status" aria-live="polite">
        {list.map((t) => <div key={t.id} className={`toast toast-${t.kind}`}>{t.text}</div>)}
      </div>
    </Ctx.Provider>
  )
}

export const useToast = () => useContext(Ctx)
