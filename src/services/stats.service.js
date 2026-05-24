import api from './api'

export const getStats = async () => {
  const res = await api.get('/stats')
  return res.data
}