import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { getMyPets, createPet, deletePet } from '../services/pets.service'
import { Link } from 'react-router-dom'

const petEmojis = { DOG: '🐶', CAT: '🐱', RABBIT: '🐰', BIRD: '🦜', OTHER: '🐾' }
const petLabels = { DOG: 'Perro', CAT: 'Gato', RABBIT: 'Conejo', BIRD: 'Ave', OTHER: 'Otro' }

const petTypes = [
  { value: 'DOG', emoji: '🐶', label: 'Perro' },
  { value: 'CAT', emoji: '🐱', label: 'Gato' },
  { value: 'RABBIT', emoji: '🐰', label: 'Conejo' },
  { value: 'BIRD', emoji: '🦜', label: 'Ave' },
  { value: 'OTHER', emoji: '🐾', label: 'Otro' },
]

const MyPets = () => {
  const { user, logout } = useAuth()
  const [pets, setPets] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formLoading, setFormLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '',
    species: 'DOG',
    breed: '',
    ageYears: '',
    weightKg: '',
    specialNeeds: '',
  })

  useEffect(() => {
    fetchPets()
  }, [])

  const fetchPets = async () => {
    try {
      const data = await getMyPets()
      setPets(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    setError('')
    if (!form.name.trim()) {
      setError('El nombre es requerido')
      return
    }
    setFormLoading(true)
    try {
      await createPet({
        name: form.name,
        species: form.species,
        breed: form.breed || undefined,
        ageYears: form.ageYears ? parseInt(form.ageYears) : undefined,
        weightKg: form.weightKg ? parseFloat(form.weightKg) : undefined,
        specialNeeds: form.specialNeeds || undefined,
      })
      setForm({ name: '', species: 'DOG', breed: '', ageYears: '', weightKg: '', specialNeeds: '' })
      setShowForm(false)
      fetchPets()
    } catch (err) {
      setError(err.response?.data?.error || 'Error al registrar la mascota')
    } finally {
      setFormLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta mascota?')) return
    try {
      await deletePet(id)
      fetchPets()
    } catch (err) {
      console.error(err)
    }
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
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Dueño de mascota</p>
          </div>
        </div>
        <div className="flex-1 p-3">
          <p className="text-xs font-medium mb-2 px-2" style={{ color: 'var(--text-muted)' }}>PRINCIPAL</p>
          {[
            { label: 'Inicio', icon: '🏠', path: '/dashboard' },
            { label: 'Mis reservas', icon: '📅', path: '/my-bookings' },
            { label: 'Mis mascotas', icon: '🐾', path: '/my-pets', active: true },
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
          <h1 className="text-2xl font-bold text-white">Mis mascotas 🐾</h1>
          <button onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 rounded-xl text-sm font-medium transition hover:opacity-90"
            style={{ backgroundColor: 'var(--accent-purple)', color: 'white' }}>
            {showForm ? 'Cancelar' : '+ Agregar mascota'}
          </button>
        </div>

        {/* Formulario */}
        {showForm && (
          <div className="p-6 rounded-2xl mb-8"
            style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <h2 className="text-lg font-bold text-white mb-6">Nueva mascota</h2>

            {error && (
              <div className="mb-4 p-3 rounded-lg text-sm"
                style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)' }}>
                {error}
              </div>
            )}

            {/* Tipo de mascota */}
            <div className="mb-6">
              <label className="block text-xs font-medium mb-3" style={{ color: 'var(--text-muted)' }}>
                TIPO DE MASCOTA
              </label>
              <div className="flex gap-3">
                {petTypes.map(p => (
                  <button key={p.value} onClick={() => setForm({ ...form, species: p.value })}
                    className="flex flex-col items-center gap-1 px-4 py-3 rounded-xl transition"
                    style={{
                      backgroundColor: form.species === p.value ? 'rgba(124,58,237,0.15)' : 'var(--bg-secondary)',
                      border: form.species === p.value ? '2px solid var(--accent-purple)' : '1px solid var(--border)',
                      color: form.species === p.value ? '#8b5cf6' : 'var(--text-secondary)'
                    }}>
                    <span className="text-2xl">{p.emoji}</span>
                    <span className="text-xs">{p.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
                  NOMBRE *
                </label>
                <input name="name" value={form.name} onChange={handleChange}
                  placeholder="Nombre de tu mascota"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                  style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'white' }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
                  RAZA
                </label>
                <input name="breed" value={form.breed} onChange={handleChange}
                  placeholder="Ej. Labrador, Siamés..."
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                  style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'white' }} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
                  EDAD (AÑOS)
                </label>
                <input name="ageYears" type="number" value={form.ageYears} onChange={handleChange}
                  placeholder="Ej. 3"
                  min="0" max="30"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                  style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'white' }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
                  PESO (KG)
                </label>
                <input name="weightKg" type="number" value={form.weightKg} onChange={handleChange}
                  placeholder="Ej. 5.5"
                  min="0" step="0.1"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                  style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'white' }} />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
                NECESIDADES ESPECIALES
              </label>
              <textarea name="specialNeeds" value={form.specialNeeds} onChange={handleChange}
                placeholder="Medicamentos, alergias, cuidados especiales..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
                style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'white' }} />
            </div>

            <button onClick={handleSubmit} disabled={formLoading}
              className="px-6 py-3 rounded-xl font-medium text-sm transition hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: 'var(--accent-purple)', color: 'white' }}>
              {formLoading ? 'Guardando...' : 'Guardar mascota →'}
            </button>
          </div>
        )}

        {/* Lista de mascotas */}
        {loading ? (
          <div className="grid grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-48 rounded-2xl animate-pulse"
                style={{ backgroundColor: 'var(--bg-card)' }}></div>
            ))}
          </div>
        ) : pets.length === 0 ? (
          <div className="text-center py-20 rounded-2xl"
            style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <p className="text-5xl mb-4">🐾</p>
            <p className="text-white font-medium mb-2">No tienes mascotas registradas</p>
            <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
              Agrega tu primera mascota para poder hacer reservas
            </p>
            <button onClick={() => setShowForm(true)}
              className="px-6 py-2.5 rounded-xl text-sm font-medium"
              style={{ backgroundColor: 'var(--accent-purple)', color: 'white' }}>
              + Agregar mascota
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {pets.map(pet => (
              <div key={pet.id} className="p-5 rounded-2xl"
                style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
                    style={{ backgroundColor: 'var(--bg-secondary)' }}>
                    {petEmojis[pet.species]}
                  </div>
                  <button onClick={() => handleDelete(pet.id)}
                    className="text-xs px-2 py-1 rounded-lg transition hover:opacity-80"
                    style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#f87171' }}>
                    Eliminar
                  </button>
                </div>
                <h3 className="text-lg font-bold text-white mb-1">{pet.name}</h3>
                <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
                  {petLabels[pet.species]}{pet.breed ? ` · ${pet.breed}` : ''}
                </p>
                <div className="flex gap-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {pet.ageYears && <span>🎂 {pet.ageYears} años</span>}
                  {pet.weightKg && <span>⚖️ {pet.weightKg} kg</span>}
                </div>
                {pet.specialNeeds && (
                  <div className="mt-3 p-2 rounded-lg"
                    style={{ backgroundColor: 'var(--bg-secondary)' }}>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      💊 {pet.specialNeeds}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyPets