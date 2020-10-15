import React from 'react'

export default ({
  totalItems,
  page,
  handleSwitchPage,
  rowsPerPage,
  toggleFilter,
  filterVisibility
}) => {
  const totalPages = Math.ceil(totalItems / rowsPerPage || 25)

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
        <button className="page-link" onClick={handleSwitchPage(idx)}>
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
    totalItems > rowsPerPage && (
      <nav className="mb-4 d-flex justify-content-center">
        <ul className="pagination mb-0">
          <PaginationBar />
        </ul>
        {toggleFilter && (
          <button className="btn ml-2 my-auto" onClick={toggleFilter}>
            <i
              className={`fas fa-filter ${
                filterVisibility ? 'text-primary' : 'text-secondary'
              }`}
            />
          </button>
        )}
      </nav>
    )
  )
}
