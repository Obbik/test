import React, { useState, useEffect, useContext } from 'react'
import { LangContext } from '../../context/lang-context'
import FormSkel from './FormSkel'

export default ({ deleteProduct, handleClose, ean, IsSubscribed, unsubscribeProduct, categoryId, deleteCategory, deleteLabel }) => {
    const { TRL_Pack } = useContext(LangContext)
    const HandleDelete = evt => {
        evt.preventDefault()
        if (!deleteLabel)
            !categoryId ? (!IsSubscribed ? deleteProduct(ean) : unsubscribeProduct(ean)) : (deleteCategory(categoryId))
        else deleteLabel()
        handleClose()
    }
    const displayMessage = () => {
        if (deleteLabel) {
            return TRL_Pack.modalDisplays.deleteTag
        }
        else if (categoryId) {
            return TRL_Pack.modalDisplays.deleteCategory
        }
        else if (IsSubscribed) {
            return TRL_Pack.modalDisplays.unsubscribeProduct
        }
        else {
            return `${TRL_Pack.modalDisplays.delEan}: ${ean}`
        }
    }
    return (
        < FormSkel
            headerText={TRL_Pack.modalDisplays.del}
            handleClose={handleClose}
            acceptForm="true"
        >
            <>
                <form onSubmit={HandleDelete} id="modal-form">
                    <div >
                        <label >
                            {displayMessage()}
                        </label>
                    </div>
                </form>
            </>
        </FormSkel >
    )
}
