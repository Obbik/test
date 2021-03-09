import React, { useState, useEffect, useContext } from 'react'
import { NotificationContext } from '../../context/notification-context'

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
  const [isValid, setIsValid] = useState(true)
  const { ErrorNotification } = useContext(NotificationContext)
  useEffect(() => {
    setIsValid(() => {
      if (required && !value) return false && ErrorNotification('Invalid inputs.')
      if (minLength && value.length < minLength) return false && ErrorNotification('Invalid inputs.')
      if (maxLength && value.length > maxLength) return false && ErrorNotification('Invalid inputs.')
      if (type === 'number' && isNaN(value)) return false && ErrorNotification('Invalid inputs.')
      if (Number(value) < min) return false && ErrorNotification('Invalid inputs.')
      // if (max && Number(value) > max) return false
      if (Number(value) > max) return false && ErrorNotification('Invalid inputs.')
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
