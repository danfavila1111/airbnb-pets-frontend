import api from './api'

export const getCaregivers = async (filters = {}) => {
  const params = new URLSearchParams()
  if (filters.city) params.append('city', filters.city)
  if (filters.petType) params.append('petType', filters.petType)
  if (filters.minRating) params.append('minRating', filters.minRating)
  const res = await api.get(`/caregivers?${params.toString()}`)
  return res.data
}

export const getCaregiverById = async (id) => {
  const res = await api.get(`/caregivers/${id}`)
  return res.data
}