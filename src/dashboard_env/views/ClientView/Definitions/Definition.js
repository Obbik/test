import React, { useState, useContext } from 'react'
import { Route } from 'react-router'
import useFilter from '../../../hooks/filter-hook'
import useForm from '../../../hooks/form-hook'
import Products from './Products'
import Categories from './Categories'
// import Locations from './Locations'
// import MachineTypes from './MachineTypes'
// import Maintenances from './Maintenances'

import SearchInput from '../../../components/SearchInput/SearchInput'
import Pagination from '../../../components/Pagination/Pagination'

export default () => {
  const { searchedText, updateSearchedText, page, updateCurrentPage } = useFilter()
  const { form, openForm, closeForm } = useForm()

  const [itemsCount, setItemsCount] = useState({ total: 0, filtered: 0 })

  const payload = {
    formControllers: {
      form,
      openForm,
      closeForm
    },
    setItemsCount,
    searchedText,
    page
  }

  const routes = [
    {
      path: ['/definitions/products', '/definitions/products/:categoryId'],
      render: () => <Products {...payload} />
    },
    { path: '/definitions/categories', render: () => <Categories {...payload} /> }
    // { path: '/definitions/locations', render: () => <Locations {...payload} /> },
    // { path: '/definitions/machine-types', render: () => <MachineTypes {...payload} /> },
    // { path: '/definitions/maintenances', render: () => <Maintenances {...payload} /> }
  ]

  return (
    <>
      {itemsCount.total > 0 && (
        <>
          <SearchInput onSearch={updateSearchedText} />
          <Pagination
            page={page}
            totalItems={itemsCount.filtered}
            rowsPerPage={25}
            handleSwitchPage={updateCurrentPage}
          />
        </>
      )}
      {routes.map((route, idx) => (
        <Route key={idx} exact {...route} />
      ))}
    </>
  )
}
