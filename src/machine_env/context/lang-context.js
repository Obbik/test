import React, { useState, createContext } from 'react'
import pl from '../lang/pl.json'
import en from '../lang/en.json'

export const LangContext = createContext()

export default ({ children }) => {
  const lang = localStorage.getItem('lang')

  const [currentLanguage, setLanguage] = useState(lang)
  const changeLanguage = newLanguage => {
    if (newLanguage !== currentLanguage) {
      localStorage.setItem('lang', newLanguage)
      setLanguage(newLanguage)
    }
  }

  let languagePack

  switch (currentLanguage) {
    case 'pl':
      languagePack = pl
      break
    case 'en':
      languagePack = en
      break
    default:
      languagePack = pl
      break
  }

  return (
    <LangContext.Provider value={{ languagePack, changeLanguage }}>
      {children}
    </LangContext.Provider>
  )
}
