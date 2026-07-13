import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getMyBookings, cancelBooking } from '../services/bookings.service'
import api from '../services/api'

const petEmojis = { DOG: '🐶', CAT: '🐱', RABBIT: '🐰', BIRD: '🦜', OTHER: '🐾' }

const statusConfig = {
  PENDING: { label: 'Pendiente', color: '#eab308', bg: 'rgba(234,179,8,0.15)' },
  CONFIRMED: { label: 'Confirmada', color: '#10b981', bg: 'rgba(16,185,129,0.15)' },
  ACTIVE: { label: 'Activa', color: '#3b82f6', bg: 'rgba(59,130,246,0.15)' },
  COMPLETED: { label: 'Completada', color: '#64748b', bg: 'rgba(100,116,139,0.15)' },
  CANCELLED: { label: 'Cancelada', color: '#ef4444', bg: 'rgba(239,68,68,0.15)' },
}

const MyBookings = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('Todas')
  const [cancellingId, setCancellingId] = useState(null)
  const [reviewingId, setReviewingId] = useState(null)
  const [review, setReview] = useState({ rating: 5, comment: '' })
  const [reviewLoading, setReviewLoading] = useState(false)

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const data = await getMyBookings()
      setBookings(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async (id) => {
    if (!confirm('¿Estás seguro de que quieres cancelar esta reserva?')) return
    setCancellingId(id)
    try {
      await cancelBooking(id, 'Cancelado por el usuario')
      fetchBookings()
    } catch (err) {
      console.error(err)
    } finally {
      setCancellingId(null)
    }
  }

  const handleReview = async (bookingId) => {
    setReviewLoading(true)
    try {
      await api.post('/reviews', {
        bookingId,
        rating: review.rating,
        comment: review.comment
      })
      setReviewingId(null)
      setReview({ rating: 5, comment: '' })
      fetchBookings()
    } catch (err) {
      console.error(err)
    } finally {
      setReviewLoading(false)
    }
  }

  const filters = ['Todas', 'Pendientes', 'Confirmadas', 'Completadas', 'Canceladas']

  const filteredBookings = bookings.filter(b => {
    if (activeFilter === 'Todas') return true
    if (activeFilter === 'Pendientes') return b.status === 'PENDING'
    if (activeFilter === 'Confirmadas') return b.status === 'CONFIRMED'
    if (activeFilter === 'Completadas') return b.status === 'COMPLETED'
    if (activeFilter === 'Canceladas') return b.status === 'CANCELLED'
    return true
  })

  const nights = (start, end) => {
    return Math.ceil((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24))
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--bg-primary)' }}>

      {/* Sidebar */}
      <div className="w-56 flex flex-col h-screen fixed left-0 top-0"
        style={{ backgroundColor: 'var(--bg-secondary)', borderRight: '1px solid var(--border)' }}>
        <div className="p-4 flex items-center gap-2" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: 'var(--accent-purple)' }}>
            <span className="text-white text-xs">🐾</span>
          </div>
          <span className="font-bold text-white">AirbnPets</span>
        </div>
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
        <div className="flex-1 p-3">
          <p className="text-xs font-medium mb-2 px-2" style={{ color: 'var(--text-muted)' }}>PRINCIPAL</p>
          {[
            { label: 'Inicio', icon: '🏠', path: '/dashboard' },
            { label: 'Mis reservas', icon: '📅', path: '/my-bookings', active: true },
            { label: 'Mis mascotas', icon: '🐾', path: '/my-pets' },
          ].map((l, i) => (
            <Link key={i} to={l.path}
              className="flex items-center gap-3 px-3 py-2 rounded-lg mb-1 text-sm transition"
              style={{
                backgroundColor: l.active ? 'var(--accent-purple)' : 'transparent',
                color: l.active ? 'white' : 'var(--text-secondary)'
              }}>
              <span>{l.icon}</span>
              <span>{l.label}</span>
            </Link>
          ))}
        </div>
        <div className="p-3" style={{ borderTop: '1px solid var(--border)' }}>
          <button onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition hover:bg-red-500 hover:text-white"
            style={{ color: 'var(--text-secondary)' }}>
            <span>🚪</span>
            <span>Cerrar sesión</span>
          </button>
        </div>
      </div>

      {/* Contenido */}
      <div className="flex-1 ml-56 p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-white">Mis reservas 📅</h1>
          <Link to="/caregivers"
            className="px-4 py-2 rounded-xl text-sm font-medium transition hover:opacity-90"
            style={{ backgroundColor: 'var(--accent-purple)', color: 'white' }}>
            + Nueva reserva
          </Link>
        </div>

        {/* Filtros */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {filters.map((f, i) => (
            <button key={i} onClick={() => setActiveFilter(f)}
              className="px-4 py-1.5 rounded-lg text-sm transition"
              style={{
                backgroundColor: activeFilter === f ? 'var(--accent-purple)' : 'var(--bg-card)',
                color: activeFilter === f ? 'white' : 'var(--text-secondary)',
                border: '1px solid var(--border)'
              }}>
              {f}
            </button>
          ))}
        </div>

        {/* Lista */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 rounded-2xl animate-pulse"
                style={{ backgroundColor: 'var(--bg-card)' }}></div>
            ))}
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-20 rounded-2xl"
            style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <p className="text-5xl mb-4">📅</p>
            <p className="text-white font-medium mb-2">No tienes reservas</p>
            <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
              Encuentra un cuidador para tu mascota
            </p>
            <Link to="/caregivers"
              className="px-6 py-2.5 rounded-xl text-sm font-medium"
              style={{ backgroundColor: 'var(--accent-purple)', color: 'white' }}>
              Buscar cuidadores
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map(booking => {
              const status = statusConfig[booking.status]
              const n = nights(booking.startDate, booking.endDate)
              return (
                <div key={booking.id}>
                  <div className="p-5 rounded-2xl"
                    style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                    <div className="flex items-center gap-4">

                      {/* Emoji mascota */}
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                        style={{ backgroundColor: 'var(--bg-secondary)' }}>
                        {petEmojis[booking.pet?.species] || '🐾'}
                      </div>

                      {/* Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-medium text-white">
                            {user?.role === 'OWNER'
                              ? booking.caregiver?.fullName
                              : booking.owner?.fullName}
                            {' · '}{booking.pet?.name}
                          </p>
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                            style={{ backgroundColor: status.bg, color: status.color }}>
                            {status.label}
                          </span>
                        </div>
                        <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
                          📅 {new Date(booking.startDate).toLocaleDateString('es-CO')} —{' '}
                          {new Date(booking.endDate).toLocaleDateString('es-CO')}
                          {' '}· {n} noche{n !== 1 ? 's' : ''}
                        </p>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                          💰 ${booking.totalPrice?.toLocaleString('es-CO')} total
                        </p>
                      </div>

                      {/* Acciones */}
                      <div className="flex gap-2 flex-shrink-0">
                        {booking.status === 'COMPLETED' && user?.role === 'OWNER' && (
                          <button
                            onClick={() => setReviewingId(reviewingId === booking.id ? null : booking.id)}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium transition"
                            style={{ backgroundColor: 'rgba(234,179,8,0.15)', color: '#eab308' }}>
                            ⭐ Dejar reseña
                          </button>
                        )}
                        {['PENDING', 'CONFIRMED'].includes(booking.status) && (
                          <button
                            onClick={() => handleCancel(booking.id)}
                            disabled={cancellingId === booking.id}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium transition disabled:opacity-50"
                            style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#f87171' }}>
                            {cancellingId === booking.id ? 'Cancelando...' : 'Cancelar'}
                          </button>
                        )}
                        <Link to={`/caregivers/${booking.caregiverId}`}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium transition"
                          style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
                          Ver cuidador
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Formulario de reseña */}
                  {reviewingId === booking.id && (
                    <div className="mt-2 p-5 rounded-2xl"
                      style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                      <h3 className="text-sm font-medium text-white mb-4">Dejar reseña para {booking.caregiver?.fullName}</h3>

                      {/* Estrellas */}
                      <div className="flex gap-2 mb-4">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button key={star}
                            onClick={() => setReview({ ...review, rating: star })}
                            className="text-2xl transition hover:scale-110">
                            <span style={{ color: star <= review.rating ? '#eab308' : 'var(--text-muted)' }}>★</span>
                          </button>
                        ))}
                        <span className="text-sm ml-2 self-center" style={{ color: 'var(--text-muted)' }}>
                          {review.rating}/5
                        </span>
                      </div>

                      <textarea
                        value={review.comment}
                        onChange={e => setReview({ ...review, comment: e.target.value })}
                        placeholder="Cuéntanos cómo fue la experiencia..."
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none mb-4"
                        style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', color: 'white' }}
                      />

                      <div className="flex gap-3">
                        <button onClick={() => handleReview(booking.id)} disabled={reviewLoading}
                          className="px-4 py-2 rounded-xl text-sm font-medium transition hover:opacity-90 disabled:opacity-50"
                          style={{ backgroundColor: 'var(--accent-purple)', color: 'white' }}>
                          {reviewLoading ? 'Enviando...' : 'Enviar reseña'}
                        </button>
                        <button onClick={() => setReviewingId(null)}
                          className="px-4 py-2 rounded-xl text-sm transition"
                          style={{ color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyBookings