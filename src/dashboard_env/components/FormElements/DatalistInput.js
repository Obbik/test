import React, { useState, useEffect } from 'react'

export default ({ className, style, name, value, handleChange, list, newList }) => {
  const [isValid, setIsValid] = useState(true)

  useEffect(() => setIsValid(list.includes(value) || value === undefined), [value, list])

  return (
    <>
      <input
        className={`form-control form-control-sm ${className} ${
          !isValid ? 'invalid-input' : ''
        }`}
        {...{ name, value, style }}
        list={name}
        onChange={handleChange}
        data-valid={isValid}
      />
      {newList && (
        <datalist id={name}>
          {list.map((item, idx) => (
            <option key={idx} value={item} />
          ))}
        </datalist>
      )}
    </>
  )
}
