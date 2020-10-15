export default (...args) => {
  const [searchedText, ...values] = args

  return values.some(
    val => val && String(val).toLowerCase().includes(searchedText.toLowerCase())
  )
}
