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
      if (required && !value) return false && ErrorNotification(TRL_Pack.errors.invalidInput)
      if (minLength && value.length < minLength) return false && ErrorNotification(TRL_Pack.errors.invalidInput)
      if (maxLength && value.length > maxLength) return false && ErrorNotification(TRL_Pack.errors.invalidInput)
      if (type === 'number' && isNaN(value)) return false && ErrorNotification(TRL_Pack.errors.invalidInput)
      if (Number(value) < min) return false && ErrorNotification(TRL_Pack.errors.invalidInput)
      // if (max && Number(value) > max) return false
      if (Number(value) > max) return false && ErrorNotification(TRL_Pack.errors.invalidInput)
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
