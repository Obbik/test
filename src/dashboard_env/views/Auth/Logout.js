import React, { useEffect } from 'react'

export default ({ logout }) => {
  useEffect(logout, [])

  return <h3>Wylogowywanie...</h3>
}
