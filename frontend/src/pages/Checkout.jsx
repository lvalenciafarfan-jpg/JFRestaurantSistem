import { useState } from 'react'
import { api } from '../lib/api'
import { useAuth } from '../lib/auth'
import { useCart } from '../lib/cart'
import { useToast } from '../lib/toast'
import { Link } from '../lib/router'
import { METODO_PAGO, TIPO_PEDIDO, money } from '../lib/format'
import { DishImage, Empty, Icon, LoginGate, PageHead } from '../components/ui'

const TIPOS = [
  ['A_DOMICILIO', 'bike', 'A domicilio', 'Lo llevamos a tu puerta'],
  ['PARA_RECOGER', 'bag', 'Para recoger', 'Pasas por él al restaurante'],
  ['CONSUMO_MESA', 'utensils', 'En el restaurante', 'Lo sirven en tu mesa'],
]

export default function Checkout() {
  const { user } = useAuth()
  const { items, total, clear, setQty } = useCart()
  const toast = useToast()
  const [tipo, setTipo] = useState('A_DOMICILIO')
  const [direccion, setDireccion] = useState('')
  const [pago, setPago] = useState('EFECTIVO')
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(null)

  if (done) {
    return (
      <div className="container page narrow">
        <div className="success">
          <span className="success-mark"><Icon name="check" size={34} /></span>
          <h1>Recibimos tu pedido #{done.id}</h1>
          <p>Total {money(done.total)}. Puedes seguir su estado en tu cuenta; te lo vamos actualizando mientras lo preparamos.</p>
          <div className="gate-actions">
            <Link to="/cuenta" className="btn btn-dark">Ver mis pedidos</Link>
            <Link to="/carta" className="btn btn-ghost">Seguir viendo la carta</Link>
          </div>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="container page narrow">
        <Empty icon="bag" title="Tu pedido está vacío" action={<Link to="/carta" className="btn btn-dark">Ir a la carta</Link>}>
          Agrega platos desde la carta para continuar.
        </Empty>
      </div>
    )
  }

  const submit = async (e) => {
    e.preventDefault()
    if (tipo === 'A_DOMICILIO' && direccion.trim().length < 6) return toast.err('Escribe una dirección de entrega completa.')
    setBusy(true)
    try {
      const res = await api.post('/pedidos', {
        tipoPedido: tipo,
        direccion: tipo === 'A_DOMICILIO' ? direccion.trim() : null,
        metodoPago: pago,
        items: items.map((i) => ({ productoId: i.id, cantidad: i.cantidad })),
      })
      clear()
      setDone(res)
    } catch (err) {
      toast.err(err.message)
    } finally { setBusy(false) }
  }

  return (
    <div className="container page">
      <PageHead title="Confirma tu pedido">Revisa los detalles antes de enviarlo a la cocina.</PageHead>
      <form className="checkout" onSubmit={submit}>
        <div className="checkout-main">
          <fieldset className="panel">
            <legend>¿Cómo lo quieres?</legend>
            <div className="choice-grid">
              {TIPOS.map(([val, icon, title, sub]) => (
                <label key={val} className={`choice ${tipo === val ? 'on' : ''}`}>
                  <input type="radio" name="tipo" value={val} checked={tipo === val} onChange={() => setTipo(val)} />
                  <Icon name={icon} size={24} /><strong>{title}</strong><small>{sub}</small>
                </label>
              ))}
            </div>
            {tipo === 'A_DOMICILIO' && (
              <label className="field" style={{ marginTop: 18 }}>
                <span>Dirección de entrega</span>
                <textarea rows="2" value={direccion} onChange={(e) => setDireccion(e.target.value)} placeholder="Calle, número, barrio y referencias" required />
              </label>
            )}
          </fieldset>

          <fieldset className="panel">
            <legend>Método de pago</legend>
            <div className="choice-grid two">
              {Object.entries(METODO_PAGO).map(([val, label]) => (
                <label key={val} className={`choice slim ${pago === val ? 'on' : ''}`}>
                  <input type="radio" name="pago" value={val} checked={pago === val} onChange={() => setPago(val)} />
                  <strong>{label}</strong>
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        <aside className="panel summary">
          <h2>Resumen</h2>
          <ul className="sum-list">
            {items.map((i) => (
              <li key={i.id}>
                <DishImage src={i.urlImagen} name={i.nombre} className="thumb" />
                <div><strong>{i.nombre}</strong><span className="muted">{i.cantidad} × {money(i.precio)}</span></div>
                <b className="num">{money(i.precio * i.cantidad)}</b>
              </li>
            ))}
          </ul>
          <div className="total-row big"><span>Total</span><b className="num">{money(total)}</b></div>
          <p className="muted small">{TIPO_PEDIDO[tipo]} · {METODO_PAGO[pago]}. El total final se calcula con los precios vigentes al enviar.</p>
          {user ? (
            <button className="btn btn-primary btn-block btn-lg" disabled={busy}>{busy ? 'Enviando…' : 'Enviar pedido'}</button>
          ) : (
            <LoginGate title="Ingresa para enviar tu pedido" next="/checkout">Tu carrito se guarda mientras inicias sesión.</LoginGate>
          )}
        </aside>
      </form>
    </div>
  )
}
