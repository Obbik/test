import React from 'react'
import './Loader.css'

export default ({ active }) => <>{active && <div className="loading" />}</>
