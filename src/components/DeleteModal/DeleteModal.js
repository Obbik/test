import React from 'react';

const deleteModal = props => {
    const modalClass = props.showModal ? "modal fade show" : "modal fade";
    const style = props.showModal ? {
        display: 'block'
    } : null;

    return(
        <div className={modalClass} style={style}>
            <div className="modal-dialog">
                {/* modal-dialog-centered */}
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Usuń</h5>
                        <button onClick={props.onHideModal} type="button" className="close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        Czy na pewno chcesz usunąć obiekt?
                    </div>
                    <div className="modal-footer">
                        <button onClick={props.onHideModal} type="button" className="btn btn-secondary">Anuluj</button>
                        <button onClick={props.onDeleteObject}type="button" className="btn btn-danger">Usuń</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default deleteModal;