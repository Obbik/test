import React, { useState, useEffect, useContext } from 'react'
import { NavigationContext } from '../../context/navigation-context'
import { LangContext } from '../../context/lang-context'

import CategoryForm from '../../components//Modals/CategoryForm'

import CategoriesTable from '../../components/Category/CategoriesTable'
import CategoriesCards from '../../components/Category/CategoriesCards'
import SearchInput from '../../components/SearchInput/SearchInput'

import useFetch from '../../hooks/fetch-hook'
import useForm from '../../hooks/form-hook'

export default () => {
  const { fetchApi } = useFetch()
  const { form, openForm, closeForm } = useForm()

  const { setHeaderData } = useContext(NavigationContext)
  const {
    languagePack: { categories: categoriesTRL }
  } = useContext(LangContext)

  const [searchedValue, setSearchedValue] = useState('')
  const handleSearch = value => setSearchedValue(value)

  const [categories, setCategories] = useState([])
  const [tableView, setTableView] = useState(false)

  const deleteCategory = id => () => {
    if (window.confirm('Czy na pewno chcesz usunąć kategorię?')) {
      fetchApi(`category/${id}`, { method: 'DELETE' }, getCategories)
    }
  }

  const getCategories = () => {
    fetchApi('categories', {}, categories => setCategories(categories))
  }

  const toggleView = () => setTableView(prev => !prev)

  useEffect(() => {
    getCategories()
    setHeaderData({ text: categoriesTRL.header })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const listProps = {
    categoryItems: categories.filter(c =>
      c.Name.toLowerCase().includes(searchedValue.toLowerCase())
    ),
    openForm,
    handleDeleteCategory: deleteCategory
  }

  return (
    <>
      <SearchInput
        tableView={tableView}
        onSearch={handleSearch}
        onToggleView={toggleView}
      />
      <div>
        <button
          className="d-block btn btn-link text-decoration-none ml-auto my-2 mr-1"
          onClick={openForm()}
        >
          <i className="fas fa-plus mr-2" /> Dodaj kategorie
        </button>
      </div>
      {tableView ? (
        <CategoriesTable {...listProps} />
      ) : (
        <CategoriesCards {...listProps} />
      )}
      {form && (
        <CategoryForm
          categoryData={
            form !== 'new'
              ? categories.find(category => category.CategoryId === form)
              : null
          }
          closeModal={closeForm}
          getCategories={getCategories}
        />
      )}
    </>
  )
}
