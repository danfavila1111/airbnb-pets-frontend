import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getCaregivers } from '../services/caregivers.service'
import Navbar from '../components/Navbar'

const petTypes = [
  { emoji: '🐶', label: 'Perros', value: 'DOG' },
  { emoji: '🐱', label: 'Gatos', value: 'CAT' },
  { emoji: '🐰', label: 'Conejos', value: 'RABBIT' },
  { emoji: '🦜', label: 'Aves', value: 'BIRD' },
  { emoji: '🐾', label: 'Otros', value: 'OTHER' },
]

const petEmojis = { DOG: '🐶', CAT: '🐱', RABBIT: '🐰', BIRD: '🦜', OTHER: '🐾' }

const petLabels = { DOG: 'Perros', CAT: 'Gatos', RABBIT: 'Conejos', BIRD: 'Aves', OTHER: 'Otros' }

const Caregivers = () => {
  const [caregivers, setCaregivers] = useState([])
  const [loading, setLoading] = useState(true)
  const [activePet, setActivePet] = useState('')
  const [city, setCity] = useState('')
  const [minRating, setMinRating] = useState('')
  const [search, setSearch] = useState('')

  const fetchCaregivers = async (filters = {}) => {
    setLoading(true)
    try {
      const data = await getCaregivers(filters)
      setCaregivers(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCaregivers()
  }, [])

  const handleFilter = () => {
    fetchCaregivers({
      petType: activePet || undefined,
      city: city || undefined,
      minRating: minRating || undefined,
    })
  }

  const handleClearFilters = () => {
    setActivePet('')
    setCity('')
    setMinRating('')
    fetchCaregivers()
  }

  const filtered = caregivers.filter(c =>
    search === '' ||
    c.user?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    c.city?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh' }}>
      <Navbar />

      {/* Barra de búsqueda superior */}
      <div className="pt-16" style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <div className="flex-1 flex items-center gap-3 px-4 py-2.5 rounded-xl"
            style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <span style={{ color: 'var(--text-muted)' }}>🔍</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar cuidadores en Bogotá..."
              className="flex-1 bg-transparent text-sm outline-none text-white"
              style={{ color: 'white' }}
            />
          </div>

          {/* Pills de tipo de mascota */}
          <div className="flex items-center gap-2">
            {petTypes.map((p, i) => (
              <button key={i}
                onClick={() => setActivePet(activePet === p.value ? '' : p.value)}
                className="px-3 py-1.5 rounded-full text-xs font-medium transition"
                style={{
                  backgroundColor: activePet === p.value ? 'var(--accent-purple)' : 'var(--bg-card)',
                  color: activePet === p.value ? 'white' : 'var(--text-secondary)',
                  border: '1px solid var(--border)'
                }}>
                {p.emoji} {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 flex gap-6">

        {/* Sidebar de filtros */}
        <div className="w-56 flex-shrink-0">
          <div className="sticky top-24 space-y-6">

            {/* Ciudad */}
            <div>
              <p className="text-xs font-medium mb-3" style={{ color: 'var(--text-muted)' }}>CIUDAD</p>
              <input
                value={city}
                onChange={e => setCity(e.target.value)}
                placeholder="Ej. Bogotá"
                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', color: 'white' }}
              />
            </div>

            {/* Tipo de mascota */}
            <div>
              <p className="text-xs font-medium mb-3" style={{ color: 'var(--text-muted)' }}>TIPO DE MASCOTA</p>
              <div className="space-y-2">
                {petTypes.map((p, i) => (
                  <button key={i}
                    onClick={() => setActivePet(activePet === p.value ? '' : p.value)}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition"
                    style={{
                      backgroundColor: activePet === p.value ? 'rgba(124,58,237,0.15)' : 'transparent',
                      color: activePet === p.value ? '#8b5cf6' : 'var(--text-secondary)',
                      border: activePet === p.value ? '1px solid rgba(124,58,237,0.3)' : '1px solid transparent'
                    }}>
                    <span>{p.emoji}</span>
                    <span>{p.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Calificación mínima */}
            <div>
              <p className="text-xs font-medium mb-3" style={{ color: 'var(--text-muted)' }}>CALIFICACIÓN MÍNIMA</p>
              <div className="space-y-2">
                {['4', '3', '2'].map(r => (
                  <button key={r}
                    onClick={() => setMinRating(minRating === r ? '' : r)}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition"
                    style={{
                      backgroundColor: minRating === r ? 'rgba(124,58,237,0.15)' : 'transparent',
                      color: minRating === r ? '#8b5cf6' : 'var(--text-secondary)',
                      border: minRating === r ? '1px solid rgba(124,58,237,0.3)' : '1px solid transparent'
                    }}>
                    {'★'.repeat(parseInt(r))}{'☆'.repeat(5 - parseInt(r))} {r}+
                  </button>
                ))}
              </div>
            </div>

            {/* Botones */}
            <button onClick={handleFilter}
              className="w-full py-2.5 rounded-xl text-sm font-medium transition hover:opacity-90"
              style={{ backgroundColor: 'var(--accent-purple)', color: 'white' }}>
              Aplicar filtros
            </button>
            <button onClick={handleClearFilters}
              className="w-full py-2.5 rounded-xl text-sm transition"
              style={{ color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
              Limpiar todo
            </button>
          </div>
        </div>

        {/* Grid de cuidadores */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Mostrando <span className="text-white font-medium">{filtered.length}</span> cuidadores
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 rounded-2xl animate-pulse"
                  style={{ backgroundColor: 'var(--bg-card)' }}></div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-5xl mb-4">🔍</p>
              <p className="text-white font-medium mb-2">No se encontraron cuidadores</p>
              <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                Intenta con otros filtros
              </p>
              <button onClick={handleClearFilters}
                className="px-6 py-2 rounded-xl text-sm font-medium"
                style={{ backgroundColor: 'var(--accent-purple)', color: 'white' }}>
                Limpiar filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {filtered.map((c, i) => (
                <Link to={`/caregivers/${c.id}`} key={c.id}
                  className="rounded-2xl overflow-hidden transition hover:scale-105 hover:shadow-lg"
                  style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>

                  {/* Imagen */}
                  <div className="h-44 flex items-center justify-center relative"
                    style={{ backgroundColor: `hsl(${240 + i * 25}, 35%, 18%)` }}>
                    {i === 0 && (
                      <span className="absolute top-3 left-3 text-xs px-2 py-1 rounded-md font-bold"
                        style={{ backgroundColor: 'var(--accent-purple)', color: 'white' }}>
                        TOP
                      </span>
                    )}
                    {c.isNew && (
                      <span className="absolute top-3 left-3 text-xs px-2 py-1 rounded-md font-bold"
                        style={{ backgroundColor: 'var(--accent-green)', color: 'white' }}>
                        NUEVO
                      </span>
                    )}
                    <span className="text-5xl">
                      {petEmojis[c.acceptedPetTypes?.[0]] || '🐾'}
                    </span>
                    <span className="absolute bottom-3 right-3 text-xs px-2 py-1 rounded-md font-medium"
                      style={{ backgroundColor: 'rgba(0,0,0,0.6)', color: 'white' }}>
                      $35k/noche
                    </span>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-white">{c.user?.fullName}</p>
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        ★ {c.ratingAvg > 0 ? c.ratingAvg.toFixed(1) : 'Nuevo'}
                      </span>
                    </div>
                    <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
                      📍 {c.city}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {c.acceptedPetTypes?.slice(0, 3).map((t, j) => (
                        <span key={j} className="text-xs px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
                          {petEmojis[t]} {petLabels[t]}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Caregivers