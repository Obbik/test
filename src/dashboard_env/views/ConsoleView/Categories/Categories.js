import React, { useState, useEffect, useContext } from 'react'
import { NavigationContext } from '../../../context/navigation-context'
import { LangContext } from '../../../context/lang-context'

import useFetch from '../../../hooks/fetchMSSQL-hook'
import useForm from '../../../hooks/form-hook'
import useFilter from '../../../hooks/filter-hook'

import SearchInput from '../../../components/SearchInput/SearchInput'
import NoResults from '../../../components/NoResults/NoResults'
import CategoryForm from '../../../components/Modals/CategoryForm'
import AcceptForm from "../../../components/Modals/AcceptForm"

import sampleProduct from '../../../assets/images/sample-product.svg'

import { API_URL } from '../../../config/config'
import filterItems from '../../../util/filterItems'


export default () => {
  const { fetchMssqlApi } = useFetch()
  const { setHeaderData } = useContext(NavigationContext)
  const { TRL_Pack } = useContext(LangContext)
  const { searchedText, updateSearchedText } = useFilter()

  const { form, openForm, closeForm } = useForm()
  // const { categories, setCategories } = useState({})
  const [categoryId, setCategoryId] = useState()
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

  const handleModal = (categoryId) => {
    setCategoryId(categoryId)
    openForm("acceptModal")()

  }
  const deleteCategory = categoryId => {
    fetchMssqlApi(`category/${categoryId}`, { method: 'DELETE' }, getCategories)
  }
  useEffect(() => {
    setHeaderData({ text: TRL_Pack.navigation.categories })
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
            <NoResults buttonText={TRL_Pack.products.addProductButton} onClick={openForm()} />
          ) : (
            <>
              <div>
                <button
                  className="d-block btn btn-link text-decoration-none ml-auto my-2 mr-1"
                  onClick={openForm()}
                >
                  <i className="fas fa-plus mr-2" />
                  {TRL_Pack.products.addProductButton}
                </button>
              </div>
              <div className="overflow-auto">
                <table className="table table-striped border">
                  <thead>
                    <tr>
                      <th className="text-center" style={{ width: 50 }}>
                        #
                      </th>
                      <th>{TRL_Pack.categories.props.name}</th>
                      <th>{TRL_Pack.categories.props.image}</th>
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
                            src={`${API_URL}/${category.Image}`}
                            onError={evt => (evt.target.src = sampleProduct)}
                            alt={category.Name}
                            width="48"
                            height="48"
                          />
                        </td>
                        <td>
                          {
                            <button
                              className="btn btn-link"
                              onClick={() => handleModal(category.CategoryId)}
                            >
                              <i className="fas fa-trash text-danger" />
                            </button>
                          }
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
        <NoResults buttonText={TRL_Pack.categories.addCategoryButton} onClick={openForm()} />
      )}
      {
        form === "acceptModal" && form && (
          <AcceptForm handleClose={closeForm} categoryId={categoryId} deleteCategory={deleteCategory} />
        )
      }
      {form !== "acceptModal" && form && (
        <CategoryForm
          categoryData={
            form !== 'new'
              ? filteredCategories.find(category => category.CategoryId === form)
              : null
          }
          getCategories={getCategories}
          handleSubmit={submitCategory}
          handleClose={closeForm}
        />
      )}
    </>
  )
}
