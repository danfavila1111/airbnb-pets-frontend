import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}
      className="fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: 'var(--accent-purple)' }}>
            <span className="text-white text-sm">🐾</span>
          </div>
          <span className="font-bold text-white text-lg">AirbnPets</span>
        </Link>

        {/* Links del centro */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/caregivers" style={{ color: 'var(--text-secondary)' }}
            className="text-sm hover:text-white transition">
            Explorar
          </Link>
          <a href="#como-funciona" style={{ color: 'var(--text-secondary)' }}
            className="text-sm hover:text-white transition">
            ¿Cómo funciona?
          </a>
          <Link to="/caregivers" style={{ color: 'var(--text-secondary)' }}
            className="text-sm hover:text-white transition">
            Para cuidadores
          </Link>
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link to="/dashboard" style={{ color: 'var(--text-secondary)' }}
                className="text-sm hover:text-white transition">
                Dashboard
              </Link>
              <button onClick={handleLogout}
                className="text-sm px-4 py-2 rounded-lg transition"
                style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
                Salir
              </button>
            </>
          ) : (
            <>
              <Link to="/login"
                className="text-sm px-4 py-2 rounded-lg transition hover:text-white"
                style={{ color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
                Iniciar sesión
              </Link>
              <Link to="/register"
                className="text-sm px-4 py-2 rounded-lg font-medium transition hover:opacity-90"
                style={{ backgroundColor: 'var(--accent-purple)', color: 'white' }}>
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar