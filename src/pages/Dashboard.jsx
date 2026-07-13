import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getMyBookings } from '../services/bookings.service'
import { getMyPets } from '../services/pets.service'
import { getStats } from '../services/stats.service'

const statusColors = {
  PENDING: { bg: 'rgba(234,179,8,0.15)', color: '#eab308', label: 'Pendiente' },
  CONFIRMED: { bg: 'rgba(16,185,129,0.15)', color: '#10b981', label: 'Confirmada' },
  ACTIVE: { bg: 'rgba(59,130,246,0.15)', color: '#3b82f6', label: 'Activa' },
  COMPLETED: { bg: 'rgba(100,116,139,0.15)', color: '#64748b', label: 'Completada' },
  CANCELLED: { bg: 'rgba(239,68,68,0.15)', color: '#ef4444', label: 'Cancelada' },
}

const petEmojis = { DOG: '🐶', CAT: '🐱', RABBIT: '🐰', BIRD: '🦜', OTHER: '🐾' }

const Sidebar = ({ active, user, logout }) => {
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const ownerLinks = [
    { label: 'Inicio', icon: '🏠', path: '/dashboard' },
    { label: 'Mis reservas', icon: '📅', path: '/my-bookings' },
    { label: 'Mis mascotas', icon: '🐾', path: '/my-pets' },
    { label: 'Favoritos', icon: '❤️', path: '/dashboard' },
  ]

  const caregiverLinks = [
    { label: 'Inicio', icon: '🏠', path: '/dashboard' },
    { label: 'Mis reservas', icon: '📅', path: '/my-bookings' },
    { label: 'Mi perfil', icon: '👤', path: '/caregiver-profile' },
  ]

  const activityLinks = [
    { label: 'Mensajes', icon: '💬', path: '/dashboard' },
    { label: 'Notificaciones', icon: '🔔', path: '/dashboard' },
    { label: 'Reseñas', icon: '⭐', path: '/dashboard' },
  ]

  const accountLinks = [
    { label: 'Mi perfil', icon: '👤', path: '/dashboard' },
    { label: 'Ajustes', icon: '⚙️', path: '/dashboard' },
  ]

  const mainLinks = user?.role === 'CAREGIVER' ? caregiverLinks : ownerLinks

  return (
    <div className="w-56 flex flex-col h-screen fixed left-0 top-0"
      style={{ backgroundColor: 'var(--bg-secondary)', borderRight: '1px solid var(--border)' }}>

      {/* Logo */}
      <div className="p-4 flex items-center gap-2" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: 'var(--accent-purple)' }}>
          <span className="text-white text-xs">🐾</span>
        </div>
        <span className="font-bold text-white">AirbnPets</span>
      </div>

      {/* User info */}
      <div className="p-4 flex items-center gap-3" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
          style={{ backgroundColor: 'var(--accent-purple)' }}>
          {user?.fullName?.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-medium text-white">{user?.fullName}</p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {user?.role === 'OWNER' ? 'Dueño de mascota' : 'Cuidador'}
          </p>
        </div>
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto p-3">
        <p className="text-xs font-medium mb-2 px-2" style={{ color: 'var(--text-muted)' }}>PRINCIPAL</p>
        {mainLinks.map((l, i) => (
          <Link key={i} to={l.path}
            className="flex items-center gap-3 px-3 py-2 rounded-lg mb-1 text-sm transition"
            style={{
              backgroundColor: active === l.label ? 'var(--accent-purple)' : 'transparent',
              color: active === l.label ? 'white' : 'var(--text-secondary)'
            }}>
            <span>{l.icon}</span>
            <span>{l.label}</span>
          </Link>
        ))}

        <p className="text-xs font-medium mb-2 mt-4 px-2" style={{ color: 'var(--text-muted)' }}>ACTIVIDAD</p>
        {activityLinks.map((l, i) => (
          <Link key={i} to={l.path}
            className="flex items-center gap-3 px-3 py-2 rounded-lg mb-1 text-sm transition hover:text-white"
            style={{ color: 'var(--text-secondary)' }}>
            <span>{l.icon}</span>
            <span>{l.label}</span>
          </Link>
        ))}

        <p className="text-xs font-medium mb-2 mt-4 px-2" style={{ color: 'var(--text-muted)' }}>CUENTA</p>
        {accountLinks.map((l, i) => (
          <Link key={i} to={l.path}
            className="flex items-center gap-3 px-3 py-2 rounded-lg mb-1 text-sm transition hover:text-white"
            style={{ color: 'var(--text-secondary)' }}>
            <span>{l.icon}</span>
            <span>{l.label}</span>
          </Link>
        ))}
      </div>

      {/* Logout */}
      <div className="p-3" style={{ borderTop: '1px solid var(--border)' }}>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition hover:bg-red-500 hover:text-white"
          style={{ color: 'var(--text-secondary)' }}>
          <span>🚪</span>
          <span>Cerrar sesión</span>
        </button>
      </div>
    </div>
  )
}

