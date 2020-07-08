import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

import Product from '../../components/Product/Product_alt'
import Title from '../../components/Title/Title_alt'
import SearchInput from '../SearchInput/SearchInput_alt'
import Pagination from '../../components/Pagination/Pagination_alt'
import ProductCategory from '../Product/ProductCategory_alt'

export default ({
  url,
  token,
  setLoader,
  NotificationError,
  NotificationSuccess
}) => {
  const { categoryId = '' } = useParams()

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
    const confirm = window.confirm('Czy na pewno chcesz usunąć produkt?')

    if (confirm) {
      setLoader(true)
      axios
        .delete(`${url}api/product/${ean}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(res => {
          setLoader(false)
          NotificationSuccess(res.data.message)
          getProducts()
        })
        .catch(err => {
          setLoader(false)
          NotificationError(err)
        })
    }
  }

  const getProducts = (
    page = 1,
    search = searchedValue,
    shared = state.shared
  ) => {
    setLoader(true)
    const reqUrl = `${url}api/products?search=${search}&shared=${shared}&categoryId=${categoryId}&page=${page}`

    axios
      .get(reqUrl, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(res => {
        setState(prev => ({
          ...prev,
          products: res.data.products,
          totalItems: res.data.totalItems,
          initialProducts: res.data.products
        }))
        setLoader(false)
      })
      .catch(err => {
        setLoader(false)
        NotificationError(err)
      })
  }

  const getTitle = () => {
    if (categoryId) {
      axios
        .get(`${url}api/category/${categoryId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(res => {
          setState(prev => ({ ...prev, title: res.data.Name }))
        })
    } else setState(prev => ({ ...prev, title: 'Wszystkie produkty' }))
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

  // Handle shared input
  // const handleSharedInputChange = e => {
  //   const checked = e.target.checked
  //   const shared = checked ? '1' : ''
  //   setState(prev => ({ ...prev, shared: shared }))
  //   getProducts(1, searchedValue, shared)
  // }

  // Handle product category modal
  const showProductCategoryModal = ean => {
    setState(prev => ({
      ...prev,
      showProductCategoryModal: true,
      ean: ean
    }))
  }

  const hideProductCategoryModal = () => {
    setState(prev => ({ ...prev, showProductCategoryModal: false }))
    getProducts()
  }

  useEffect(() => {
    getProducts()
    getTitle()
  }, [])

  return (
    <>
      <Title
        title={state.title}
        buttonName="Dodaj produkt"
        buttonLink="/product/add"
      />
      <SearchInput
        tableView={tableView}
        onSearch={search}
        onToggleView={toggleView}
      />
      {/* <div className="row">
                  <div className="col">
                      <div className="custom-control custom-checkbox float-right">
                          <input onChange={this.handleSharedInputChange} type="checkbox" className="custom-control-input" id="shared-checkbox"/>
                          <label className="custom-control-label" htmlFor="shared-checkbox">Współdzielone</label>
                      </div>
                  </div>
              </div> */}
      <Pagination
        onSwitchPage={switchPage}
        page={state.page}
        totalItems={state.totalItems}
      />
      <Product
        url={url}
        products={state.products}
        onDeleteProduct={deleteProduct}
        tableView={tableView}
        onShowProductCategoryModal={showProductCategoryModal}
      />
      <ProductCategory
        key={state.ean}
        ean={state.ean}
        url={url}
        token={token}
        showProductCategoryModal={state.showProductCategoryModal}
        onHideProductCategoryModal={hideProductCategoryModal}
      />
    </>
  )
}
