import React, { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { LangContext } from '../../context/lang-context'

import fetchApi from '../../util/fetchApi'

import Product from '../../components/Product/Product'
import Title from '../../components/Title/Title'
import SearchInput from '../SearchInput/SearchInput'
import Pagination from '../../components/Pagination/Pagination'
import ProductCategory from './ProductCategory'

export default ({ url, setLoader, NotificationError, NotificationSuccess }) => {
  const {
    languagePack: { products }
  } = useContext(LangContext)
  const { categoryId } = useParams()

  const [state, setState] = useState({
    title: null,
    products: [],
    page: 1,
    totalItems: 0,
    shared: '',
    ean: null,
    typeTimeout: 0
  })

  const [searchedValue, setSearchedValue] = useState('')
  const [tableView, setTableView] = useState(false)

  const deleteProduct = ean => {
    const confirm = window.confirm(products.confirmDeletion)

    if (confirm) {
      setLoader(true)

      fetchApi(`product/${ean}`, { method: 'DELETE' })
        .then(res => {
          if (res.status && res.status < 400) {
            setLoader(false)
            NotificationSuccess(res.data.message)
            getProducts()
          } else throw new Error(res)
        })
        .catch(err => {
          setLoader(false)
          NotificationError(err)
        })
    }
  }

  const getProducts = (page = 1, search = searchedValue, shared = state.shared) => {
    setLoader(true)

    const params = `search=${search}&shared=${shared}&categoryId=${
      categoryId || ''
    }&page=${page}`

    fetchApi(`products?${params}`)
      .then(res => {
        if (res.status !== 200) throw new Error()

        setLoader(false)
        setState(prev => ({
          ...prev,
          products: res.data.products,
          totalItems: res.data.totalItems,
          initialProducts: res.data.products
        }))
      })
      .catch(() => {
        setLoader(false)
        throw new Error('Failed to fetch status.')
      })
  }

  const getTitle = () => {
    if (categoryId)
      fetchApi(`category/${categoryId}`)
        .then(res => {
          if (res.status !== 200) throw new Error()

          setLoader(false)
          setState(prev => ({ ...prev, title: res.data.Name }))
        })
        .catch(() => {
          setLoader(false)
          throw new Error('Failed to fetch status.')
        })
    else setState(prev => ({ ...prev, title: null }))
  }

  // Method for changing the view (table or cards)
  const toggleView = () => {
    setTableView(prev => !prev)
  }

  // Search bar
  const search = value => {
    const { typeTimeout } = state

    if (typeTimeout) clearTimeout(typeTimeout)

    setSearchedValue(value)
    setState(prev => ({
      ...prev,
      page: 1,
      typeTimeout: setTimeout(() => {
        getProducts(1, value)
      }, 1000)
    }))
  }

  // Pagination
  const switchPage = pageNo => {
    setState(prev => ({ ...prev, page: pageNo }))
    getProducts(pageNo)
  }

  // Handle product category modal
  const showProductCategoryModal = ean => {
    setState(prev => ({
      ...prev,
      showProductCategoryModal: true,
      ean
    }))
  }

  const hideProductCategoryModal = () => {
    setState(prev => ({ ...prev, ean: null, showProductCategoryModal: false }))
    getProducts()
  }

  useEffect(() => {
    getProducts()
    getTitle()
  }, [categoryId])

  return (
    <>
      <Title
        title={state.title || products.defaultHeader}
        buttonName={products.addProductButton}
        buttonLink="/product/add"
      />
      <SearchInput tableView={tableView} onSearch={search} onToggleView={toggleView} />
      <Pagination
        onSwitchPage={switchPage}
        page={state.page}
        totalItems={state.totalItems}
      />
      <Product
        url={url}
        productItems={state.products}
        onDeleteProduct={deleteProduct}
        tableView={tableView}
        onShowProductCategoryModal={showProductCategoryModal}
      />
      {state.ean && (
        <ProductCategory
          url={url}
          ean={state.ean}
          setLoader={setLoader}
          NotificationError={NotificationError}
          NotificationSuccess={NotificationSuccess}
          showProductCategoryModal={state.showProductCategoryModal}
          onHideProductCategoryModal={hideProductCategoryModal}
        />
      )}
    </>
  )
}
