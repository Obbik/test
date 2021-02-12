import React, { useState, useEffect } from 'react'

export default ({
  className,
  style,
  name,
  type,
  value,
  handleChange,
  required,
  minLength,
  maxLength,
  min,
  max
}) => {
  const [isValid, setIsValid] = useState(true)

  useEffect(() => {
    setIsValid(() => {
      if (required && !value) return false
      if (minLength && value.length < minLength) return false
      if (maxLength && value.length > maxLength) return false
      if (type === 'number' && isNaN(value)) return false
      if (min && Number(value) < min) return false
      if (max && Number(value) > max) return false
      return true
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return (
    <input
      className={`form-control form-control-sm ${className} ${
        !isValid ? 'invalid-input' : ''
      }`}
      {...{ name, type, value, style }}
      onChange={handleChange}
      data-valid={isValid}
    />
  )
}
