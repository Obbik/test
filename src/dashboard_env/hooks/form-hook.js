import { useState } from 'react'

export default () => {
  const [form, setForm] = useState(null)
  const openForm = id => () => setForm(id || 'new')
  const closeForm = () => setForm(null)

  return { form, openForm, closeForm }
}
