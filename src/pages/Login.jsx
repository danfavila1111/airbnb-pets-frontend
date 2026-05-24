import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Login = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login(email, password)
      navigate(user.role === 'CAREGIVER' ? '/caregiver-profile' : '/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--bg-primary)' }}>

      {/* Lado izquierdo */}
      <div className="w-1/2 flex flex-col justify-center px-16 relative overflow-hidden"
        style={{ backgroundColor: 'var(--bg-secondary)' }}>

        {/* Fondo decorativo */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10"
          style={{ background: 'radial-gradient(circle at 30% 50%, #7c3aed, transparent 60%)' }}>
        </div>

        <div className="relative z-10">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-16">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: 'var(--accent-purple)' }}>
              <span className="text-white text-sm">🐾</span>
            </div>
            <span className="font-bold text-white text-lg">AirbnPets</span>
          </Link>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-8"
            style={{ backgroundColor: 'rgba(124,58,237,0.15)', color: '#8b5cf6', border: '1px solid rgba(124,58,237,0.3)' }}>
            👋 Bienvenido de vuelta
          </div>

          <h2 className="text-4xl font-bold text-white mb-4">
            ¿Quién eres<br />en AirbnPets?
          </h2>
          <p className="mb-10" style={{ color: 'var(--text-secondary)' }}>
            Elige tu rol para personalizar<br />tu experiencia desde el primer día.
          </p>

          {/* Roles */}
          <p className="text-xs font-medium mb-4" style={{ color: 'var(--text-muted)' }}>
            SELECCIONA TU ROL
          </p>
          <div className="grid grid-cols-2 gap-4 mb-10">
            <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-card)', border: '2px solid var(--accent-purple)' }}>
              <span className="text-2xl mb-2 block">🏠</span>
              <p className="font-medium text-white text-sm">Dueño de mascota</p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                Encuentra cuidadores de confianza mientras viajas.
              </p>
            </div>
            <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <span className="text-2xl mb-2 block">💛</span>
              <p className="font-medium text-white text-sm">Soy cuidador</p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                Cuida mascotas y genera ingresos extras desde tu hogar.
              </p>
            </div>
          </div>

          {/* Beneficios */}
          <div className="space-y-3">
            {[
              'Reservas confirmadas en minutos',
              'Fotos y actualizaciones diarias',
              'Pago 100% seguro y garantizado',
              'Soporte 24/7 en español',
            ].map((b, i) => (
              <div key={i} className="flex items-center gap-3">
                <span style={{ color: 'var(--accent-purple)' }}>✓</span>
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{b}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lado derecho - Formulario */}
      <div className="w-1/2 flex items-center justify-center px-16">
        <div className="w-full max-w-md">

          {/* Tabs */}
          <div className="flex gap-2 mb-8">
            <button
              onClick={() => setActiveTab('login')}
              className="px-5 py-2 rounded-lg text-sm font-medium transition"
              style={{
                backgroundColor: activeTab === 'login' ? 'var(--accent-purple)' : 'transparent',
                color: activeTab === 'login' ? 'white' : 'var(--text-secondary)',
                border: activeTab === 'login' ? 'none' : '1px solid var(--border)'
              }}>
              Iniciar sesión
            </button>
            <Link to="/register"
              className="px-5 py-2 rounded-lg text-sm font-medium transition"
              style={{ color: 'var(--text-secondary)', border: '1px solid transparent' }}>
              Crear cuenta
            </Link>
          </div>

          <h3 className="text-3xl font-bold text-white mb-2">Hola de nuevo 👋</h3>
          <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>
            Ingresa a tu cuenta para continuar
          </p>

          {error && (
            <div className="mb-6 p-3 rounded-lg text-sm"
              style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
                CORREO ELECTRÓNICO
              </label>
              <input
                type="email"
                placeholder="tu@correo.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none transition"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  color: 'white'
                }}
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
                CONTRASEÑA
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  color: 'white'
                }}
              />
              <div className="text-right mt-2">
                <span className="text-xs cursor-pointer" style={{ color: 'var(--text-muted)' }}>
                  ¿Olvidaste tu contraseña?
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-medium text-sm transition hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: 'var(--accent-purple)', color: 'white' }}>
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión →'}
            </button>
          </form>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border)' }}></div>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>o continúa con</span>
            <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border)' }}></div>
          </div>

          <button className="w-full py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-3 transition hover:opacity-80"
            style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
            🌐 Continuar con Google
          </button>

          <p className="text-center text-xs mt-8" style={{ color: 'var(--text-muted)' }}>
            Al continuar aceptas nuestros{' '}
            <span className="cursor-pointer" style={{ color: 'var(--accent-purple-light)' }}>Términos de servicio</span>
            {' '}y{' '}
            <span className="cursor-pointer" style={{ color: 'var(--accent-purple-light)' }}>Política de privacidad</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login