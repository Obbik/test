import React, { useState } from 'react'

export default () => {
  const [visibility, setVisibility] = useState(window.scrollY > 75)
  window.onscroll = () => setVisibility(window.scrollY > 75)

  const scrollToTop = () =>
    document.body.scrollIntoView({ behavior: 'smooth', block: 'start' })

  return (
    <button
      id="scroll-button"
      className={`fab btn bg-info ${visibility ? 'd-flex' : 'd-none'}`}
      style={{
        bottom: 200,
        left: 20,
        zIndex: 4
      }}
      onClick={scrollToTop}
    >
      <i className="fas fa-arrow-up text-white" />
    </button>
  )
}
