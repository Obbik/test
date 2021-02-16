export default (ref, handleClickAway) => {
  document.onkeydown = function (evt) {
    evt = evt || window.event;
    let isEscape = false;
    if ("key" in evt) {
      isEscape = (evt.key === "Escape" || evt.key === "Esc");
    } else {
      isEscape = (evt.keyCode === 27);
    }
    if (isEscape) {
      handleClickAway()
    }
  };
  const eventWrapper = evt => {
    if (ref.current && !ref.current.contains(evt.target)) {
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