const Dashboard = () => {
  const { user, logout } = useAuth()
  const [bookings, setBookings] = useState([])
  const [pets, setPets] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('Todas')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingsData, petsData, statsData] = await Promise.all([
          getMyBookings(),
          user?.role === 'OWNER' ? getMyPets() : Promise.resolve([]),
          getStats()
        ])
        setBookings(bookingsData)
        setPets(petsData)
        setStats(statsData)
      } catch (error) {
        console.error('Error cargando dashboard:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [user])

  const filters = ['Todas', 'Confirmadas', 'Próximas', 'Completadas']

  const filteredBookings = bookings.filter(b => {
    if (activeFilter === 'Todas') return true
    if (activeFilter === 'Confirmadas') return b.status === 'CONFIRMED'
    if (activeFilter === 'Próximas') return b.status === 'PENDING'
    if (activeFilter === 'Completadas') return b.status === 'COMPLETED'
    return true
  })

  const activeBookings = bookings.filter(b => ['PENDING', 'CONFIRMED', 'ACTIVE'].includes(b.status))
  const totalSpent = bookings.filter(b => b.status === 'COMPLETED').reduce((sum, b) => sum + b.totalPrice, 0)

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Sidebar active="Inicio" user={user} logout={logout} />

      {/* Main content */}
      <div className="flex-1 ml-56 p-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-white">
            Hola, {user?.fullName?.split(' ')[0]} 👋
          </h1>
          <Link to="/caregivers"
            className="px-4 py-2 rounded-xl text-sm font-medium transition hover:opacity-90"
            style={{ backgroundColor: 'var(--accent-purple)', color: 'white' }}>
            + Nueva reserva
          </Link>
        </div>

        {/* Stats cards */}
        {loading ? (
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-28 rounded-2xl animate-pulse" style={{ backgroundColor: 'var(--bg-card)' }}></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="p-5 rounded-2xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">📅</span>
              </div>
              <p className="text-3xl font-bold text-white">{activeBookings.length}</p>
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Reservas activas</p>
            </div>
            <div className="p-5 rounded-2xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">🐾</span>
              </div>
              <p className="text-3xl font-bold text-white">{pets.length}</p>
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                {user?.role === 'OWNER' ? 'Mascotas registradas' : 'Mascotas cuidadas'}
              </p>
            </div>
            <div className="p-5 rounded-2xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">💰</span>
              </div>
              <p className="text-3xl font-bold text-white">
                ${totalSpent.toLocaleString('es-CO')}
              </p>
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                {user?.role === 'OWNER' ? 'Total invertido' : 'Total ganado'}
              </p>
            </div>
          </div>
        )}

        {/* Reservas */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">Mis reservas</h2>
            <Link to="/my-bookings" style={{ color: 'var(--accent-purple-light)' }} className="text-sm hover:underline">
              Ver todas →
            </Link>
          </div>

          {/* Filtros */}
          <div className="flex gap-2 mb-4">
            {filters.map((f, i) => (
              <button key={i} onClick={() => setActiveFilter(f)}
                className="px-4 py-1.5 rounded-lg text-sm transition"
                style={{
                  backgroundColor: activeFilter === f ? 'var(--accent-purple)' : 'var(--bg-card)',
                  color: activeFilter === f ? 'white' : 'var(--text-secondary)',
                  border: '1px solid var(--border)'
                }}>
                {f} {f === 'Todas' && `(${bookings.length})`}
              </button>
            ))}
          </div>

          {/* Lista de reservas */}
          {loading ? (
            <div className="space-y-3">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="h-20 rounded-xl animate-pulse" style={{ backgroundColor: 'var(--bg-card)' }}></div>
              ))}
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="text-center py-12 rounded-2xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <p className="text-4xl mb-3">📅</p>
              <p className="font-medium text-white mb-2">No tienes reservas aún</p>
              <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                Encuentra un cuidador para tu mascota
              </p>
              <Link to="/caregivers"
                className="px-6 py-2 rounded-xl text-sm font-medium transition hover:opacity-90"
                style={{ backgroundColor: 'var(--accent-purple)', color: 'white' }}>
                Buscar cuidadores
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredBookings.slice(0, 5).map((booking) => {
                const status = statusColors[booking.status]
                return (
                  <div key={booking.id} className="p-4 rounded-xl flex items-center gap-4"
                    style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                      style={{ backgroundColor: 'var(--bg-secondary)' }}>
                      {petEmojis[booking.pet?.species] || '🐾'}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">
                        {booking.caregiver?.fullName} · {booking.pet?.name}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                        📅 {new Date(booking.startDate).toLocaleDateString('es-CO')} —{' '}
                        {new Date(booking.endDate).toLocaleDateString('es-CO')}
                        {' '}· 💰 ${booking.totalPrice?.toLocaleString('es-CO')}
                      </p>
                    </div>
                    <span className="text-xs px-3 py-1 rounded-full font-medium"
                      style={{ backgroundColor: status.bg, color: status.color }}>
                      {status.label}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Mis mascotas (solo para owners) */}
        {user?.role === 'OWNER' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">Mis mascotas</h2>
              <Link to="/my-pets" style={{ color: 'var(--accent-purple-light)' }} className="text-sm hover:underline">
                + Agregar
              </Link>
            </div>
            {pets.length === 0 ? (
              <div className="text-center py-8 rounded-2xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <p className="text-3xl mb-2">🐾</p>
                <p className="text-sm text-white mb-1">No tienes mascotas registradas</p>
                <Link to="/my-pets" style={{ color: 'var(--accent-purple-light)' }} className="text-xs hover:underline">
                  Registra tu primera mascota →
                </Link>
              </div>
            ) : (
              <div className="flex gap-3">
                {pets.map(pet => (
                  <div key={pet.id} className="flex items-center gap-3 px-4 py-3 rounded-xl"
                    style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                    <span className="text-2xl">{petEmojis[pet.species]}</span>
                    <div>
                      <p className="text-sm font-medium text-white">{pet.name}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {pet.breed || pet.species} · {pet.ageYears} años
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard