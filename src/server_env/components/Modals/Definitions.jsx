import React, { useRef, useEffect, useContext } from 'react'
import { LangContext } from '../../context/lang-context'
import { Link } from 'react-router-dom'
import onClickAway from '../../util/onClickAway'

export default ({ handleClose }) => {
  const { TRL_Pack } = useContext(LangContext)
  const modalRef = useRef(null)

  const definitions = [
    {
      text: TRL_Pack.definitions.products,
      path: ['/definitions/products', '/definitions/products/:categoryId'],
      icon: 'fas fa-cookie'
    },
    {
      text: TRL_Pack.definitions.categories,
      path: '/definitions/categories',
      icon: 'fas fa-bookmark'
    }
    // {
    //   text: TRL_Pack.definitions.locations,
    //   path: '/definitions/locations',
    //   icon: 'fas fa-globe-europe'
    // },
    // {
    //   text: TRL_Pack.definitions.machineTypes,
    //   path: '/definitions/machine-types',
    //   icon: 'fas fa-hdd'
    // },
    // {
    //   text: TRL_Pack.definitions.maintenances,
    //   path: '/definitions/maintenances',
    //   icon: 'fas fa-microchip'
    // }
  ]

  useEffect(
    () => onClickAway(modalRef, handleClose),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  return (
    <div className="modal fade show d-block" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div ref={modalRef} className="modal-content border-0">
          <div className="modal-header bg-light align-items-center">
            <h6 className="modal-title">Wybierz sekcje</h6>
            <button
              onClick={handleClose}
              className="btn fas fa-times text-secondary p-1"
            />
          </div>
          <div className="modal-body mb-n2">
            {definitions.map((route, idx) => (
              <div key={idx} className="mb-2">
                <Link
                  to={Array.isArray(route.path) ? route.path[0] : route.path}
                  onClick={handleClose}
                  className="btn list-group-item list-group-item-action rounded"
                >
                  <i className={`mr-3 ${route.icon}`} />
                  {route.text}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
