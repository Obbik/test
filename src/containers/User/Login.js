import React, { Component } from "react";

// const logo = require("../../img/logo-vendim.png");

class Login extends Component {
	handleSubmit = e => {
        e.preventDefault();
		const Email = e.target.elements.email.value;
		const Password = e.target.elements.password.value;

		const user = {
			Email,
			Password
		};

		if (Email && Password) {
			this.props.onLogin(user);
		}
	}

	render() {
		return (
            <div className="row">
                {/* d-flex align-items-center min-vh-100 */}
                <div className="col-md-6 mx-auto">
                    <div className="card card-body bg-light mt-5">
                        <div className="text-center">
                            <h2>Zaloguj się</h2>
                        </div>
                        <form onSubmit={this.handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input type="email" name="email" autoComplete="username" className="form-control form-control-lg" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Hasło</label>
                                <input type="password" name="password" autoComplete="current-password" className="form-control form-control-lg" />
                            </div>
                            <div className="row">
                                <div className="col">
                                    <input type="submit" value="Zaloguj się" className="btn btn-success btn-block" />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
		);
	}
}

export default Login;