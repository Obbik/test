import React, { useState, useEffect, useContext } from 'react'
import { NavigationContext } from '../../context/navigation-context'
import { LangContext } from '../../context/lang-context'

import useFetch from '../../hooks/fetch-hook'
import useForm from '../../hooks/form-hook'

export default () => {
  const { fetchApi } = useFetch()

  const { setHeaderData } = useContext(NavigationContext)

  useEffect(() => {
    setHeaderData({ text: 'Ustawienia' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <>test</>
}
