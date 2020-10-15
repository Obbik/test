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

  let TRL_Pack

  if (currentLanguage === 'pl') TRL_Pack = pl
  else if (currentLanguage === 'en') TRL_Pack = en
  else TRL_Pack = pl

  return (
    <LangContext.Provider value={{ TRL_Pack, changeLanguage }}>
      {children}
    </LangContext.Provider>
  )
}
