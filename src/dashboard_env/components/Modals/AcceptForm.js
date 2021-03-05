import React, { useState, useEffect, useContext } from 'react'
import { LangContext } from '../../context/lang-context'

import sampleProduct from '../../assets/images/sample-product.svg'

import useFetch from '../../hooks/fetchMSSQL-hook'

import { API_URL } from '../../config/config'
import FormSkel from './FormSkel'

export default ({ form, productData, getProducts, handleClose, ean }) => {
    console.log(ean)
    return (
        < FormSkel
            // headerText={(productData.IsSubscribed === 1 ? "potwierdź usuniecie produktu" : "potwierdz odsubskrybowanie produktu")}
            handleClose={handleClose}
            acceptForm="true"
        >

            <div>
                zaakceptowanie spowoduje usuniecie
            </div>
        </FormSkel >
    )
}
