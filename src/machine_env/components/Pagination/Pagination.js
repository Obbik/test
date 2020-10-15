import React from 'react'

export default ({
  totalItems,
  page,
  handleSwitchPage,
  rowsPerPage,
  toggleFilter,
  filterVisibility
}) => {
  const pages = Math.ceil(totalItems / (rowsPerPage || 25))

  if (!pages || pages < 2) return <></>

  const DisabledListItem = () => (
    <li className="page-item disabled">
      <span className="page-link">...</span>
    </li>
  )

  const ListItem = ({ idx }) => (
    <li className={page === idx ? 'page-item active' : 'page-item'}>
      <button className="page-link" onClick={() => handleSwitchPage(idx)}>
        {idx}
      </button>
    </li>
  )

  let paginationBar

  if (pages <= 5)
    paginationBar = [...Array(pages)].map((e, i) => <ListItem key={i} idx={i + 1} />)
  else if (pages > 5) {
    if (page <= 3)
      paginationBar = (
        <>
          <ListItem idx={1} />
          <ListItem idx={2} />
          <ListItem idx={3} />
          {page === 3 && <ListItem idx={4} />}
          <DisabledListItem />
          <ListItem idx={pages} />
        </>
      )
    else if (page > 3 && page < pages - 2)
      paginationBar = (
        <>
          <ListItem idx={1} />
          <DisabledListItem />
          <ListItem idx={page - 1} />
          <ListItem idx={page} />
          <ListItem idx={page + 1} />
          <DisabledListItem />
          <ListItem idx={pages} />
        </>
      )
    else
      paginationBar = (
        <>
          <ListItem idx={1} />
          <DisabledListItem />
          {page === pages - 2 && <ListItem idx={pages - 3} />}
          <ListItem idx={pages - 2} />
          <ListItem idx={pages - 1} />
          <ListItem idx={pages} />
        </>
      )
  }

  return (
    <nav className="mb-4 d-flex justify-content-center">
      <ul className="pagination mb-0">{paginationBar}</ul>
      {toggleFilter && (
        <span
          className={`btn fas fa-filter ml-2 my-auto ${
            filterVisibility ? 'text-primary' : 'text-secondary'
          }`}
          onClick={toggleFilter}
        />
      )}
    </nav>
  )
}
