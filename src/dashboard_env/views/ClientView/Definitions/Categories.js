import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { LangContext } from '../../../context/lang-context'
import { NavigationContext } from '../../../context/navigation-context'
import useFetch from '../../hooks/fetchMSSQL-hook'

import CategoryForm from '../../../components/Modals/CategoryForm'
import { CONSOLE_CLOUD, LOCAL_CLOUD } from '../../../config/config'
import filterItems from '../../../util/filterItems'
import sampleProduct from '../../../assets/images/sample-product.svg'
import NoResults from '../../../components/NoResults/NoResults'

export default ({
  formControllers: { form, openForm, closeForm },
  setItemsCount,
  searchedText,
  page
}) => {
  const { TRL_Pack } = useContext(LangContext)
  const { fetchMssqlApi } = useFetch()
  const { setHeaderData } = useContext(NavigationContext)

  const [categories, setCategories] = useState([])
  const filteredCategories = categories.filter(({ Name }) =>
    filterItems(searchedText, Name)
  )

  const getCategories = () => {
    fetchMssqlApi('categories', {}, categories => {
      setItemsCount({ total: categories.length, filtered: categories.length })
      setCategories(categories)
    })
  }

  const deleteCategory = id => () => {
    if (window.confirm(TRL_Pack.categories.confirmDeletionText))
      fetchMssqlApi(`category/${id}`, { method: 'DELETE' }, getCategories)
  }

  const submitCategory = evt => {
    evt.preventDefault()

    const { name, image } = evt.target.elements

    const formData = new FormData()
    formData.append('Name', name.value)
    formData.append('Image', image.files[0])

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



  useEffect(() => {
    setHeaderData({ text: TRL_Pack.categories.header })
    getCategories()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {filteredCategories.length ? (
        <div className="overflow-auto">
          <button
            className="d-block ml-auto btn btn-link text-decoration-none m-2"
            onClick={openForm()}
          >
            <i className="fas fa-plus mr-2" /> {TRL_Pack.categories.addCategoryButton}
          </button>
          <table className="table table-striped border">
            <thead>
              <tr>
                <th className="text-center" style={{ width: 75 }}>
                  #
                </th>
                <th>{TRL_Pack.categories.properties.categoryName}</th>
                <th className="text-center" style={{ width: 100 }}>
                  {TRL_Pack.categories.properties.image}
                </th>
                <th style={{ width: '1%' }} colSpan={1} />
              </tr>
            </thead>
            <tbody>
              {filteredCategories
                .slice((page - 1) * 25, page * 25)
                .map((category, idx) => (
                  <tr key={idx}>
                    <td className="font-weight-bold text-center">{idx + 1}</td>
                    <td className="small">
                      {category.CategoryId ? (
                        <button
                          style={{ wordBreak: 'break-word' }}
                          className="btn btn-link font-size-inherit text-reset text-decoration-none p-1"
                          onClick={openForm(category.CategoryId)}
                        >
                          {category.Name}
                        </button>
                      ) : (
                        <span style={{ wordBreak: 'break-word' }} className="p-1">
                          {category.Name}
                        </span>
                      )}
                    </td>
                    <td className="text-center">
                      <img
                        src={`${category.ConsoleId ? CONSOLE_CLOUD : LOCAL_CLOUD
                          }/categories/${category.Image}`}
                        onError={evt => (evt.target.src = sampleProduct)}
                        alt={category.Name}
                        width="64"
                        height="64"
                      />
                    </td>
                    {/* <td>
                      <Link
                        to={`/definitions/products/${category.CategoryId}`}
                        className="btn btn-link"
                      >
                        <i className="fas fa-cookie text-warning" />
                      </Link>
                    </td> */}
                    { (
                      <td>
                        <button
                          onClick={deleteCategory(category.CategoryId)}
                          className="btn btn-link"
                        >
                          <i className="fa fa-trash text-danger" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      ) : (
        <NoResults
          onClick={openForm()}
          buttonText={TRL_Pack.categories.addCategoryButton}
        />
      )}
      {form && (
        <CategoryForm
          categoryData={
            form !== 'new' ? filteredCategories.find(c => c.CategoryId === form) : null
          }
          handleSubmit={submitCategory}
          handleClose={closeForm}
        />
      )}
    </>
  )

  // return (
  //   <>
  //     {filteredItems.length ? (
  //       <CategoriesTable
  //         categories={filteredItems}
  //         handleAdd={openNewForm}
  //         handleEdit={openEditForm}
  //         handleDelete={deleteCategory}
  //       />
  //     ) : (
  //       <NoResults
  //         onClick={openNewForm}
  //         buttonText={TRL_Pack.categories.addCategoryButton}
  //       />
  //     )}
  //     {formModal && (
  //       <CategoryForm
  //         categoryData={filteredItems.find(c => c.CategoryId === formModal)}
  //         handleSubmit={submitCategory}
  //         handleClose={closeForm}
  //       />
  //     )}
  //   </>
  // )
}
