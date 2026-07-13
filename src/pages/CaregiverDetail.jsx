import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getCaregiverById } from '../services/caregivers.service'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import Navbar from '../components/Navbar'

const petEmojis = { DOG: '🐶', CAT: '🐱', RABBIT: '🐰', BIRD: '🦜', OTHER: '🐾' }
const petLabels = { DOG: 'Perros', CAT: 'Gatos', RABBIT: 'Conejos', BIRD: 'Aves', OTHER: 'Otros' }

const CaregiverDetail = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [caregiver, setCaregiver] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [booking, setBooking] = useState({
    petId: '',
    startDate: '',
    endDate: ''
  })
  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookingError, setBookingError] = useState('')
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [pets, setPets] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [caregiverData, reviewsData] = await Promise.all([
          getCaregiverById(id),
          api.get(`/reviews/caregiver/${id}`).then(r => r.data)
        ])
        setCaregiver(caregiverData)
        setReviews(reviewsData)

        if (user?.role === 'OWNER') {
          const petsData = await api.get('/pets').then(r => r.data)
          setPets(petsData)
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id, user])

  const calculateNights = () => {
    if (!booking.startDate || !booking.endDate) return 0
    const start = new Date(booking.startDate)
    const end = new Date(booking.endDate)
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24))
  }

  const pricePerNight = 35000
  const nights = calculateNights()
  const total = nights * pricePerNight
  const platformFee = total * 0.15

  const handleBooking = async () => {
    if (!user) {
      navigate('/login')
      return
    }
    if (!booking.petId || !booking.startDate || !booking.endDate) {
      setBookingError('Completa todos los campos')
      return
    }
    setBookingError('')
    setBookingLoading(true)
    try {
      await api.post('/bookings', {
        caregiverId: caregiver.userId,
        petId: booking.petId,
        startDate: booking.startDate,
        endDate: booking.endDate
      })
      setBookingSuccess(true)
    } catch (err) {
      setBookingError(err.response?.data?.error || 'Error al crear la reserva')
    } finally {
      setBookingLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh' }}>
        <Navbar />
        <div className="max-w-6xl mx-auto px-6 pt-24">
          <div className="h-64 rounded-2xl animate-pulse" style={{ backgroundColor: 'var(--bg-card)' }}></div>
        </div>
      </div>
    )
  }

  if (!caregiver) {
    return (
      <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh' }}>
        <Navbar />
        <div className="max-w-6xl mx-auto px-6 pt-24 text-center">
          <p className="text-4xl mb-4">😕</p>
          <p className="text-white font-medium">Cuidador no encontrado</p>
          <Link to="/caregivers" className="text-sm mt-4 inline-block"
            style={{ color: 'var(--accent-purple-light)' }}>
            ← Volver a explorar
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh' }}>
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 pt-24 pb-16">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
          <Link to="/caregivers" className="hover:text-white transition">Explorar</Link>
          <span>›</span>
          <span className="text-white">{caregiver.user?.fullName}</span>
        </div>

        <div className="flex gap-8">

          {/* Columna izquierda */}
          <div className="flex-1">

            {/* Header del perfil */}
            <div className="flex items-start gap-4 mb-6">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold flex-shrink-0"
                style={{ backgroundColor: 'var(--accent-purple)' }}>
                {caregiver.user?.fullName?.charAt(0)}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">{caregiver.user?.fullName}</h1>
                <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
                  📍 {caregiver.city}
                </p>
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1 text-sm">
                    <span className="text-yellow-400">★</span>
                    <span className="text-white font-medium">{caregiver.ratingAvg > 0 ? caregiver.ratingAvg.toFixed(1) : 'Nuevo'}</span>
                    <span style={{ color: 'var(--text-muted)' }}>({reviews.length} reseñas)</span>
                  </span>
                  <span className="text-sm px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: 'rgba(16,185,129,0.15)', color: '#10b981' }}>
                    ✓ Verificado
                  </span>
                </div>
              </div>
            </div>

            {/* Galería */}
            <div className="grid grid-cols-3 gap-3 mb-8 rounded-2xl overflow-hidden">
              <div className="col-span-1 row-span-2 h-64 flex items-center justify-center"
                style={{ backgroundColor: 'hsl(240, 35%, 18%)' }}>
                <span className="text-7xl">🐶</span>
              </div>
              <div className="h-32 flex items-center justify-center"
                style={{ backgroundColor: 'hsl(260, 35%, 18%)' }}>
                <span className="text-4xl">🌿</span>
              </div>
              <div className="h-32 flex items-center justify-center"
                style={{ backgroundColor: 'hsl(220, 35%, 18%)' }}>
                <span className="text-4xl">🏠</span>
              </div>
              <div className="h-32 flex items-center justify-center"
                style={{ backgroundColor: 'hsl(200, 35%, 18%)' }}>
                <span className="text-4xl">🛋️</span>
              </div>
              <div className="h-32 flex items-center justify-center relative"
                style={{ backgroundColor: 'hsl(280, 35%, 18%)' }}>
                <span className="text-4xl">📸</span>
                <span className="absolute bottom-2 right-2 text-xs px-2 py-0.5 rounded-md"
                  style={{ backgroundColor: 'rgba(0,0,0,0.6)', color: 'white' }}>
                  +8 fotos
                </span>
              </div>
            </div>

            {/* Bio */}
            {caregiver.bio && (
              <div className="mb-8">
                <h2 className="text-lg font-bold text-white mb-3">Sobre mí</h2>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {caregiver.bio}
                </p>
              </div>
            )}

            {/* Mascotas que acepta */}
            <div className="mb-8">
              <h2 className="text-lg font-bold text-white mb-4">Mascotas que acepta</h2>
              <div className="flex gap-3">
                {caregiver.acceptedPetTypes?.map((t, i) => (
                  <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-xl"
                    style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                    <span className="text-xl">{petEmojis[t]}</span>
                    <span className="text-sm text-white">{petLabels[t]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Capacidad */}
            <div className="mb-8 p-4 rounded-2xl"
              style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <h2 className="text-lg font-bold text-white mb-3">Detalles del servicio</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-xl">🏠</span>
                  <div>
                    <p className="text-sm font-medium text-white">Capacidad máxima</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{caregiver.maxPets} mascota{caregiver.maxPets > 1 ? 's' : ''} simultánea{caregiver.maxPets > 1 ? 's' : ''}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xl">📍</span>
                  <div>
                    <p className="text-sm font-medium text-white">Ciudad</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{caregiver.city}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Reseñas */}
            <div>
              <h2 className="text-lg font-bold text-white mb-4">
                Reseñas ({reviews.length})
              </h2>
              {reviews.length === 0 ? (
                <div className="text-center py-8 rounded-2xl"
                  style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <p className="text-3xl mb-2">⭐</p>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Aún no hay reseñas
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((r, i) => (
                    <div key={i} className="p-4 rounded-xl"
                      style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                          style={{ backgroundColor: 'var(--accent-purple)' }}>
                          {r.reviewer?.fullName?.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{r.reviewer?.fullName}</p>
                          <div className="flex">
                            {[...Array(5)].map((_, j) => (
                              <span key={j} className="text-xs"
                                style={{ color: j < r.rating ? '#eab308' : 'var(--text-muted)' }}>★</span>
                            ))}
                          </div>
                        </div>
                      </div>
                      {r.comment && (
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{r.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Columna derecha - Reserva */}
          <div className="w-80 flex-shrink-0">
            <div className="sticky top-24 p-6 rounded-2xl"
              style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>

              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-2xl font-bold text-white">${pricePerNight.toLocaleString('es-CO')}</span>
                  <span className="text-sm ml-1" style={{ color: 'var(--text-muted)' }}>/ noche</span>
                </div>
                <span className="text-xs px-2 py-1 rounded-full"
                  style={{ backgroundColor: 'rgba(16,185,129,0.15)', color: '#10b981' }}>
                  • Disponible
                </span>
              </div>

              {bookingSuccess ? (
                <div className="text-center py-6">
                  <p className="text-4xl mb-3">🎉</p>
                  <p className="text-white font-medium mb-2">¡Reserva enviada!</p>
                  <p className="text-xs mb-4" style={{ color: 'var(--text-secondary)' }}>
                    El cuidador recibirá tu solicitud y la confirmará pronto.
                  </p>
                  <Link to="/dashboard"
                    className="block w-full py-2.5 rounded-xl text-sm font-medium text-center"
                    style={{ backgroundColor: 'var(--accent-purple)', color: 'white' }}>
                    Ver mis reservas
                  </Link>
                </div>
              ) : (
                <>
                  {/* Fechas */}
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div>
                      <label className="block text-xs mb-1" style={{ color: 'var(--text-muted)' }}>LLEGADA</label>
                      <input type="date"
                        value={booking.startDate}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={e => setBooking({ ...booking, startDate: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg text-xs outline-none"
                        style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'white' }} />
                    </div>
                    <div>
                      <label className="block text-xs mb-1" style={{ color: 'var(--text-muted)' }}>SALIDA</label>
                      <input type="date"
                        value={booking.endDate}
                        min={booking.startDate || new Date().toISOString().split('T')[0]}
                        onChange={e => setBooking({ ...booking, endDate: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg text-xs outline-none"
                        style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'white' }} />
                    </div>
                  </div>

                  {/* Mascota */}
                  {user?.role === 'OWNER' && (
                    <div className="mb-4">
                      <label className="block text-xs mb-1" style={{ color: 'var(--text-muted)' }}>MASCOTA</label>
                      <select
                        value={booking.petId}
                        onChange={e => setBooking({ ...booking, petId: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg text-xs outline-none"
                        style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'white' }}>
                        <option value="">Selecciona tu mascota</option>
                        {pets.map(p => (
                          <option key={p.id} value={p.id}>
                            {petEmojis[p.species]} {p.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Precio desglosado */}
                  {nights > 0 && (
                    <div className="mb-4 p-3 rounded-xl space-y-2"
                      style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                      <div className="flex justify-between text-xs">
                        <span style={{ color: 'var(--text-secondary)' }}>
                          ${pricePerNight.toLocaleString('es-CO')} × {nights} noches
                        </span>
                        <span className="text-white">${total.toLocaleString('es-CO')}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span style={{ color: 'var(--text-secondary)' }}>Tarifa de servicio</span>
                        <span className="text-white">${platformFee.toLocaleString('es-CO')}</span>
                      </div>
                      <div className="flex justify-between text-sm font-bold pt-2"
                        style={{ borderTop: '1px solid var(--border)' }}>
                        <span className="text-white">Total</span>
                        <span className="text-white">${(total + platformFee).toLocaleString('es-CO')}</span>
                      </div>
                    </div>
                  )}

                  {bookingError && (
                    <p className="text-xs mb-3 text-center" style={{ color: '#f87171' }}>{bookingError}</p>
                  )}

                  <button onClick={handleBooking} disabled={bookingLoading}
                    className="w-full py-3 rounded-xl font-medium text-sm transition hover:opacity-90 disabled:opacity-50 mb-3"
                    style={{ backgroundColor: 'var(--accent-purple)', color: 'white' }}>
                    {bookingLoading ? 'Enviando...' : user ? 'Reservar ahora →' : 'Inicia sesión para reservar'}
                  </button>

                  <button className="w-full py-3 rounded-xl text-sm transition hover:opacity-80"
                    style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
                    💬 Enviar mensaje
                  </button>

                  <p className="text-center text-xs mt-3" style={{ color: 'var(--text-muted)' }}>
                    No se hace ningún cargo hoy
                  </p>
                </>
              )}

              {/* Garantías */}
              <div className="mt-4 pt-4 space-y-2" style={{ borderTop: '1px solid var(--border)' }}>
                {[
                  '🛡️ Cuidador verificado',
                  '💳 Pago seguro — solo al confirmar',
                  '❌ Cancelación gratuita hasta 48h antes',
                  '💬 Soporte 24/7 durante la estadía',
                ].map((g, i) => (
                  <p key={i} className="text-xs" style={{ color: 'var(--text-secondary)' }}>{g}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CaregiverDetail