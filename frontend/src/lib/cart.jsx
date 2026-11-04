import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const KEY = 'jf_cart'
const Ctx = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY)) || [] } catch { return [] }
  })
  const [open, setOpen] = useState(false)

  useEffect(() => localStorage.setItem(KEY, JSON.stringify(items)), [items])

  const add = useCallback((p, qty = 1) => {
    setItems((prev) => {
      const found = prev.find((i) => i.id === p.id)
      if (found) return prev.map((i) => (i.id === p.id ? { ...i, cantidad: Math.min(i.cantidad + qty, 20) } : i))
      return [...prev, { id: p.id, nombre: p.nombre, precio: Number(p.precio), urlImagen: p.urlImagen, cantidad: qty }]
    })
  }, [])

  const setQty = useCallback((id, cantidad) => {
    setItems((prev) => (cantidad <= 0 ? prev.filter((i) => i.id !== id) : prev.map((i) => (i.id === id ? { ...i, cantidad: Math.min(cantidad, 20) } : i))))
  }, [])

  const clear = useCallback(() => setItems([]), [])

  const value = useMemo(() => ({
    items, add, setQty, clear, open, setOpen,
    count: items.reduce((n, i) => n + i.cantidad, 0),
    total: items.reduce((n, i) => n + i.precio * i.cantidad, 0),
  }), [items, add, setQty, clear, open])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const useCart = () => useContext(Ctx)
