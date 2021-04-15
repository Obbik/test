import React, { useState, useEffect, useContext } from 'react'
import { NotificationContext } from '../../context/notification-context'
import { LangContext } from '../../context/lang-context'
export default ({
  className,
  style,
  name,
  type,
  value,
  handleChange,
  disabled,
  required,
  minLength,
  maxLength,
  min,
  max,
  step
}) => {
  const { TRL_Pack } = useContext(LangContext)
  const [isValid, setIsValid] = useState(true)
  const { ErrorNotification } = useContext(NotificationContext)
  useEffect(() => {
    setIsValid(() => {
      if (required && !value) return false
      if (minLength && value.length < minLength) return false
      if (maxLength && value.length > maxLength) return false
      if (type === 'number' && isNaN(value)) return false
      if (Number(value) < min) return false
      if (max && Number(value) > max) return true
      if (Number(value) > max) return false
      return true
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return (
    <input
      disabled={disabled ? true : null}
      className={`form-control form-control-sm ${className} ${!isValid ? 'invalid-input' : ''
        }`}
      {...{ name, type, value, style }}
      onChange={handleChange}
      data-valid={isValid}
    />
  )
}
