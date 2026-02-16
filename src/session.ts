const COOKIE_NAME = 'vue_chatbot_session_id'
const MAX_AGE_SECONDS = 3600

function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  const hex = (n: number) => Math.floor(n).toString(16)
  return `${hex(Math.random() * 0xffffffff)}-${hex(Math.random() * 0xffff)}-${hex(0x4000 | Math.random() * 0x0fff)}-${hex(0x8000 | Math.random() * 0x0fff)}-${hex(Math.random() * 0xffffffff)}${hex(Math.random() * 0xffff)}`
}

function getCookie(name: string): string | null {
  const parts = document.cookie.split(';')
  for (const part of parts) {
    const [key, ...valueParts] = part.split('=')
    const keyTrim = key?.trim()
    if (keyTrim === name) {
      const value = valueParts.join('=').trim()
      return value ?? null
    }
  }
  return null
}

function setCookie(name: string, value: string, maxAge: number, path: string): void {
  document.cookie = `${name}=${encodeURIComponent(value)}; max-age=${maxAge}; path=${path}`
}

export function getOrCreateSessionId(): string | undefined {
  if (typeof document === 'undefined') return undefined
  const existing = getCookie(COOKIE_NAME)
  if (existing) return existing
  const id = generateId()
  setCookie(COOKIE_NAME, id, MAX_AGE_SECONDS, '/')
  return id
}
