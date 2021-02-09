import React, { useState } from 'react'

export default ({ setModal }) => {
  const [detailsView, setDetailsView] = useState(false)
  const toggleDetailsView = () => setDetailsView(prev => !prev)

  return (
    <div className="modal fade show d-block" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header bg-light align-items-center">
            <h6 className="modal-title">Nowy raport</h6>
            <button
              onClick={() => setModal(false)}
              className="btn fas fa-times text-secondary p-0"
            />
          </div>
          <div className="modal-body">
            <form>
              <div className="form-group">
                <label>Nazwa raportu</label>
                <input className="form-control" />
              </div>
              <div className="form-group row">
                <div className="col-6">
                  <label>Od</label>
                  <input
                    type="date"
                    max={new Date().toISOString().substr(0, 10)}
                    className="form-control mb-2"
                  />
                  <input type="time" defaultValue="00:00" className="form-control" />
                </div>
                <div className="col-6">
                  <label>Do</label>
                  <input
                    type="date"
                    max={new Date().toISOString().substr(0, 10)}
                    defaultValue={new Date().toISOString().substr(0, 10)}
                    className="form-control mb-2"
                  />
                  <input type="time" defaultValue="23:59" className="form-control" />
                </div>
              </div>
              <div className="form-group row">
                <div className="col-3">
                  <label>Format</label>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value=""
                      id="defaultCheck1"
                      defaultChecked
                    />
                    <label className="form-check-label" htmlFor="defaultCheck1">
                      EXCEL
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value=""
                      id="defaultCheck2"
                    />
                    <label className="form-check-label" htmlFor="defaultCheck2">
                      PDF
                    </label>
                  </div>
                </div>
                <div className="col-9">
                  <label>Ważność linku</label>
                  <div className="row no-gutters">
                    <div className="col-6 pr-1">
                      <input
                        type="number"
                        className="form-control"
                        min={1}
                        defaultValue={3}
                      />
                    </div>
                    <div className="col-6">
                      <select className="form-control">
                        <option>Godziny</option>
                        <option selected>Dni</option>
                        <option>Tygodnie</option>
                        <option>Miesiące</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <label>
                  Zawansowane
                  <span
                    className={`ml-2 btn text-secondary fas fa-chevron-${
                      detailsView ? 'up' : 'down'
                    }`}
                    onClick={toggleDetailsView}
                  />
                </label>
                {detailsView && <h4 className="text-center">* wip *</h4>}
              </div>
            </form>
          </div>
          <div className="modal-footer bg-light">
            <button
              type="submit"
              className="btn btn-success btn-sm m-0"
              form="category-form"
            >
              Utwórz
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
