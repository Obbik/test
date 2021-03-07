import React, { useState, useEffect, useContext } from 'react'

import FormSkel from './FormSkel'

export default ({ deleteProduct, handleClose, ean, IsSubscribed, unsubscribeProduct }) => {
    const HandleDelete = evt => {
        evt.preventDefault()
        !IsSubscribed ? deleteProduct(ean) : unsubscribeProduct(ean)
        handleClose()
    }
    return (
        < FormSkel
            headerText={"Usuń produkt"}
            handleClose={handleClose}
            acceptForm="true"
        >
            <>
                <form onSubmit={HandleDelete} id="modal-form">
                    <div >
                        <label >
                            {IsSubscribed ? "Potwierdz odsubskrybowanie produktu" :
                                `zaakceptowanie spowoduje usuniecie o Eanie : ${ean}`
                            }
                        </label>
                    </div>
                </form>
            </>
        </FormSkel >
    )
}
