import React, { useState, useEffect, useContext } from 'react'

import FormSkel from './FormSkel'

export default ({ deleteProduct, handleClose, ean, IsSubscribed, unsubscribeProduct, categoryId, deleteCategory, deleteLabel }) => {
    const HandleDelete = evt => {
        evt.preventDefault()
        if (!deleteLabel)
            !categoryId ? (!IsSubscribed ? deleteProduct(ean) : unsubscribeProduct(ean)) : (deleteCategory(categoryId))
        else deleteLabel()
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

                            {!categoryId ? (IsSubscribed ? "Potwierdz odsubskrybowanie produktu" :
                                `zaakceptowanie spowoduje usuniecie o Eanie : ${ean}`) : ("Potwierdź usunięcie kategori")
                            }
                        </label>
                    </div>
                </form>
            </>
        </FormSkel >
    )
}
