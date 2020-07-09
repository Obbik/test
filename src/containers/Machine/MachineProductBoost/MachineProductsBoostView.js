import React, { Component, Fragment } from 'react'
import { NotificationManager } from 'react-notifications'

import Loader from '../../../components/Loader/Loader'
import Title from '../../../components/Title/Title'
import SearchInput from '../../SearchInput/SearchInput'
import MachineProductsBoost from './MachineProductsBoost'

import axios from 'axios'
import { api } from '../../../helpers/helpers'
import machineProducts from '../MachineProduct/MachineProducts'

class MachineProductBoostView extends Component {
  state = {
    title: 'Doładowanie',
    loader: false,
    machineType: null,
    machineProducts: []
  }

  componentDidMount() {
    this.getMachineProducts()
    this.getMachine()
  }

  getMachine = () => {
    const url = this.props.url + 'api/machines'
    const headers = {
      Authorization: 'Bearer ' + this.props.token
    }

    api(url, 'GET', headers, null, res => {
      if (res.status < 400) {
        this.setState({
          machineType: res.data[0].Type
        })
      }
    })
  }

  getMachineProducts = () => {
    const url = this.props.url + 'api/machine-products'
    const headers = {
      Authorization: 'Bearer ' + this.props.token
    }

    this.setState({ loader: true })
    api(url, 'GET', headers, null, res => {
      if (res.status < 400) {
        if (
          res.data
            .map(product => product.MachineFeederNo)
            .every(No => !isNaN(No))
        )
          res.data.sort(
            (a, b) => Number(a.MachineFeederNo) - Number(b.MachineFeederNo)
          )

        this.setState({
          machineProducts: res.data,
          initialMachineProducts: res.data
        })
      } else {
        NotificationManager.error(res.data.message, null, 4000)
      }
      this.setState({ loader: false })
    })
  }

  // Search bar
  search = value => {
    const suggestions = this.getSuggestions(value)
    let filtered = this.state.initialMachineProducts

    if (value !== '') {
      filtered = suggestions
    }

    this.setState({
      machineProducts: filtered
    })
  }

  getSuggestions = value => {
    const inputValue = value.trim().toLowerCase()
    const inputLength = inputValue.length

    return inputLength === 0
      ? []
      : this.state.initialMachineProducts.filter(
          machineProduct =>
            machineProduct.Name.toLowerCase().slice(0, inputLength) ===
            inputValue
        )
  }

  openAll = () => {
    const url = this.props.url + 'api/vend-all'

    api(url, 'GET', null, null, res => {
      if (res.status < 400) {
        NotificationManager.success(res.data.message, null, 4000)
      } else {
        NotificationManager.error(res.data.message, null, 4000)
      }
      this.setState({ loader: false })
    })
  }

  fillAllFeeders = () => {
    const { machineProducts } = this.state
    let filledMachineProducts = [...machineProducts]

    filledMachineProducts.forEach((product, i) => {
      if (product.Quantity !== product.MaxItemCount) {
        this.setState({ loader: true })
        product.Quantity = product.MaxItemCount

        axios
          .put(
            this.props.url + 'api/machine-product/' + product.MachineProductId,
            {
              Ean: product.EAN,
              MachineFeederNo: product.MachineFeederNo,
              Price: product.Price,
              DiscountedPrice: product.DiscountedPrice,
              Quantity: product.Quantity,
              MaxItemCount: product.MaxItemCount
            },
            {
              headers: {
                Authorization: 'Bearer ' + this.props.token
              }
            }
          )
          .then(res => {
            this.setState({ loader: false })
            if (i === filledMachineProducts.length - 1)
              NotificationManager.success(res.data.message, null, 4000)
          })
          .catch(err => {
            this.setState({ loader: false })
            if (i === filledMachineProducts.length - 1)
              NotificationManager.error(err.response.data.message, null, 4000)
          })
      }
    })
  }

