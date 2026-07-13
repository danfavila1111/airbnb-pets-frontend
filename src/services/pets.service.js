import api from './api'

export const getMyPets = async () => {
  const res = await api.get('/pets')
  return res.data
}

export const createPet = async (data) => {
  const res = await api.post('/pets', data)
  return res.data
}

export const updatePet = async (id, data) => {
  const res = await api.put(`/pets/${id}`, data)
  return res.data
}

export const deletePet = async (id) => {
  const res = await api.delete(`/pets/${id}`)
  return res.data
}