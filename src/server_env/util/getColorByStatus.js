export default status => {
  if (status === 2) return 'green'
  else if (status === 1) return 'yellow'
  else return 'red'
}
