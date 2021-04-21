import React, { useState, useRef, useContext, createContext, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { LangContext } from './lang-context'

export const SearchbarContext = createContext()

export default ({ children }) => {
  const { TRL_Pack } = useContext(LangContext)

  const searchbarRef = useRef(null)
  let location = useLocation()

  const searchedTextRef = useRef('')
  const [page, setPage] = useState(1)

  useEffect(() => {
    if (searchbarRef.current) searchbarRef.current.focus()
  }, [page])

  const compareText = (...args) =>
    args.some(
      arg =>
        arg && String(arg).toLowerCase().includes(searchedTextRef.current.toLowerCase())
    )

  const Searchbar = ({ callback = () => { } }) => {
    const handleChange = evt => {
      searchedTextRef.current = evt.target.value
      if (page !== 1) setPage(1)

      callback(evt.target.value)
    }

    useEffect(() => {
      searchbarRef.current.value = ''
      searchedTextRef.current = ''
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location])

    return (
      <div className="row mb-3">
        <div className="d-flex offset-sm-1 offset-md-2 offset-lg-3 col col-sm-10 col-md-8 col-lg-6">
          <div className="input-group">
            <input
              onChange={handleChange}
              defaultValue={searchedTextRef.current}
              ref={searchbarRef}
              type="search"
              className="form-control rounded-left border-right-0"
              placeholder={TRL_Pack.searchbarPlaceholder}
              autoComplete="off"
            />
            <div className="input-group-append">
              <span className="input-group-text bg-white border-left-0">
                <i className="fas fa-search"></i>
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const defaultItemsPerPage = 25

  const Pagination = ({
    totalItems,
    itemsPerPage = defaultItemsPerPage,
    callback = () => { }
  }) => {
    const handleChange = newPage => () => {
      setPage(newPage)
      callback(newPage)
    }

    const totalPages = Math.ceil(totalItems / itemsPerPage)

    const DisabledListItem = () => (
      <li className="page-item disabled">
        <span className="page-link">...</span>
      </li>
    )

    const ListItem = ({ idx }) =>
      page === idx ? (
        <li className="page-item active">
          <span className="page-link">{idx}</span>
        </li>
      ) : (
        <li className="page-item">
          <button className="page-link" onClick={handleChange(idx)}>
            {idx}
          </button>
        </li>
      )

    const PaginationBar = () => {
      if (totalPages <= 5)
        return [...Array(totalPages)].map((e, i) => <ListItem key={i} idx={i + 1} />)
      else if (page <= 3)
        return (
          <>
            <ListItem idx={1} />
            <ListItem idx={2} />
            <ListItem idx={3} />
            {page === 3 && <ListItem idx={4} />}
            <DisabledListItem />
            <ListItem idx={totalPages} />
          </>
        )
      else if (page > 3 && page < totalPages - 2)
        return (
          <>
            <ListItem idx={1} />
            <DisabledListItem />
            <ListItem idx={page - 1} />
            <ListItem idx={page} />
            <ListItem idx={page + 1} />
            <DisabledListItem />
            <ListItem idx={totalPages} />
          </>
        )
      else
        return (
          <>
            <ListItem idx={1} />
            <DisabledListItem />
            {page === totalPages - 2 && <ListItem idx={totalPages - 3} />}
            <ListItem idx={totalPages - 2} />
            <ListItem idx={totalPages - 1} />
            <ListItem idx={totalPages} />
          </>
        )
    }

    return (
      totalItems > itemsPerPage && (
        <nav className="mb-4 d-flex justify-content-center">
          <ul className="pagination mb-0">
            <PaginationBar />
          </ul>
        </nav>
      )
    )
  }

  return (
    <SearchbarContext.Provider
      value={{
        Searchbar,
        compareText,
        Pagination,
        currentPage: page,
        defaultItemsPerPage
      }}
    >
      {children}
    </SearchbarContext.Provider>
  )
}
