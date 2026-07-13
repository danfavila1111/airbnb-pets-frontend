import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'

// Pages
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Caregivers from './pages/Caregivers'
import CaregiverDetail from './pages/CaregiverDetail'
import MyPets from './pages/MyPets'
import MyBookings from './pages/MyBookings'
import CaregiverProfile from './pages/CaregiverProfile'
import PublicRoute from './components/PublicRoute'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={
      <PublicRoute>
        <Login />
      </PublicRoute>
        } />
    <Route path="/register" element={
      <PublicRoute>
        <Register />
      </PublicRoute>
} />
      <Route path="/caregivers" element={<Caregivers />} />
      <Route path="/caregivers/:id" element={<CaregiverDetail />} />

      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />

      <Route path="/my-pets" element={
        <ProtectedRoute roles={['OWNER']}>
          <MyPets />
        </ProtectedRoute>
      } />

      <Route path="/my-bookings" element={
        <ProtectedRoute>
          <MyBookings />
        </ProtectedRoute>
      } />

      <Route path="/caregiver-profile" element={
        <ProtectedRoute roles={['CAREGIVER']}>
          <CaregiverProfile />
        </ProtectedRoute>
      } />
    </Routes>
  )
}

export default App