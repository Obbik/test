import React, { useState } from 'react'

import MachineReportForm from '../Modals/MachineReportForm'

export default () => {
  // const [reports, setReports] = useState([
  //   {
  //     name: 'Październik 2019',
  //     fileType: 'pdf',
  //     dateFrom: '00:00 2018-09-30',
  //     dateTo: '23:59 2018-09-31'
  //   },
  //   {
  //     name: 'Wrzesień 2020',
  //     fileType: 'xlsx',
  //     dateFrom: '00:00 2018-08-20',
  //     dateTo: '23:59 2018-12-27'
  //   }
  // ])
  const reports = [
    {
      name: 'Październik 2019',
      fileType: 'pdf',
      dateFrom: '00:00 2018-09-30',
      dateTo: '23:59 2018-09-31'
    },
    {
      name: 'Wrzesień 2020',
      fileType: 'xlsx',
      dateFrom: '00:00 2018-08-20',
      dateTo: '23:59 2018-12-27'
    }
  ]
  const [reportFormModal, setReportFormModal] = useState(false)

  return (
    <>
      <div className="col">
        <div className="card">
          <h5 className="card-header">
            Raporty
            <button
              className="float-right btn btn-sm btn-link text-decoration-none"
              onClick={() => setReportFormModal(true)}
            >
              <i className="fas fa-plus mr-2" /> Nowy
            </button>
          </h5>
          <div className="card-body">
            {reports.length ? (
              <table className="table table-striped" style={{ maxHeight: 550 }}>
                <thead>
                  <tr>
                    <th style={{ width: '1%' }} />
                    <th style={{ width: '1%' }}>Format</th>
                    <th>Nazwa</th>
                    <th>Od</th>
                    <th>Do</th>
                    <th style={{ width: '1%' }} />
                    <th style={{ width: '1%' }} />
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report, idx) => (
                    <tr key={idx}>
                      <td>
                        <a
                          href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-link p-1"
                        >
                          <i className="fas fa-external-link-alt text-secondary" />
                        </a>
                      </td>
                      <td className="text-center">
                        {report.fileType === 'pdf' ? (
                          <i className="far fa-file-pdf" />
                        ) : (
                            report.fileType === 'xlsx' && (
                              <i className="far fa-file-excel" />
                            )
                          )}
                      </td>
                      <td>{report.name}</td>
                      <td>{report.dateFrom}</td>
                      <td>{report.dateTo}</td>
                      <td>
                        <button className="btn btn-info btn-sm">Szczegóły</button>
                      </td>
                      <td className="text-center">
                        <button className="btn btn-danger btn-sm">Usuń</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
                <h6 className="text-center mb-0">Brak raportów</h6>
              )}
          </div>
        </div>
      </div>
      {reportFormModal && <MachineReportForm setModal={setReportFormModal} />}
    </>
  )
}
