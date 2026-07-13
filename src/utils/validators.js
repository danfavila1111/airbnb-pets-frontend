export const validatePassword = (password) => {
  const errors = []

  if (password.length < 8) {
    errors.push('Mínimo 8 caracteres')
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Al menos una mayúscula')
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Al menos un número')
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Al menos un carácter especial (!@#$...)')
  }

  return errors
}

export const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}