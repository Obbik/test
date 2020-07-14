import React from 'react'
import { useHistory } from 'react-router-dom'

import Title from '../../components/Title/Title'

export default () => {
  const history = useHistory()

  return (
    <>
      <Title title="Status" />
      <div>test</div>
    </>
  )
}
