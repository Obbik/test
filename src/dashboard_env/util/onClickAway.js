export default (ref, handleClickAway) => {
  const eventWrapper = evt => {
    if (ref.current && !ref.current.contains(evt.target)) {
      // console.log('clicked away')
      handleClickAway()
      document.removeEventListener('mousedown', eventWrapper)
    } else {
      // console.log('clicked inside', evt.target)
      document.removeEventListener('mousedown', eventWrapper)
      document.addEventListener('mousedown', eventWrapper, { once: true })
    }
  }

  document.addEventListener('mousedown', eventWrapper, { once: true })
}