import { useEffect } from 'react'

export default (ref, handleClickAway) => {
  useEffect(() => {
    const eventWrapper = evt => {
      setTimeout(() => {
        if (ref.current && !ref.current.contains(evt.target)) handleClickAway()
      }, 75)
    }

    document.addEventListener('mousedown', eventWrapper)
    return () => {
      document.removeEventListener('mousedown', eventWrapper)
    }
  }, [ref])
}
