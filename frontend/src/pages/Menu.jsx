import { useMemo, useState } from 'react'
import { api } from '../lib/api'
import { useApi } from '../lib/hooks'
import { useCart } from '../lib/cart'
import { useToast } from '../lib/toast'
import { money } from '../lib/format'
import { DishImage, Empty, ErrorBox, Icon, PageHead, Spinner, Stepper } from '../components/ui'

export const catOf = (p) => p.categoriaNombre || p.categoria?.nombre || (typeof p.categoria === 'string' ? p.categoria : null)

function Dish({ p }) {
  const { items, add, setQty, setOpen } = useCart()
  const toast = useToast()
  const inCart = items.find((i) => i.id === p.id)

  return (
    <article className="dish">
      <DishImage src={p.urlImagen} name={p.nombre} className="dish-img" />
      <div className="dish-body">
        <div className="leader-row">
          <h3 className="leader-name">{p.nombre}</h3>
          <span className="leader-dots" />
          <span className="leader-price num">{money(p.precio)}</span>
        </div>
        <p>{p.descripcion}</p>
        <div className="dish-actions">
          {inCart ? (
            <>
              <Stepper value={inCart.cantidad} onChange={(n) => setQty(p.id, n)} label={`Cantidad de ${p.nombre}`} />
              <button className="text-link" onClick={() => setOpen(true)}>Ver mi pedido</button>
            </>
          ) : (
            <button className="btn btn-dark btn-sm" onClick={() => { add(p); toast.ok(`${p.nombre} se agregó a tu pedido`) }}>
              <Icon name="plus" size={16} /> Agregar
            </button>
          )}
        </div>
      </div>
    </article>
  )
}

export default function Menu() {
  const prod = useApi(() => api.get('/productos'), [])
  const cats = useApi(() => api.get('/categorias'), [])
  const [cat, setCat] = useState('Todo')
  const [q, setQ] = useState('')

  const productos = prod.data || []
  const conCategoria = productos.some((p) => catOf(p))
  const nombres = useMemo(() => {
    const fromApi = (cats.data || []).map((c) => c.nombre)
    const fromProd = productos.map(catOf).filter(Boolean)
    return [...new Set([...fromApi, ...fromProd])].filter((n) => productos.some((p) => catOf(p) === n))
  }, [cats.data, productos])

  const visibles = productos.filter((p) =>
    (cat === 'Todo' || catOf(p) === cat) &&
    (`${p.nombre} ${p.descripcion}`.toLowerCase().includes(q.trim().toLowerCase())))

  return (
    <div className="container page">
      <PageHead title="La carta">Todo lo que hay disponible hoy, preparado al momento.</PageHead>

      <div className="menu-tools">
        {conCategoria && (
          <div className="tabs" role="tablist" aria-label="Categorías">
            {['Todo', ...nombres].map((n) => (
              <button key={n} role="tab" aria-selected={cat === n} className={cat === n ? 'active' : ''} onClick={() => setCat(n)}>{n}</button>
            ))}
          </div>
        )}
        <label className="search">
          <Icon name="search" size={18} />
          <input type="search" placeholder="Buscar un plato" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Buscar un plato" />
        </label>
      </div>

      {prod.loading && <Spinner label="Cargando la carta" />}
      <ErrorBox error={prod.error} onRetry={prod.reload} />
      {!prod.loading && !prod.error && visibles.length === 0 && (
        <Empty icon="search" title="No encontramos platos" action={q || cat !== 'Todo' ? <button className="btn btn-ghost" onClick={() => { setQ(''); setCat('Todo') }}>Quitar filtros</button> : null}>
          {q || cat !== 'Todo' ? 'Prueba con otra búsqueda o categoría.' : 'La carta aún no tiene platos disponibles.'}
        </Empty>
      )}
      <div className="dish-grid">{visibles.map((p) => <Dish key={p.id} p={p} />)}</div>
    </div>
  )
}
