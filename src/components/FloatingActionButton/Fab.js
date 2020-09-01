import React from 'react'

export default ({ action }) => {
  return (
    <button
      className="fab btn rounded-circle bg-success d-flex"
      style={{
        bottom: 300,
        left: 20,
        zIndex: 4
      }}
      onClick={action}
    >
      <i className="fas fa-plus text-white" />
    </button>
  )
}
