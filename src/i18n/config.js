import it from '../messages/it.json'
import en from '../messages/en.json'
import fr from '../messages/fr.json'
import sq from '../messages/sq.json'
import ar from '../messages/ar.json'
import ur from '../messages/ur.json'

export const locales = ['it', 'en', 'fr', 'sq', 'ar', 'ur']
export const defaultLocale = 'it'
export const rtlLocales = ['ar', 'ur']
export const catalogs = { it, en, fr, sq, ar, ur }
export const localeNames = {
  it: 'Italiano',
  en: 'English',
  fr: 'Français',
  sq: 'Shqip',
  ar: 'العربية',
  ur: 'اردو',
}

export const pagePaths = {
  home: '',
  about: '/il-centro',
  italian: '/italiano',
  languages: '/lingue',
  school: '/scuola-media',
  exams: '/esami-cils',
  culture: '/vita-al-centro',
  contacts: '/contatti',
  accessibility: '/accessibilita',
  dashboard: '/segreteria',
}

export function parseRoute(pathname) {
  const segments = pathname.split('/').filter(Boolean)
  const hasLocale = locales.includes(segments[0])
  const locale = hasLocale ? segments[0] : defaultLocale
  const rest = `/${(hasLocale ? segments.slice(1) : segments).join('/')}`.replace(/\/$/, '') || ''
  const page = Object.entries(pagePaths).find(([, value]) => value === rest)?.[0] || 'home'
  return { locale, page, hasLocale }
}

export function hrefFor(locale, page) {
  return `/${locale}${pagePaths[page] || ''}`
}

export function getMessage(messages, path) {
  return path.split('.').reduce((value, key) => value?.[key], messages)
}
