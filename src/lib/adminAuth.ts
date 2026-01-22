const ADMIN_USERNAME = (import.meta.env.VITE_ADMIN_USERNAME || '').trim()
const ADMIN_EMAIL = (import.meta.env.VITE_ADMIN_EMAIL || '').trim()
const ADMIN_INITIAL_PASSWORD = import.meta.env.VITE_ADMIN_INITIAL_PASSWORD || ''

const PASSWORD_EXPIRY_DAYS = 30
const STORAGE_KEYS = {
  password: 'adminPassword',
  passwordUpdatedAt: 'adminPasswordUpdatedAt',
  session: 'adminSession',
  lastNoticeDate: 'adminPasswordNoticeDate',
}

const MS_PER_DAY = 24 * 60 * 60 * 1000

export const getAdminIdentity = () => ({
  username: ADMIN_USERNAME,
  email: ADMIN_EMAIL,
})

export const getStoredAdminPassword = () =>
  localStorage.getItem(STORAGE_KEYS.password) || ADMIN_INITIAL_PASSWORD

export const isAdminIdentity = (identifier: string) => {
  const value = identifier.trim().toLowerCase()
  return (
    value === ADMIN_USERNAME.toLowerCase() ||
    value === ADMIN_EMAIL.toLowerCase()
  )
}

export const validateAdminCredentials = (identifier: string, password: string) =>
  isAdminIdentity(identifier) && password === getStoredAdminPassword()

export const isInitialAdminPassword = (password: string) =>
  ADMIN_INITIAL_PASSWORD && password === ADMIN_INITIAL_PASSWORD

export const getPasswordUpdatedAt = () => {
  const value = localStorage.getItem(STORAGE_KEYS.passwordUpdatedAt)
  return value ? Number(value) : null
}

export const isPasswordExpired = () => {
  const updatedAt = getPasswordUpdatedAt()
  if (!updatedAt) return true
  const daysElapsed = Math.floor((Date.now() - updatedAt) / MS_PER_DAY)
  return daysElapsed >= PASSWORD_EXPIRY_DAYS
}

export const getPasswordDaysRemaining = () => {
  const updatedAt = getPasswordUpdatedAt()
  if (!updatedAt) return 0
  const daysElapsed = Math.floor((Date.now() - updatedAt) / MS_PER_DAY)
  return Math.max(0, PASSWORD_EXPIRY_DAYS - daysElapsed)
}

export const needsPasswordReset = (passwordUsed?: string) => {
  if (!getPasswordUpdatedAt()) return true
  if (passwordUsed && isInitialAdminPassword(passwordUsed)) return true
  return isPasswordExpired()
}

export const setNewAdminPassword = (password: string) => {
  localStorage.setItem(STORAGE_KEYS.password, password)
  localStorage.setItem(STORAGE_KEYS.passwordUpdatedAt, String(Date.now()))
}

export const setAdminSession = () => {
  localStorage.setItem(
    STORAGE_KEYS.session,
    JSON.stringify({ loggedIn: true, at: Date.now() })
  )
}

export const clearAdminSession = () => {
  localStorage.removeItem(STORAGE_KEYS.session)
}

export const isAdminLoggedIn = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.session)
    if (!raw) return false
    const parsed = JSON.parse(raw)
    return Boolean(parsed?.loggedIn) && !isPasswordExpired()
  } catch {
    return false
  }
}

export const getLastNoticeDate = () =>
  localStorage.getItem(STORAGE_KEYS.lastNoticeDate)

export const setLastNoticeDate = (value: string) =>
  localStorage.setItem(STORAGE_KEYS.lastNoticeDate, value)
