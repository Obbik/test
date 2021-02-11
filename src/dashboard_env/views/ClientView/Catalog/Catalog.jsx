import React, { useState, useContext, useEffect } from 'react'
import { Link, Route, Switch } from 'react-router-dom'
import { useLocation, useParams } from 'react-router'
import { NavigationContext } from '../../../context/navigation-context'
import { LangContext } from '../../../context/lang-context'
import useFetch from '../../../hooks/fetchMSSQL-hook'

import VendimProducts from './VendimProducts'
import VendimCategories from './VendimCategories'

export default () => {
  const { fetchMssqlApi } = useFetch()
  const { pathname } = useLocation()
  const { categoryId } = useParams()
  const { TRL_Pack } = useContext(LangContext)
  const { setHeaderData } = useContext(NavigationContext)

  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])

  const getProducts = () => {
    // if (categoryId) {
    //   setProducts(productsByCategory)
    //   // fetchMssqlApi(`catalog-products/${categoryId}`, {}, products => setProducts(products))
    // } else {
    fetchMssqlApi('catalog-products', {}, products => setProducts(products))
    // }
  }
  // TODO NO catalog-categories endpoint
  const getCategories = () => {
    fetchMssqlApi('catalog-categories', {}, categories => setCategories(categories))
  }

  useEffect(() => {
    getProducts()
    getCategories()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (pathname === '/catalog-categories') setHeaderData({ text: 'Katalog Kategorii' })
    else if (categoryId)
      setHeaderData({
        text: 'Katalog Produktów',
        subtext:
          categories.find(category => category.CategoryId === categoryId) &&
          categories.find(category => category.CategoryId === categoryId).Name
      })
    else setHeaderData({ text: 'Katalog Produktów' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, categories])

  return (
    <>
      <ul className="nav nav-tabs machine-tabs w-100 mb-3">
        <li className="nav-item w-50">
          <Link
            to="/catalog-products"
            className={`nav-link btn w-100 ${pathname === '/catalog-products' ? 'active' : ''
              }`}
          >
            {TRL_Pack.definitions.products}
          </Link>
        </li>
        <li className="nav-item w-50">
          <Link
            to="/catalog-categories"
            className={`nav-link btn w-100 ${pathname === '/catalog-categories' ? 'active' : ''
              }`}
          >
            {TRL_Pack.definitions.categories}
          </Link>
        </li>
      </ul>
      <div>
        <Switch>
          <Route
            exact
            path={['/catalog-products', '/catalog-products/:categoryId']}
            render={() => (
              <VendimProducts
                products={products}
                categories={categories}
                getProducts={getProducts}
              />
            )}
          />
          <Route
            exact
            path="/catalog-categories"
            render={() => (
              <VendimCategories categories={categories} getCategories={getCategories} />
            )}
          />
        </Switch>
      </div>
    </>
  )
}
