const ALLOWED_TAGS = ['INPUT', 'SELECT']

export default formElements => {
  const inputs = [...formElements].filter(item => ALLOWED_TAGS.includes(item.tagName))
  return inputs.every(input => input.getAttribute('data-valid') === 'true')
}
