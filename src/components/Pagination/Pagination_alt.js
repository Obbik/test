import React from 'react'
import { Link } from 'react-router-dom'

export default ({ page, totalItems, onSwitchPage }) => {
  const pages = Math.ceil(totalItems / 24)

  if (pages < 2) return <></>

  const ListItem = ({ handleClick, idx }) => (
    <li className="page-item">
      <Link to="#" onClick={handleClick} className="page-link">
        {idx}
      </Link>
    </li>
  )

  let paginationBar

  if (pages < 5)
    paginationBar = [...Array(pages)].map((e, i) => (
      <ListItem key={i} handleClick={() => onSwitchPage(i + 1)} idx={i} />
    ))
  else if (pages >= 5) {
    if (page <= 3)
      paginationBar = (
        <>
          <ListItem handleClick={() => onSwitchPage(1)} idx={1} />
          <ListItem handleClick={() => onSwitchPage(2)} idx={2} />
          <ListItem handleClick={() => onSwitchPage(3)} idx={3} />
          {page === 3 && (
            <ListItem handleClick={() => onSwitchPage(4)} idx={4} />
          )}
          <ListItem handleClick={null} idx={'...'} />
          <ListItem handleClick={() => onSwitchPage(pages)} idx={pages} />
        </>
      )
    else if (page > 3 && page < pages - 2)
      paginationBar = (
        <>
          <ListItem handleClick={() => onSwitchPage(1)} idx={1} />
          <ListItem handleClick={null} idx={'...'} />
          <ListItem handleClick={() => onSwitchPage(page - 1)} idx={page - 1} />
          <ListItem handleClick={() => onSwitchPage(page)} idx={page} />
          <ListItem handleClick={() => onSwitchPage(page + 1)} idx={page + 1} />
          <ListItem handleClick={null} idx={'...'} />
          <ListItem handleClick={() => onSwitchPage(pages)} idx={pages} />
        </>
      )
  }

  return (
    <nav>
      <ul className="pagination justify-content-center">{paginationBar}</ul>
    </nav>
  )
}
