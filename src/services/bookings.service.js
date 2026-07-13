import api from './api'

export const getMyBookings = async () => {
  const res = await api.get('/bookings')
  return res.data
}

export const confirmBooking = async (id) => {
  const res = await api.patch(`/bookings/${id}/confirm`)
  return res.data
}

export const cancelBooking = async (id, reason) => {
  const res = await api.patch(`/bookings/${id}/cancel`, { reason })
  return res.data
}