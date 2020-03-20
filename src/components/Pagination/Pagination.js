import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

const pagination = (props) => {
    const page = props.page;
    const pages = Math.ceil(props.totalItems / 24);
    let paginationBar = null;

    if(pages > 1) {
        if(pages < 5) {
            paginationBar = [...Array(pages)].map((e, i) => <li key={i} className="page-item"><Link to="#" onClick={() => props.onSwitchPage(i + 1)} className="page-link">{i + 1}</Link></li>);
        } else if(pages >= 5) {
            if(page <= 3) {
                paginationBar = 
                    <Fragment>
                        <li className="page-item"><Link to="#" onClick={() => props.onSwitchPage(1)} className="page-link">{1}</Link></li>
                        <li className="page-item"><Link to="#" onClick={() => props.onSwitchPage(2)} className="page-link">{2}</Link></li>
                        <li className="page-item"><Link to="#" onClick={() => props.onSwitchPage(3)} className="page-link">{3}</Link></li>
                        {page === 3 ? <li className="page-item"><Link to="#" onClick={() => props.onSwitchPage(4)} className="page-link">{4}</Link></li> : null}
                        <li className="page-item"><Link to="#" className="page-link">...</Link></li>
                        <li className="page-item"><Link to="#" onClick={() => props.onSwitchPage(pages)} className="page-link">{pages}</Link></li>
                    </Fragment>
            } else if(page > 3 && page < pages - 2) {
                paginationBar = 
                    <Fragment>
                        <li className="page-item"><Link to="#" onClick={() => props.onSwitchPage(1)} className="page-link">{1}</Link></li>
                        <li className="page-item"><Link to="#" className="page-link">...</Link></li>
                        <li className="page-item"><Link to="#" onClick={() => props.onSwitchPage(page - 1)} className="page-link">{page - 1}</Link></li>
                        <li className="page-item"><Link to="#" onClick={() => props.onSwitchPage(page)} className="page-link">{page}</Link></li>
                        <li className="page-item"><Link to="#" onClick={() => props.onSwitchPage(page + 1)} className="page-link">{page + 1}</Link></li>
                        <li className="page-item"><Link to="#" className="page-link">...</Link></li>
                        <li className="page-item"><Link to="#" onClick={() => props.onSwitchPage(pages)} className="page-link">{pages}</Link></li>
                    </Fragment>
            } else if(page >= pages - 2) {
                paginationBar = 
                    <Fragment>
                        <li className="page-item"><Link to="#" onClick={() => props.onSwitchPage(1)} className="page-link">{1}</Link></li>
                        <li className="page-item"><Link to="#" className="page-link">...</Link></li>
                        {page === pages - 2 ? <li className="page-item"><Link to="#" onClick={() => props.onSwitchPage(pages - 3)} className="page-link">{pages - 3}</Link></li> : null}
                        <li className="page-item"><Link to="#" onClick={() => props.onSwitchPage(pages - 2)} className="page-link">{pages - 2}</Link></li>
                        <li className="page-item"><Link to="#" onClick={() => props.onSwitchPage(pages - 1)} className="page-link">{pages - 1}</Link></li>
                        <li className="page-item"><Link to="#" onClick={() => props.onSwitchPage(pages)} className="page-link">{pages}</Link></li>
                    </Fragment>
            }
        }   
    }

    return (
        <nav aria-label="Page navigation example">
            <ul className="pagination justify-content-center">
                {paginationBar}
            </ul>
        </nav>
    )
}

export default pagination;