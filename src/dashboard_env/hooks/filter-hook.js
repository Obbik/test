import { useState } from 'react'

export default () => {
  const [searchedText, setSearchedText] = useState('')
  const updateSearchedText = text => {
    setSearchedText(text)
    if (page !== 1) setPage(1)
  }

  const [page, setPage] = useState(1)
  const updateCurrentPage = page => () => setPage(page)

  return { searchedText, updateSearchedText, page, updateCurrentPage }
}
