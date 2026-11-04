import { useState } from 'react'
import { useAuth } from '../lib/auth'
import { useToast } from '../lib/toast'
import { Link, Redirect, useNavigate, usePath, useQuery } from '../lib/router'
import { Brand } from '../components/Layout'
import { Field } from '../components/ui'
import { RESTAURANT } from '../config'

export default function Auth() {
  const registro = usePath() === '/registro'
  const { user, login, register } = useAuth()
  const navigate = useNavigate()
  const next = useQuery().get('next')
  const toast = useToast()
  const [form, setForm] = useState({ nombre: '', correo: '', telefono: '', password: '' })
  const [busy, setBusy] = useState(false)
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  if (user) return <Redirect to={next || (user.rol === 'ADMIN' ? '/admin' : '/')} />

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    try {
      const s = registro
        ? await register({ nombre: form.nombre.trim(), correo: form.correo.trim(), telefono: form.telefono.trim() || null, password: form.password })
        : await login(form.correo.trim(), form.password)
      toast.ok(registro ? 'Tu cuenta está lista' : `Bienvenido, ${s.nombre.split(' ')[0]}`)
      navigate(next || (s.rol === 'ADMIN' ? '/admin' : '/'), { replace: true })
    } catch (err) { toast.err(err.message) } finally { setBusy(false) }
  }

  return (
    <div className="auth">
      <div className="auth-side">
        <Brand />
        <blockquote>{RESTAURANT.auth.quote}</blockquote>
        <p>{RESTAURANT.auth.text}</p>
      </div>
      <div className="auth-form">
        <form onSubmit={submit} className="stack">
          <h1>{registro ? 'Crea tu cuenta' : 'Ingresa a tu cuenta'}</h1>
          {registro && <Field label="Nombre completo"><input className="input" value={form.nombre} onChange={set('nombre')} required autoComplete="name" /></Field>}
          <Field label="Correo electrónico"><input className="input" type="email" value={form.correo} onChange={set('correo')} required autoComplete="email" /></Field>
          {registro && <Field label="Teléfono (opcional)"><input className="input" type="tel" value={form.telefono} onChange={set('telefono')} autoComplete="tel" /></Field>}
          <Field label="Contraseña" hint={registro ? 'Usa al menos 8 caracteres.' : null}>
            <input className="input" type="password" value={form.password} onChange={set('password')} required minLength={registro ? 8 : undefined} autoComplete={registro ? 'new-password' : 'current-password'} />
          </Field>
          <button className="btn btn-dark btn-block btn-lg" disabled={busy}>{busy ? 'Un momento…' : registro ? 'Crear cuenta' : 'Ingresar'}</button>
          <p className="muted center">
            {registro ? '¿Ya tienes cuenta?' : '¿Eres nuevo aquí?'}{' '}
            <Link className="text-link" to={`${registro ? '/ingresar' : '/registro'}${next ? `?next=${encodeURIComponent(next)}` : ''}`}>{registro ? 'Ingresa' : 'Crea una cuenta'}</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
