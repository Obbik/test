import React, { Component } from 'react';

class SearchInput extends Component {
    handleChange = e => {
        e.preventDefault();
        const inputValue = e.target.value;
        this.props.onSearch(inputValue);
    }

    render() {
        const viewButton = this.props.tableView ? 
            <button onClick={this.props.onToggleView} type="button" className="btn btn-light"><i className="fas fa-list"></i></button> :
            <button onClick={this.props.onToggleView} type="button" className="btn btn-light"><i className="fas fa-border-all"></i></button>

        return(
            <div className="row mb-3">
                <div className="col-10">
                    <div className="input-group">
                        <div className="input-group-prepend">
                            <span className="input-group-text border-0"><i className="fas fa-search"></i></span>
                        </div>
                        <input onChange={this.handleChange} name="search" type="text" className="form-control border-top-0 border-left-0 border-right-0 rounded-0 shadow-none" placeholder="Szukaj..."/>
                    </div>
                </div>
                <div className="col-2">
                    <div className="btn-group float-right" role="group">
                        {viewButton}
                    </div> 
                </div>
            </div>
        )
    }
}

export default SearchInput;