import React from 'react'
import { Link } from 'react-router-dom'

export default ({ title, buttonName, buttonLink }) => (
  <div className="row mb-3">
    <div className="col-sm">
      <h2>{title}</h2>
    </div>
    <div className="col-sm">
      {buttonLink && (
        <Link to={buttonLink} className="btn btn-success btn-sm float-right">
          <i className="fa fa-plus"></i> &nbsp; {buttonName}
        </Link>
      )}
    </div>
  </div>
)
