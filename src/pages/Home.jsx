import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import { getStats } from '../services/stats.service'
import { getCaregivers } from '../services/caregivers.service'

const petTypes = [
  { emoji: '🐶', label: 'Perros', value: 'DOG' },
  { emoji: '🐱', label: 'Gatos', value: 'CAT' },
  { emoji: '🐰', label: 'Conejos', value: 'RABBIT' },
  { emoji: '🦜', label: 'Aves', value: 'BIRD' },
  { emoji: '···', label: 'Otros', value: 'OTHER' },
]

const petEmojis = { DOG: '🐶', CAT: '🐱', RABBIT: '🐰', BIRD: '🦜', OTHER: '🐾' }

const Home = () => {
  const [stats, setStats] = useState(null)
  const [caregivers, setCaregivers] = useState([])
  const [activePet, setActivePet] = useState('DOG')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, caregiversData] = await Promise.all([
          getStats(),
          getCaregivers({ petType: 'DOG' })
        ])
        setStats(statsData)
        setCaregivers(caregiversData.slice(0, 4))
      } catch (error) {
        console.error('Error cargando datos:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handlePetFilter = async (petType) => {
    setActivePet(petType)
    try {
      const data = await getCaregivers({ petType })
      setCaregivers(data.slice(0, 4))
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh' }}>
      <Navbar />

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-32 pb-20 flex items-center justify-between gap-12">

        {/* Lado izquierdo */}
        <div className="flex-1">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-8"
            style={{ backgroundColor: 'rgba(124,58,237,0.15)', color: '#8b5cf6', border: '1px solid rgba(124,58,237,0.3)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block"></span>
            {loading ? '...' : `+${stats?.totalCaregivers || 1200} cuidadores verificados en Colombia`}
          </div>

          <h1 className="text-6xl font-bold leading-tight mb-6">
            El hogar que tu<br />
            mascota{' '}
            <span style={{ color: '#8b5cf6' }}>merece</span>
          </h1>

          <p className="text-lg mb-10" style={{ color: 'var(--text-secondary)' }}>
            Conectamos dueños de mascotas con cuidadores de<br />
            confianza. Tu peludito feliz. Tú, tranquilo.
          </p>

          {/* Buscador */}
          <div className="rounded-2xl p-4 mb-8 flex items-center gap-4"
            style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div className="flex-1 flex items-center gap-3 px-3">
              <span>🐾</span>
              <div>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>TIPO DE MASCOTA</p>
                <p className="text-sm font-medium text-white">
                  {petTypes.find(p => p.value === activePet)?.label || 'Perros'}
                </p>
              </div>
            </div>
            <div style={{ width: '1px', height: '40px', backgroundColor: 'var(--border)' }}></div>
            <div className="flex-1 flex items-center gap-3 px-3">
              <span>📍</span>
              <div>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>CIUDAD</p>
                <p className="text-sm font-medium text-white">Bogotá, Colombia</p>
              </div>
            </div>
            <div style={{ width: '1px', height: '40px', backgroundColor: 'var(--border)' }}></div>
            <div className="flex-1 flex items-center gap-3 px-3">
              <span>📅</span>
              <div>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>FECHAS</p>
                <p className="text-sm font-medium text-white">15 – 22 Jun</p>
              </div>
            </div>
            <Link to={`/caregivers?petType=${activePet}`}
              className="px-6 py-3 rounded-xl font-medium text-sm transition hover:opacity-90"
              style={{ backgroundColor: 'var(--accent-purple)', color: 'white' }}>
              Buscar →
            </Link>
          </div>

          {/* Pills de tipos */}
          <div className="flex items-center gap-2 mb-10">
            {petTypes.map((p, i) => (
              <button key={i}
                onClick={() => handlePetFilter(p.value)}
                className="px-4 py-2 rounded-full text-sm transition hover:opacity-80"
                style={{
                  backgroundColor: activePet === p.value ? 'var(--accent-purple)' : 'var(--bg-card)',
                  color: activePet === p.value ? 'white' : 'var(--text-secondary)',
                  border: '1px solid var(--border)'
                }}>
                {p.emoji} {p.label}
              </button>
            ))}
          </div>

          {/* Stats del backend */}
          <div className="flex items-center gap-10">
            {loading ? (
              <p style={{ color: 'var(--text-muted)' }}>Cargando...</p>
            ) : (
              <>
                <div>
                  <p className="text-2xl font-bold text-white">{stats?.avgRating}★</p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Calificación promedio</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stats?.satisfactionPercent}%</p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Satisfacción garantizada</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stats?.totalPets}+</p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Mascotas cuidadas</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Lado derecho */}
        <div className="flex-1 flex justify-center">
          <div className="relative w-96 h-80 rounded-3xl flex items-center justify-center"
            style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <span className="text-8xl">🐶</span>
            <div className="absolute top-4 right-4 px-3 py-2 rounded-xl text-center"
              style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
              <p className="text-xs text-yellow-400">★★★★★</p>
              <p className="text-lg font-bold text-white">{stats?.avgRating || '4.9'}</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>reseñas</p>
            </div>
            <div className="absolute bottom-4 left-4 px-4 py-3 rounded-xl"
              style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
              <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Próxima reserva</p>
              <p className="text-sm font-bold text-white">Luna 🐶</p>
              <p className="text-xs" style={{ color: '#8b5cf6' }}>Mañana, 9:00 AM — 3 noches</p>
            </div>
          </div>
        </div>
      </section>

      {/* Cuidadores destacados */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white">Cuidadores destacados cerca de ti</h2>
          <Link to="/caregivers" style={{ color: '#8b5cf6' }} className="text-sm hover:underline">
            Ver todos →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-2xl h-64 animate-pulse"
                style={{ backgroundColor: 'var(--bg-card)' }}></div>
            ))}
          </div>
        ) : caregivers.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🐾</p>
            <p style={{ color: 'var(--text-secondary)' }}>
              No hay cuidadores disponibles aún.{' '}
              <Link to="/register" style={{ color: '#8b5cf6' }}>¡Sé el primero!</Link>
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-4">
            {caregivers.map((c, i) => (
              <Link to={`/caregivers/${c.id}`} key={c.id}
                className="rounded-2xl overflow-hidden transition hover:scale-105"
                style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <div className="h-48 flex items-center justify-center relative"
                  style={{ backgroundColor: `hsl(${240 + i * 20}, 40%, 20%)` }}>
                  {i === 0 && (
                    <span className="absolute top-3 left-3 text-xs px-2 py-1 rounded-md font-bold"
                      style={{ backgroundColor: 'var(--accent-purple)', color: 'white' }}>
                      TOP
                    </span>
                  )}
                  <span className="text-6xl">
                    {petEmojis[c.acceptedPetTypes?.[0]] || '🐾'}
                  </span>
                  <span className="absolute bottom-3 right-3 text-xs px-2 py-1 rounded-md font-medium"
                    style={{ backgroundColor: 'rgba(0,0,0,0.6)', color: 'white' }}>
                    $35k/noche
                  </span>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-yellow-400 text-xs">★★★★★</span>
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {c.ratingAvg || '4.9'}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-white">{c.user?.fullName}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{c.city}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default Home