import React, { createContext, useContext, useMemo } from 'react'
import { catalogs, defaultLocale, getMessage } from './config.js'

const I18nContext = createContext({ locale: defaultLocale, messages: catalogs[defaultLocale], t: (path) => path })

export function I18nProvider({ locale, children }) {
  const value = useMemo(() => {
    const messages = catalogs[locale] || catalogs[defaultLocale]
    return {
      locale,
      messages,
      t: (path) => getMessage(messages, path) ?? getMessage(catalogs[defaultLocale], path) ?? path,
    }
  }, [locale])
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  return useContext(I18nContext)
}
