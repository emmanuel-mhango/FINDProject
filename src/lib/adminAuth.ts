const ADMIN_USERNAME = (import.meta.env.VITE_ADMIN_USERNAME || '').trim()
const ADMIN_EMAIL = (import.meta.env.VITE_ADMIN_EMAIL || '').trim()
const ADMIN_INITIAL_PASSWORD = import.meta.env.VITE_ADMIN_INITIAL_PASSWORD || ''
const ADMIN_USERNAME_2 = (import.meta.env.VITE_ADMIN_USERNAME_2 || '').trim()
const ADMIN_EMAIL_2 = (import.meta.env.VITE_ADMIN_EMAIL_2 || '').trim()
const ADMIN_INITIAL_PASSWORD_2 = import.meta.env.VITE_ADMIN_INITIAL_PASSWORD_2 || ''

const PASSWORD_EXPIRY_DAYS = 30
const STORAGE_KEYS = {
  password: 'adminPassword',
  passwordUpdatedAt: 'adminPasswordUpdatedAt',
  session: 'adminSession',
  lastNoticeDate: 'adminPasswordNoticeDate',
}

const MS_PER_DAY = 24 * 60 * 60 * 1000

type AdminIdentity = {
  username: string
  email: string
  initialPassword: string
}

const ADMIN_USERS: AdminIdentity[] = [
  { username: ADMIN_USERNAME, email: ADMIN_EMAIL, initialPassword: ADMIN_INITIAL_PASSWORD },
  { username: ADMIN_USERNAME_2, email: ADMIN_EMAIL_2, initialPassword: ADMIN_INITIAL_PASSWORD_2 },
].filter((admin) => admin.username || admin.email)

const normalizeIdentifier = (value: string) => value.trim().toLowerCase()

const getAdminKey = (admin: AdminIdentity) =>
  (admin.email || admin.username || 'default').trim().toLowerCase()

const findAdmin = (identifier: string) => {
  const value = normalizeIdentifier(identifier)
  return ADMIN_USERS.find((admin) => {
    if (admin.username && value === normalizeIdentifier(admin.username)) return true
    if (admin.email && value === normalizeIdentifier(admin.email)) return true
    return false
  })
}

export const getAdminIdentity = () => ({
  username: ADMIN_USERNAME,
  email: ADMIN_EMAIL,
})

export const getAdminIdentities = () => ADMIN_USERS

export const hasAdminIdentity = () => ADMIN_USERS.length > 0

export const getStoredAdminPassword = (identifier: string) => {
  const admin = findAdmin(identifier)
  if (!admin) return ''
  const key = getAdminKey(admin)
  return (
    localStorage.getItem(`${STORAGE_KEYS.password}:${key}`) ||
    admin.initialPassword
  )
}

export const isAdminIdentity = (identifier: string) => {
  const value = normalizeIdentifier(identifier)
  return ADMIN_USERS.some(
    (admin) =>
      (admin.username && value === normalizeIdentifier(admin.username)) ||
      (admin.email && value === normalizeIdentifier(admin.email))
  )
}

export const validateAdminCredentials = (identifier: string, password: string) =>
  isAdminIdentity(identifier) && password === getStoredAdminPassword(identifier)

export const isInitialAdminPassword = (identifier: string, password: string) => {
  const admin = findAdmin(identifier)
  return Boolean(admin?.initialPassword && password === admin.initialPassword)
}

export const getPasswordUpdatedAt = (identifier: string) => {
  const admin = findAdmin(identifier)
  if (!admin) return null
  const key = getAdminKey(admin)
  const value = localStorage.getItem(`${STORAGE_KEYS.passwordUpdatedAt}:${key}`)
  return value ? Number(value) : null
}

export const isPasswordExpired = (identifier: string) => {
  const updatedAt = getPasswordUpdatedAt(identifier)
  if (!updatedAt) return true
  const daysElapsed = Math.floor((Date.now() - updatedAt) / MS_PER_DAY)
  return daysElapsed >= PASSWORD_EXPIRY_DAYS
}

export const getPasswordDaysRemaining = (identifier: string) => {
  const updatedAt = getPasswordUpdatedAt(identifier)
  if (!updatedAt) return 0
  const daysElapsed = Math.floor((Date.now() - updatedAt) / MS_PER_DAY)
  return Math.max(0, PASSWORD_EXPIRY_DAYS - daysElapsed)
}

export const needsPasswordReset = (identifier: string, passwordUsed?: string) => {
  if (!getPasswordUpdatedAt(identifier)) return true
  if (passwordUsed && isInitialAdminPassword(identifier, passwordUsed)) return true
  return isPasswordExpired(identifier)
}

export const setNewAdminPassword = (identifier: string, password: string) => {
  const admin = findAdmin(identifier)
  if (!admin) return
  const key = getAdminKey(admin)
  localStorage.setItem(`${STORAGE_KEYS.password}:${key}`, password)
  localStorage.setItem(
    `${STORAGE_KEYS.passwordUpdatedAt}:${key}`,
    String(Date.now())
  )
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
    return Boolean(parsed?.loggedIn)
  } catch {
    return false
  }
}

export const getLastNoticeDate = () =>
  localStorage.getItem(STORAGE_KEYS.lastNoticeDate)

export const setLastNoticeDate = (value: string) =>
  localStorage.setItem(STORAGE_KEYS.lastNoticeDate, value)
