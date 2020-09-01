import React from 'react'

export default ({ toggleSidebar, headerData: { text, subtext } = {} }) => {
  return (
    <header
      className="shadow d-flex align-items-center"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.05)'
      }}
    >
      <button
        className="mr-2 d-none d-lg-flex btn p-2"
        style={{ fontSize: '1.25rem' }}
        onClick={toggleSidebar}
      >
        <i className="fas fa-bars text-muted" />
      </button>
      <b>{text}</b>
      {subtext && <span className="ml-2 font-italic align-self-end">{subtext}</span>}
    </header>
  )
}
