import React from 'react'

// const logo = require('../../assets/images/logo-vendim.png');

export default ({ onLogin }) => {
  const handleSubmit = e => {
    e.preventDefault()

    const Email = e.target.elements.email.value
    const Password = e.target.elements.password.value
    const ClientId = e.target.elements.clientId.value

    if (Email && Password && ClientId)
      onLogin({
        Email,
        Password,
        ClientId
      })
  }

  const returnToShop = () => {
    window.location.href = 'http://localhost:8080/shop'
  }

  return (
    <div className="row">
      {/* d-flex align-items-center min-vh-100 */}
      <div className="col-md-6 mx-auto">
        <button onClick={returnToShop} className="btn btn-secondary">
          <i className="fas fa-arrow-left"></i> Wróć do sklepu
        </button>
        <div className="card card-body bg-light mt-5">
          <div className="text-center">
            {/* <div className="mt-2 mb-4">
                    <img src={logo} alt="logo" height="80" />
                </div> */}
            <h2>Zaloguj się</h2>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                defaultValue="test@gmail.com"
                className="form-control form-control-lg"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Hasło</label>
              <input
                type="password"
                name="password"
                defaultValue="123456!@#$%^"
                autoComplete="off"
                className="form-control form-control-lg"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Id klienta</label>
              <input
                type="text"
                name="clientId"
                className="form-control form-control-lg"
                defaultValue="multivend"
                required
              />
            </div>
            <div className="row">
              <div className="col">
                <input
                  type="submit"
                  value="Zaloguj się"
                  className="btn btn-success btn-block"
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
