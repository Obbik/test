import React, { useState, useEffect, useContext } from 'react'
import { NavigationContext } from '../../../context/navigation-context'
import { LangContext } from '../../../context/lang-context'
import useFetch from '../../../hooks/fetch-hook'
import useForm from '../../../hooks/form-hook'
import useFilter from '../../../hooks/filter-hook'

import SearchInput from '../../../components/SearchInput/SearchInput'
import NoResults from '../../../components/NoResults/NoResults'
import CategoryForm from '../../../components/Modals/CategoryForm'

import sampleProduct from '../../../assets/images/sample-product.svg'

import { CONSOLE_CLOUD } from '../../../config/config'
import filterItems from '../../../util/filterItems'
import { Link } from 'react-router-dom'

export default () => {
  const { fetchMssqlApi } = useFetch()
  const { setHeaderData } = useContext(NavigationContext)
  const { TRL_Pack } = useContext(LangContext)
  const { searchedText, updateSearchedText } = useFilter()

  const { form, openForm, closeForm } = useForm()

  const [categories, setCategories] = useState([])

  const getCategories = () => {
    fetchMssqlApi('categories', {}, categories => setCategories(categories))
  }

  const submitCategory = evt => {
    evt.preventDefault()

    const { name, image } = evt.target.elements

    const formData = new FormData()
    formData.append('Name', name.value)

    if (image.files[0]) formData.append('Image', image.files[0])

    let path, method
    if (form !== 'new') {
      path = `category/${form}`
      method = 'PUT'
    } else {
      path = 'category'
      method = 'POST'
    }

    fetchMssqlApi(path, { method, data: formData }, () => {
      closeForm()
      getCategories()
    })
  }

  const deleteCategory = categoryId => () => {
    if (window.confirm('Potwierdź usunięcie kategorii'))
      fetchMssqlApi(`category/${categoryId}`, { method: 'DELETE' }, getCategories)
  }

  useEffect(() => {
    setHeaderData({ text: 'Kategorie' })

    getCategories()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filteredCategories = categories.filter(({ Name }) =>
    filterItems(searchedText, Name)
  )

  return (
    <>
      {categories.length ? (
        <>
          <SearchInput onSearch={updateSearchedText} />
          {!filteredCategories.length ? (
            <NoResults buttonText="Dodaj kategorie" onClick={openForm()} />
          ) : (
            <>
              <div>
                <button
                  className="d-block btn btn-link text-decoration-none ml-auto my-2 mr-1"
                  onClick={openForm()}
                >
                  <i className="fas fa-plus mr-2" /> Dodaj kategorie
                </button>
              </div>
              <div className="overflow-auto">
                <table className="table table-striped border">
                  <thead>
                    <tr>
                      <th className="text-center" style={{ width: 50 }}>
                        #
                      </th>
                      <th>Nazwa</th>
                      <th>Zdjęcie</th>
                      <th style={{ width: '1%' }} colSpan={2} />
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCategories.map((category, idx) => (
                      <tr key={idx}>
                        <td className="font-weight-bold text-center">{idx + 1}</td>
                        <td>
                          <button
                            className="btn btn-link font-size-inherit text-decoration-none text-reset p-1"
                            onClick={openForm(category.CategoryId)}
                          >
                            {category.Name}
                          </button>
                        </td>
                        <td>
                          <img
                            src={`${CONSOLE_CLOUD}/categories/${category.Image}`}
                            onError={evt => (evt.target.src = sampleProduct)}
                            alt={category.Name}
                            width="48"
                            height="48"
                          />
                        </td>
                        <td>
                          <Link
                            to={`/products/${category.CategoryId}`}
                            className="btn btn-link"
                          >
                            <i className="fas fa-cookie text-warning" />
                          </Link>
                        </td>
                        <td>
                          <button
                            className="btn btn-link"
                            onClick={deleteCategory(category.CategoryId)}
                          >
                            <i className="fas fa-trash text-danger" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </>
      ) : (
        <NoResults buttonText="Dodaj kategorie" onClick={openForm()} />
      )}
      {form && (
        <CategoryForm
          categoryData={
            form !== 'new'
              ? filteredCategories.find(category => category.CategoryId === form)
              : null
          }
          handleSubmit={submitCategory}
          handleClose={closeForm}
        />
      )}
    </>
  )
}
