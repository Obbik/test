import { useEffect } from 'react'

export default (ref, handleClickAway) => {
  useEffect(() => {
    const eventWrapper = evt => {
      if (ref.current && !ref.current.contains(evt.target)) handleClickAway()
    }

    document.addEventListener('mousedown', eventWrapper)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, handleClickAway])
}
