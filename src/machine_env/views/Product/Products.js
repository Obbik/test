import React, { useState, useEffect, useContext } from 'react'
import { NavigationContext } from '../../context/navigation-context'
import { useParams } from 'react-router-dom'
import { LangContext } from '../../context/lang-context'

import ReturnLink from '../../components/Return/ReturnLink'
import ProductForm from '../../components/Modals/ProductForm'
import ProductCategoriesForm from '../../components/Modals/ProductCategoriesForm'

import useFetch from '../../hooks/fetch-hook'

import ProductsTable from '../../components/Product/ProductsTable'
import ProductsCards from '../../components/Product/ProductsCards'
import Fab from '../../components/FloatingActionButton/Fab'
import SearchInput from '../../components/SearchInput/SearchInput'
import Pagination from '../../components/Pagination/Pagination'

export default () => {
  const { fetchApi } = useFetch()

  const { setHeaderData } = useContext(NavigationContext)
  const {
    languagePack: { products }
  } = useContext(LangContext)
  const { categoryId } = useParams()

  const [state, setState] = useState({
    products: [],
    page: 1,
    totalItems: 0,
    typeTimeout: 0
  })

  const [searchedValue, setSearchedValue] = useState('')
  const [tableView, setTableView] = useState(false)

  const [productFormModal, setProductFormModal] = useState(null)
  const [productCategoriesFormModal, setProductCategoriesFormModal] = useState(null)

  const deleteProduct = ean => {
    const confirm = window.confirm(products.confirmDeletion)

    if (confirm) {
      fetchApi(`product/${ean}`, { method: 'DELETE' }, getProducts)
    }
  }

  const getProducts = (page = 1, search = searchedValue) => {
    const params = `search=${search}&categoryId=${categoryId || ''}&page=${page}`

    fetchApi(`products?${params}`, {}, data => {
      setState(prev => ({
        ...prev,
        products: data.products,
        totalItems: data.totalItems,
        initialProducts: data.products
      }))
    })
  }

  const getTitle = () => {
    if (categoryId)
      fetchApi(`category/${categoryId}`, {}, data =>
        setHeaderData(prev => ({
          text: products.defaultHeader,
          subtext: data.Name
        }))
      )
    else setHeaderData({ text: products.defaultHeader })
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
    getProducts()
    getTitle()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId])

  const listProps = {
    productItems: state.products,
    setProductModal: setProductFormModal,
    setProductCategoriesModal: setProductCategoriesFormModal,
    handleDeleteProduct: deleteProduct
  }

  return (
    <>
      {categoryId && <ReturnLink path="/categories" />}
      <Fab action={() => setProductFormModal('add')} />
      <SearchInput tableView={tableView} onSearch={search} onToggleView={toggleView} />
      <Pagination
        handleSwitchPage={switchPage}
        page={state.page}
        totalItems={state.totalItems}
      />
      {tableView ? <ProductsTable {...listProps} /> : <ProductsCards {...listProps} />}
      {productCategoriesFormModal && (
        <ProductCategoriesForm
          productEAN={productCategoriesFormModal}
          closeModal={() => setProductCategoriesFormModal(null)}
        />
      )}
      {productFormModal && (
        <ProductForm
          productEAN={productFormModal}
          closeModal={() => setProductFormModal(null)}
          getProducts={getProducts}
        />
      )}
    </>
  )
}
