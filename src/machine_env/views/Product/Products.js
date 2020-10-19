import React, { useState, useEffect, useContext } from 'react'
import { NavigationContext } from '../../context/navigation-context'
import { useHistory, useParams } from 'react-router'
import { LangContext } from '../../context/lang-context'

import ReturnLink from '../../components/Return/ReturnLink'
import ProductForm from '../../components/Modals/ProductForm'

import useFetch from '../../hooks/fetch-hook'
import useForm from '../../hooks/form-hook'

import ProductsTable from '../../components/Product/ProductsTable'
import ProductsCards from '../../components/Product/ProductsCards'
import SearchInput from '../../components/SearchInput/SearchInput'
import Pagination from '../../components/Pagination/Pagination'

export default () => {
  const { fetchApi } = useFetch()
  const { form, openForm, closeForm } = useForm()

  const { setHeaderData } = useContext(NavigationContext)
  const {
    languagePack: { products }
  } = useContext(LangContext)
  const { categoryId } = useParams()
  const history = useHistory()

  const [categories, setCategories] = useState([])

  const [state, setState] = useState({
    products: [],
    page: 1,
    totalItems: 0,
    typeTimeout: 0
  })

  const [searchedValue, setSearchedValue] = useState('')
  const [tableView, setTableView] = useState(false)

  const deleteProduct = ean => () => {
    if (window.confirm(products.confirmDeletion)) {
      fetchApi(`product/${ean}`, { method: 'DELETE' }, getProducts)
    }
  }

  const getCategories = () => {
    fetchApi('categories', {}, categories => {
      setCategories(categories)
      if (categoryId) {
        const currentCategory = categories.find(c => c.CategoryId == categoryId)
        if (currentCategory)
          setHeaderData({
            text: products.defaultHeader,
            subtext: currentCategory.Name
          })
        else history.replace('/products')
      }
    })
  }

  const getProducts = (page = 1, search = searchedValue) => {
    const params = `search=${search}&categoryId=${categoryId || ''}&page=${page}`

    fetchApi(`products?${params}`, {}, data => {
      setState(prev => ({
        ...prev,
        products: data.products,
        totalItems: data.totalItems
      }))
    })
  }

  const toggleView = () => setTableView(prev => !prev)

  // Search bar
  const search = value => {
    const { typeTimeout } = state

    if (typeTimeout) clearTimeout(typeTimeout)

    setSearchedValue(value)
    setState(prev => ({
      ...prev,
      page: 1,
      typeTimeout: setTimeout(() => getProducts(1, value), 1000)
    }))
  }

  // Pagination
  const switchPage = pageNo => {
    setState(prev => ({ ...prev, page: pageNo }))
    getProducts(pageNo)
  }

  useEffect(() => {
    setHeaderData({ text: products.defaultHeader })

    getProducts()
    getCategories()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId])

  const listProps = {
    productItems: state.products,
    openForm,
    handleDeleteProduct: deleteProduct
  }

  return (
    <>
      {categoryId && <ReturnLink path="/categories" />}
      <SearchInput tableView={tableView} onSearch={search} onToggleView={toggleView} />
      <Pagination
        handleSwitchPage={switchPage}
        page={state.page}
        totalItems={state.totalItems}
      />
      <div>
        <button
          className="d-block btn btn-link text-decoration-none ml-auto my-2 mr-1"
          onClick={openForm()}
        >
          <i className="fas fa-plus mr-2" /> Dodaj produkt
        </button>
      </div>
      {tableView ? <ProductsTable {...listProps} /> : <ProductsCards {...listProps} />}
      {form && (
        <ProductForm
          productData={
            form !== 'new' ? state.products.find(product => product.EAN === form) : null
          }
          categories={categories}
          closeModal={closeForm}
          getProducts={getProducts}
        />
      )}
    </>
  )
}
