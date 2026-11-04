import { useEffect, useMemo, useState } from 'react'
import { api } from '../lib/api'
import { useApi } from '../lib/hooks'
import { useAuth } from '../lib/auth'
import { useToast } from '../lib/toast'
import { Link } from '../lib/router'
import { RESTAURANT } from '../config'
import { dayStr, fmtDateTime, fmtTime, minutesLabel, toLocalISO } from '../lib/format'
import { Empty, ErrorBox, Field, Icon, LoginGate, PageHead, Spinner, Stepper } from '../components/ui'

const BLOCKED = ['OCUPADA', 'FUERADS']

function slots(date, duration) {
  const out = []
  const limit = RESTAURANT.closeHour * 60 - duration
  const now = new Date()
  for (let m = RESTAURANT.openHour * 60; m <= limit; m += 30) {
    const h = Math.floor(m / 60), mm = m % 60
    const d = new Date(`${date}T${String(h).padStart(2, '0')}:${String(mm).padStart(2, '0')}:00`)
    if (d.getTime() > now.getTime() + 30 * 60000) out.push({ value: `${String(h).padStart(2, '0')}:${String(mm).padStart(2, '0')}`, label: fmtTime(d) })
  }
  return out
}

export default function Reserve() {
  const { user } = useAuth()
  const toast = useToast()
  const mesas = useApi(() => api.get('/mesas'), [])
  const [date, setDate] = useState(dayStr())
  const [duration, setDuration] = useState(90)
  const [time, setTime] = useState('')
  const [people, setPeople] = useState(2)
  const [mesaId, setMesaId] = useState(null)
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(null)

  const options = useMemo(() => slots(date, duration), [date, duration])
  useEffect(() => { if (!options.find((o) => o.value === time)) setTime(options[0]?.value || '') }, [options, time])

  const lista = (mesas.data || []).slice().sort((a, b) => a.numeroMesa - b.numeroMesa)
  const elegible = (m) => m.capacidad >= people && !BLOCKED.includes(m.estadoMesa)
  useEffect(() => { if (mesaId && !elegible(lista.find((m) => m.id === mesaId) || {})) setMesaId(null) }, [people, mesas.data])

  if (done) {
    return (
      <div className="container page narrow">
        <div className="success">
          <span className="success-mark"><Icon name="check" size={34} /></span>
          <h1>Mesa reservada</h1>
          <p>Mesa {done.mesaResponse?.numeroMesa} para {done.cantidadPersonas} {done.cantidadPersonas === 1 ? 'persona' : 'personas'}, {fmtDateTime(done.horaInicio)}. Tu reserva queda pendiente hasta que el restaurante la confirme.</p>
          <div className="gate-actions">
            <Link to="/cuenta?tab=reservas" className="btn btn-dark">Ver mis reservas</Link>
            <button className="btn btn-ghost" onClick={() => { setDone(null); mesas.reload() }}>Hacer otra reserva</button>
          </div>
        </div>
      </div>
    )
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!time) return toast.err('Elige una hora para tu reserva.')
    if (!mesaId) return toast.err('Elige una mesa en el plano.')
    const inicio = new Date(`${date}T${time}:00`)
    const fin = new Date(inicio.getTime() + duration * 60000)
    setBusy(true)
    try {
      const res = await api.post('/reservas', { cantidadPersonas: people, id_mesa: mesaId, horaInicio: toLocalISO(inicio), horaFin: toLocalISO(fin) })
      setDone(res)
    } catch (err) { toast.err(err.message) } finally { setBusy(false) }
  }

  return (
    <div className="container page">
      <PageHead title="Reserva tu mesa">Elige cuándo vienes y en qué mesa quieres sentarte.</PageHead>
      <form className="reserve" onSubmit={submit}>
        <div className="reserve-main">
          <section className="panel">
            <h2>1. Día, hora y comensales</h2>
            <div className="row3">
              <Field label="Día"><input className="input" type="date" min={dayStr()} value={date} onChange={(e) => setDate(e.target.value)} required /></Field>
              <Field label="Duración">
                <select className="input" value={duration} onChange={(e) => setDuration(Number(e.target.value))}>
                  {RESTAURANT.durations.map((d) => <option key={d} value={d}>{minutesLabel(d)}</option>)}
                </select>
              </Field>
              <label className="field"><span>Personas</span><Stepper value={people} min={1} max={RESTAURANT.maxParty} onChange={setPeople} label="Personas" /></label>
            </div>
            <div className="field">
              <span>Hora de llegada</span>
              {options.length === 0
                ? <p className="muted small">Ya no hay horarios disponibles para este día. Prueba con otra fecha.</p>
                : <div className="chips" role="radiogroup" aria-label="Hora de llegada">
                    {options.map((o) => (
                      <button type="button" key={o.value} role="radio" aria-checked={time === o.value} className={`chip ${time === o.value ? 'on' : ''}`} onClick={() => setTime(o.value)}>{o.label}</button>
                    ))}
                  </div>}
            </div>
          </section>

          <section className="panel">
            <h2>2. Elige tu mesa</h2>
            {mesas.loading && <Spinner label="Cargando mesas" />}
            <ErrorBox error={mesas.error} onRetry={mesas.reload} />
            {!mesas.loading && !mesas.error && lista.length === 0 && <Empty icon="table" title="Aún no hay mesas registradas">El restaurante todavía no configuró su plano de mesas.</Empty>}
            <div className="mesa-grid">
              {lista.map((m) => {
                const ok = elegible(m)
                const why = BLOCKED.includes(m.estadoMesa) ? 'No disponible' : m.capacidad < people ? `Cupo para ${m.capacidad}` : m.estadoMesa === 'RESERVADA' ? 'Con reservas' : 'Libre'
                return (
                  <button type="button" key={m.id} disabled={!ok} aria-pressed={mesaId === m.id} className={`mesa ${mesaId === m.id ? 'on' : ''}`} onClick={() => setMesaId(m.id)}>
                    <b className="num">{m.numeroMesa}</b>
                    <span className="seats" aria-hidden="true">{Array.from({ length: Math.min(m.capacidad, 10) }).map((_, i) => <i key={i} />)}</span>
                    <small>{m.capacidad} puestos</small>
                    <em>{why}</em>
                  </button>
                )
              })}
            </div>
            <p className="muted small" style={{ marginTop: 14 }}>Las mesas con reservas siguen disponibles en otros horarios: si el tuyo se cruza, te avisamos al confirmar.</p>
          </section>
        </div>

        <aside className="panel summary">
          <h2>Tu reserva</h2>
          <dl className="facts">
            <div><dt>Día</dt><dd>{(d => d.charAt(0).toUpperCase() + d.slice(1))(new Date(`${date}T00:00:00`).toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' }))}</dd></div>
            <div><dt>Hora</dt><dd>{options.find((o) => o.value === time)?.label || 'Sin elegir'}</dd></div>
            <div><dt>Duración</dt><dd>{minutesLabel(duration)}</dd></div>
            <div><dt>Personas</dt><dd>{people}</dd></div>
            <div><dt>Mesa</dt><dd>{mesaId ? `Mesa ${lista.find((m) => m.id === mesaId)?.numeroMesa}` : 'Sin elegir'}</dd></div>
          </dl>
          {user
            ? <button className="btn btn-primary btn-block btn-lg" disabled={busy}>{busy ? 'Reservando…' : 'Confirmar reserva'}</button>
            : <LoginGate title="Ingresa para reservar" next="/reservar">Necesitamos saber quién eres para guardar tu reserva.</LoginGate>}
        </aside>
      </form>
    </div>
  )
}
