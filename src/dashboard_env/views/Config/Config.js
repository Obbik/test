import React, { useState, useEffect, useContext } from 'react'
import { NavigationContext } from '../../context/navigation-context'
import { LangContext } from '../../context/lang-context'

import MachineProducts from './MachineProducts'
import Temperature from './Temperature'
import Lift from './Lift'

export default () => {
  const { setHeaderData } = useContext(NavigationContext)
  const  {TRL_Pack:{shelves}}  = useContext(LangContext)

  console.log(shelves)
  const [currentMachineSection, setCurrentMachineSection] = useState(0)
  const changeSection = id => () => setCurrentMachineSection(id)

  useEffect(() => {
    setHeaderData({ text: shelves.configHeader })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <ul className="nav nav-tabs machine-tabs mb-3">
        <li className="nav-item">
          <button
            className={`nav-link btn ${currentMachineSection === 0 && 'active'}`}
            onClick={changeSection(0)}
            tabIndex="0"
          >
            Konfiguracja
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link btn ${currentMachineSection === 1 ? 'active' : ''}`}
            onClick={changeSection(1)}
            tabIndex="0"
          >
            Temperatura
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link btn ${currentMachineSection === 2 && 'active'}`}
            onClick={changeSection(2)}
            tabIndex="0"
          >
            Winda/wybory
          </button>
        </li>
      </ul>
      {currentMachineSection === 0 && <MachineProducts />}
      {currentMachineSection === 1 && <Temperature />}
      {currentMachineSection === 2 && <Lift />}
    </>
  )
}
