import React, { useState, useEffect, useContext } from 'react'
import { NavigationContext } from '../../../context/navigation-context'
import { LangContext } from '../../../context/lang-context'
import { useHistory, useParams } from 'react-router'
import useFetch from '../../../hooks/fetchMSSQL-hook'
import useForm from '../../../hooks/form-hook'
import useFilter from '../../../hooks/filter-hook'

// import SearchInput from '../../../components/SearchInput/SearchInput'
import NoResults from '../../../components/NoResults/NoResults'
import Pagination from '../../../components/Pagination/Pagination'
import Filter from '../../../components/Filter/Filter'

import sampleProduct from '../../../assets/images/sample-product.svg'

import { API_URL } from '../../../config/config'
import filterItems from '../../../util/filterItems'
import ProductForm from '../../../components/Modals/ProductForm'

export default () => {
  const { fetchMssqlApi } = useFetch()
  const { setHeaderData } = useContext(NavigationContext)
  const { TRL_Pack } = useContext(LangContext)
  const { searchedText, updateSearchedText, page, updateCurrentPage } = useFilter()
  const { categoryId } = useParams()
  const history = useHistory()

  const resetPage = () => setFilter(prev => ({ ...prev, page: 1 }))
  const resetFilter = () => setFilter(defaultFilter)
  const toggleFilter = () => setFilter(prev => ({ ...prev, visible: !prev.visible }))
  const { form, openForm, closeForm } = useForm()

  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])

  const handleSwitchPage = pageNo => () => setFilter(prev => ({ ...prev, page: pageNo }))

  const getCategories = () => {
    fetchMssqlApi('categories', {}, categories => {
      setCategories(categories)
      if (categoryId) {
        const currentCategory = categories.find(c => c.CategoryId === categoryId)
        if (currentCategory)
          setHeaderData({
            text: 'Produkty',
            subtext: currentCategory.Name
          })
        else history.replace('/products')
      }
    })
  }

  const getProducts = () => {
    if (categoryId) {
      fetchMssqlApi(`products/${categoryId}`, {}, (products) => setProducts(products))
    }
    else fetchMssqlApi('products', {}, (products) => setProducts(products))
  }
  const submitProduct = productCategories => evt => {
    evt.preventDefault()

    const { ean, name, description, image } = evt.target.elements

    const formData = new FormData()
    formData.append('Ean', ean.value)
    formData.append('Name', name.value)
    formData.append('Description', description.value)

    if (image.files[0]) formData.append('Image', image.files[0])

    let path, method
    if (form !== 'new') {
      path = `product/${form}`
      method = 'PUT'
    } else {
      path = ''
      method = 'POST'
    }

    fetchMssqlApi(path, { method, data: formData }, () => {
      if (ean.value !== '0') {
        productCategories.added.forEach(categoryId =>
          fetchMssqlApi(`product-category/${ean.value}`, {
            method: 'POST',
            data: { categoryId }
          })
        )
        productCategories.deleted.forEach(categoryId =>
          fetchMssqlApi(`product-category/${ean.value}`, {
            method: 'DELETE',
            data: { categoryId }
          })
        )
      }

      closeForm()
      getProducts()
    })
  }

  const unsubscribeProduct = ean => () => {
    if (window.confirm('Potwierdź odsubskrybowanie produktu'))
      fetchMssqlApi(`shared-product/${ean}`, { method: 'DELETE' }, getProducts)
  }

  const deleteProduct = ean => () => {
    if (window.confirm('Potwierdź usunięcie produktu'))
      fetchMssqlApi(`product/${ean}`, { method: 'DELETE' }, getProducts)
  }
  useEffect(() => {
    setHeaderData({ text: 'Produkty' })

    getCategories()
    getProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId])

  const defaultFilter = {
    showIndexes: false,
    page: 1,
    rowsPerPage: 25,
    rowsPerPageOptions: [10, 25, 50],
    visible: false,
    sortByColumns: true,
    sortBy: '3 | asc | text',
    activeTags: [],
    disableIndexes: "true",
    columns: [
      {
        id: 1,
        name: TRL_Pack.products.filter.ean,
        type: "price",
        sortable: true,
        searchable: true,
      },
      {
        id: 2,
        name: TRL_Pack.products.filter.productName,
        sortable: true,
        searchable: true,
        type: 'text',
      },
      localStorage.getItem("clientId") !== "console" ?
        {
          id: 9,
          name: TRL_Pack.products.filter.isShared,
          sortable: true,
          selectable: true,
          type: 'bool',
        }
        : { solid: "true" },

      { solid: "true" }
    ]
  }

  const reportFilter = row =>
    filter.columns
      .filter(col => col.searchbar ? col.searchbar : col.selectbar)
      .every(col => {
        const x = String(row[Object.keys(row)[col.id - 1]])
          .toLowerCase()
          .includes(col.searchbar ? col.searchbar.toLowerCase() : col.selectbar.toLowerCase())
        return x
      }
      )

  const sortRows = (a, b) => {
    const [id, order, type] = filter.sortBy.split(' | ')

    const col = Object.keys(products[0])[Number(id) - 1]

    if (a[col] === b[col]) return 0
    else if (a[col] === null) return 1
    else if (b[col] === null) return -1

    let valueA, valueB
    if (type === 'text' || type === 'date') {

      valueA = a[col]?.toLowerCase()
      valueB = b[col]?.toLowerCase()
    }
    else if (type === "bool") {
      valueA = Number(a[col])
      valueB = Number(b[col])
    }
    else if (type === 'price') {
      valueA = Number(a[col].replace(',', ''))
      valueB = Number(b[col].replace(',', ''))

      //   // Number().toLocaleString(undefined, {minimumFractionDigits: 2}) num => str '1 245 151,50'
    } else return 0
    if (order === 'asc') return valueA < valueB ? -1 : 1
    else return valueA < valueB ? 1 : -1
  }

  const returnParsedIsShared = (col) => {
    if (typeof col === 'string') {
      return col
    }
    else if (typeof col === 'number') {
      if (col === 1) {
        return TRL_Pack.products.props.shared
      }
      else if (col === 0) {
        return TRL_Pack.products.props.notShared
      }
    }
  }



  const [filter, setFilter] = useState(() => {
    if (localStorage.getItem('productFilter')) {
      return JSON.parse(localStorage.getItem('productFilter'))
    } else return defaultFilter
  })
  const filteredProducts = products.filter(({ Name }) => filterItems(searchedText, Name))
  return (
    <>
      {products.length ? (
        <>
          {/* <SearchInput onSearch={updateSearchedText} /> */}
          <Pagination
            totalItems={filteredProducts.length}
            page={filter.page}
            rowsPerPage={filter.rowsPerPage}
            handleSwitchPage={handleSwitchPage}
            filterVisibility={filter.visible}
            toggleFilter={toggleFilter}
            resetFilter={resetFilter}

          />
          {filter.visible && (
            <Filter
              {...{
                filter,
                setFilter,
                columns: filter.columns,
                data: products,
                resetPage,
                resetFilter
              }}
            />
          )}
          {!filteredProducts.length ? (
            <NoResults buttonText="Dodaj produkt" onClick={() => { }} />
          ) : (
              <>
                <div>
                  <button
                    className="d-block btn btn-link text-decoration-none ml-auto my-2 mr-1"
                    onClick={openForm()}
                  >
                    <i className="fas fa-plus mr-2" /> Dodaj produkt
                </button>
                </div>
                <div className="overflow-auto">
                  <table className="table table-striped border">
                    <thead>
                      <tr>
                        {filter.showIndexes && <th className="text-center">#</th>}
                        {filter.columns
                          .filter(col => !col.hidden && !col.disabled)
                          .map((col, idx) => (
                            <th key={idx}>{col.name}</th>
                          ))}
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts
                        .filter(reportFilter)
                        .sort(sortRows)
                        .slice(
                          (filter.page - 1) * filter.rowsPerPage,
                          filter.page * filter.rowsPerPage
                        )
                        .map((product, idx) => (
                          <tr key={idx}>
                            {Object.keys(product)
                              .filter((col, col_idx) =>
                                filter.columns
                                  .filter(col => !col.hidden && !col.disabled)
                                  .map(col => col.id)
                                  .includes(col_idx + 1)
                              )

                              .map((col, col_idx) => (
                                <td key={col_idx} className="small">
                                  <button
                                    style={{ wordBreak: 'break-word' }}
                                    className="btn btn-link font-size-inherit text-reset text-decoration-none p-1"
                                    onClick={openForm(product.EAN)}>
                                    {returnParsedIsShared(product[col])}
                                  </button>
                                </td>
                              ))}
                            <td>
                              <img
                                src={`${API_URL}/${product.Image}`}
                                onError={evt => (evt.target.src = sampleProduct)}
                                alt={product.Name}
                                width="48"
                                height="48"
                              />
                            </td>
                            <td>
                              {!product.IsShared ? <button
                                className="btn btn-link"
                                onClick={deleteProduct(product.EAN)}
                              >
                                <i className="fas fa-trash text-danger" />
                              </button>
                                : <button
                                  className="btn btn-link"
                                  onClick={unsubscribeProduct(product.EAN)}
                                >
                                  <i className="fas fa-times text-danger" />
                                </button>}

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
          <NoResults buttonText="Dodaj produkt" onClick={openForm()} />
        )
      }
      {
        form && (
          <ProductForm
            form={form}
            productData={
              form !== 'new' ? filteredProducts.find(product => product.EAN === form) : null
            }
            getProducts={getProducts}
            categories={categories}
            handleSubmit={submitProduct}
            handleClose={closeForm}
          />
        )
      }
    </>
  )
}
