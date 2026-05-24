import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const steps = ['Tu rol', 'Datos personales', 'Tus mascotas', 'Verificación']

const petTypes = [
  { emoji: '🐶', label: 'Perro', value: 'DOG' },
  { emoji: '🐱', label: 'Gato', value: 'CAT' },
  { emoji: '🐰', label: 'Conejo', value: 'RABBIT' },
  { emoji: '🦜', label: 'Ave', value: 'BIRD' },
  { emoji: '🐾', label: 'Otro', value: 'OTHER' },
]

const Register = () => {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [role, setRole] = useState('OWNER')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    setError('')
    if (form.password !== form.confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }
    setLoading(true)
    try {
      await register({
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        password: form.password,
        role
      })
      navigate(role === 'CAREGIVER' ? '/caregiver-profile' : '/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Error al crear la cuenta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--bg-primary)' }}>

      {/* Lado izquierdo */}
      <div className="w-96 flex flex-col justify-between p-10 relative overflow-hidden"
        style={{ backgroundColor: 'var(--bg-secondary)', borderRight: '1px solid var(--border)' }}>
        <div className="absolute top-0 left-0 w-full h-full opacity-10"
          style={{ background: 'radial-gradient(circle at 30% 50%, #7c3aed, transparent 60%)' }}>
        </div>

        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2 mb-12">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: 'var(--accent-purple)' }}>
              <span className="text-white text-sm">🐾</span>
            </div>
            <span className="font-bold text-white text-lg">AirbnPets</span>
          </Link>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6"
            style={{ backgroundColor: 'rgba(124,58,237,0.15)', color: '#8b5cf6', border: '1px solid rgba(124,58,237,0.3)' }}>
            {role === 'OWNER' ? '🏠 Dueño de mascota' : '💛 Cuidador verificado'}
          </div>

          <h2 className="text-3xl font-bold text-white mb-3">
            {role === 'OWNER' ? 'Encuentra el hogar perfecto para tu peludito' : 'Gana dinero haciendo lo que amas'}
          </h2>
          <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>
            {role === 'OWNER'
              ? 'Solo toma 3 minutos. Tendrás acceso a más de 1,200 cuidadores verificados en Colombia.'
              : 'Cuida mascotas desde tu hogar y genera ingresos flexibles cada semana.'}
          </p>

          {/* Progreso */}
          <p className="text-xs font-medium mb-2 flex justify-between" style={{ color: 'var(--text-muted)' }}>
            <span>Progreso del registro</span>
            <span>Paso {step} de {steps.length}</span>
          </p>
          <div className="h-1.5 rounded-full mb-6" style={{ backgroundColor: 'var(--border)' }}>
            <div className="h-full rounded-full transition-all"
              style={{ width: `${(step / steps.length) * 100}%`, backgroundColor: 'var(--accent-purple)' }}>
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-3">
            {steps.map((s, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl"
                style={{
                  backgroundColor: step === i + 1 ? 'var(--bg-card)' : 'transparent',
                  border: step === i + 1 ? '1px solid var(--accent-purple)' : '1px solid transparent'
                }}>
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{
                    backgroundColor: step > i + 1 ? 'var(--accent-green)' : step === i + 1 ? 'var(--accent-purple)' : 'var(--bg-card)',
                    color: 'white'
                  }}>
                  {step > i + 1 ? '✓' : i + 1}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{s}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {i === 0 && 'Owner o Cuidador'}
                    {i === 1 && 'Nombre, contacto e imagen'}
                    {i === 2 && 'Agrega perfiles de tus pets'}
                    {i === 3 && 'Confirma tu correo'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lado derecho */}
      <div className="flex-1 flex items-center justify-center px-16">
        <div className="w-full max-w-xl">

          {/* Step 1: Rol */}
          {step === 1 && (
            <div>
              <h3 className="text-3xl font-bold text-white mb-2">Elige tu rol 🎯</h3>
              <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>
                Puedes cambiar esto después desde tu perfil
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { value: 'OWNER', emoji: '🏠', title: 'Dueño de mascota', desc: 'Encuentra cuidadores de confianza mientras viajas.' },
                  { value: 'CAREGIVER', emoji: '💛', title: 'Soy cuidador', desc: 'Cuida mascotas y genera ingresos extras desde tu hogar.' },
                ].map(r => (
                  <button key={r.value} onClick={() => setRole(r.value)}
                    className="p-6 rounded-xl text-left transition"
                    style={{
                      backgroundColor: 'var(--bg-card)',
                      border: role === r.value ? '2px solid var(--accent-purple)' : '1px solid var(--border)'
                    }}>
                    <span className="text-3xl mb-3 block">{r.emoji}</span>
                    <p className="font-medium text-white mb-1">{r.title}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{r.desc}</p>
                    {role === r.value && (
                      <div className="mt-3 w-5 h-5 rounded-full flex items-center justify-center ml-auto"
                        style={{ backgroundColor: 'var(--accent-purple)' }}>
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
              <button onClick={() => setStep(2)}
                className="w-full py-3 rounded-xl font-medium text-sm transition hover:opacity-90"
                style={{ backgroundColor: 'var(--accent-purple)', color: 'white' }}>
                Continuar →
              </button>
            </div>
          )}

          {/* Step 2: Datos personales */}
          {step === 2 && (
            <div>
              <h3 className="text-3xl font-bold text-white mb-2">Cuéntanos sobre ti 🙋</h3>
              <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>
                Completa tu perfil para que los cuidadores puedan conocerte
              </p>

              {error && (
                <div className="mb-6 p-3 rounded-lg text-sm"
                  style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)' }}>
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>NOMBRE COMPLETO</label>
                  <input name="fullName" value={form.fullName} onChange={handleChange}
                    placeholder="Ingresa tu nombre"
                    className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none"
                    style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', color: 'white' }} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>TELÉFONO</label>
                  <input name="phone" value={form.phone} onChange={handleChange}
                    placeholder="+57 310 000 0000"
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                    style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', color: 'white' }} />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>CORREO ELECTRÓNICO</label>
                <input name="email" type="email" value={form.email} onChange={handleChange}
                  placeholder="tu@correo.com"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                  style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', color: 'white' }} />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div>
                  <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>CONTRASEÑA</label>
                  <input name="password" type="password" value={form.password} onChange={handleChange}
                    placeholder="Mínimo 8 caracteres"
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                    style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', color: 'white' }} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>CONFIRMAR CONTRASEÑA</label>
                  <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange}
                    placeholder="Repite tu contraseña"
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                    style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', color: 'white' }} />
                </div>
              </div>

              <button onClick={handleSubmit} disabled={loading}
                className="w-full py-3 rounded-xl font-medium text-sm transition hover:opacity-90 disabled:opacity-50 mb-3"
                style={{ backgroundColor: 'var(--accent-purple)', color: 'white' }}>
                {loading ? 'Creando cuenta...' : 'Continuar →'}
              </button>
              <button onClick={() => setStep(1)}
                className="w-full py-3 rounded-xl text-sm transition"
                style={{ color: 'var(--text-muted)' }}>
                ← Volver al paso anterior
              </button>
              <p className="text-center text-xs mt-4" style={{ color: 'var(--text-muted)' }}>
                ¿Ya tienes cuenta?{' '}
                <Link to="/login" style={{ color: 'var(--accent-purple-light)' }}>Inicia sesión aquí</Link>
              </p>
            </div>
          )}

          {/* Steps 3 y 4 próximamente */}
          {step >= 3 && (
            <div className="text-center">
              <p className="text-4xl mb-4">🎉</p>
              <h3 className="text-2xl font-bold text-white mb-2">¡Casi listo!</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Completa tu perfil desde el dashboard.</p>
              <button onClick={handleSubmit}
                className="mt-6 px-8 py-3 rounded-xl font-medium text-sm transition hover:opacity-90"
                style={{ backgroundColor: 'var(--accent-purple)', color: 'white' }}>
                Ir al dashboard →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Register