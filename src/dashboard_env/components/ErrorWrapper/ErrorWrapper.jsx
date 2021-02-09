import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { ErrorContext } from '../../context/error-context'

export default () => {
  const { fatalError, clearError } = useContext(ErrorContext)
  const history = useHistory()

  const listener = history.listen(() => {
    clearError()
    listener()
  })

  return (
    <div className="flex-grow-1 d-flex flex-column justify-content-center align-items-center p-4 text-center">
      <h2 className="text-danger mb-3">Fatal Error:</h2>
      <h4 className="mb-4"> {fatalError}</h4>
      <button className="btn btn-info btn-lg" onClick={clearError} autoFocus>
        Try Again
      </button>
    </div>
  )
}
