import React from 'react'

export default ({ action, icon, color }) => {
  return (
    <button
      className={`floating-button btn rounded-circle d-flex bg-${color || 'secondary'}`}
      style={{
        bottom: 100,
        right: 20,
        zIndex: 4
      }}
      onClick={action}
    >
      <i className={`${icon || 'fas fa-plus'} text-white`} />
    </button>
  )
}