  emptyAllFeeders = () => {
    const { machineProducts } = this.state
    let filledMachineProducts = [...machineProducts]

    filledMachineProducts.forEach((product, i) => {
      if (product.Quantity !== 0) {
        this.setState({ loader: true })
        product.Quantity = 0

        axios
          .put(
            this.props.url + 'api/machine-product/' + product.MachineProductId,
            {
              Ean: product.EAN,
              MachineFeederNo: product.MachineFeederNo,
              Price: product.Price,
              DiscountedPrice: product.DiscountedPrice,
              Quantity: product.Quantity,
              MaxItemCount: product.MaxItemCount
            },
            {
              headers: {
                Authorization: 'Bearer ' + this.props.token
              }
            }
          )
          .then(res => {
            this.setState({ loader: false })
            if (i === filledMachineProducts.length - 1)
              NotificationManager.success(res.data.message, null, 4000)
          })
          .catch(err => {
            this.setState({ loader: false })
            if (i === filledMachineProducts.length - 1)
              NotificationManager.error(err.response.data.message, null, 4000)
          })
      }
    })
  }

  fillSingleFeeder = machineProduct => {
    if (machineProduct.Quantity !== machineProduct.MaxItemCount) {
      const newMachineProduct = {
        Ean: machineProduct.EAN,
        MachineFeederNo: machineProduct.MachineFeederNo,
        Price: machineProduct.Price,
        DiscountedPrice: machineProduct.DiscountedPrice,
        Quantity: machineProduct.Quantity,
        MaxItemCount: machineProduct.MaxItemCount
      }

      newMachineProduct.Quantity = newMachineProduct.MaxItemCount

      axios
        .put(
          this.props.url +
            'api/machine-product/' +
            machineProduct.MachineProductId,
          newMachineProduct,
          {
            headers: {
              Authorization: 'Bearer ' + this.props.token
            }
          }
        )
        .then(res => {
          this.setState({ loader: false })
          NotificationManager.success(res.data.message, null, 4000)
          this.getMachineProducts()
        })
        .catch(err => {
          this.setState({ loader: false })
          NotificationManager.error(err.response.data.message, null, 4000)
        })
    }
  }

  emptySingleFeeder = machineProduct => {
    if (machineProduct.Quantity !== 0) {
      const newMachineProduct = {
        Ean: machineProduct.EAN,
        MachineFeederNo: machineProduct.MachineFeederNo,
        Price: machineProduct.Price,
        DiscountedPrice: machineProduct.DiscountedPrice,
        Quantity: machineProduct.Quantity,
        MaxItemCount: machineProduct.MaxItemCount
      }

      newMachineProduct.Quantity = 0

      axios
        .put(
          this.props.url +
            'api/machine-product/' +
            machineProduct.MachineProductId,
          newMachineProduct,
          {
            headers: {
              Authorization: 'Bearer ' + this.props.token
            }
          }
        )
        .then(res => {
          this.setState({ loader: false })
          NotificationManager.success(res.data.message, null, 4000)
          this.getMachineProducts()
        })
        .catch(err => {
          this.setState({ loader: false })
          NotificationManager.error(err.response.data.message, null, 4000)
        })
    }
  }

  saveFeeders = () => {
    const url = this.props.url + 'api/visit'

    const headers = {
      Authorization: 'Bearer ' + this.props.token
    }

    this.setState({ loader: true })
    api(url, 'GET', headers, null, res => {
      this.setState({ loader: false })
      if (res.status < 400)
        NotificationManager.success(res.data.message, null, 4000)
      else NotificationManager.error(res.data.message, null, 4000)
    })
  }

  render() {
    const { machineType, machineProducts } = this.state
    return (
      <Fragment>
        <Loader active={this.state.loader} />
        <Title title={this.state.title} />
        <SearchInput onSearch={this.search} tableView={null} />
        <div className="row mb-2">
          <div className="col">
            <button
              onClick={this.fillAllFeeders}
              className="btn btn-success btn-lg btn-block"
            >
              <i className="fas fa-arrow-up"></i>
            </button>
          </div>
          <div className="col">
            <button
              onClick={this.emptyAllFeeders}
              className="btn btn-danger btn-lg btn-block"
            >
              <i className="fas fa-arrow-down"></i>
            </button>
          </div>
          {machineType === 'LOCKER' && (
            <div className="col">
              <button
                onClick={this.openAll}
                className="btn btn-secondary btn-lg btn-block"
              >
                Otwórz
              </button>
            </div>
          )}
          <div className="col">
            <button
              onClick={this.saveFeeders}
              className="btn btn-secondary btn-lg btn-block"
            >
              Zapisz
            </button>
          </div>
        </div>
        <MachineProductsBoost
          machineProducts={machineProducts}
          onFillSingleFeeder={this.fillSingleFeeder}
          onEmptySingleFeeder={this.emptySingleFeeder}
        />
      </Fragment>
    )
  }
}

export default MachineProductBoostView
