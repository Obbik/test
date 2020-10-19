import React, { useContext } from 'react'
import ReactTimeAgo from 'react-time-ago'
import ReactTooltip from 'react-tooltip'
import { LangContext } from '../../context/lang-context'
import getColorByStatus from '../../util/getColorByStatus'

export default ({ machines, handleSelectMachine }) => {
  const { TRL_Pack } = useContext(LangContext)

  return (
    <>
      <div className="overflow-auto">
        <table className="table table-striped border text-center table-monitoring">
          <thead>
            <tr>
              <th style={{ width: '1%' }} />
              <th>Ost. sygnał</th>
              <th>{TRL_Pack.monitoring.machine}</th>
              {/* <th className="d-none d-md-table-cell">{TRL_Pack.monitoring.serialNo}</th> */}
              <th className="d-none d-md-table-cell">
                {TRL_Pack.monitoring.technicalData}
              </th>
              <th>{TRL_Pack.monitoring.transactions}</th>
              {localStorage.getItem('zeroTier') === 'true' && (
                <th style={{ width: '1%' }}></th>
              )}
              <th style={{ width: '1%' }} colSpan="2" />
            </tr>
          </thead>
          <tbody>
            {machines.length &&
              machines
                .sort((a, b) => b.trx_count - a.trx_count)
                .map((machine, idx) => (
                  <tr key={idx}>
                    <td>
                      {/* <i
                        className="fas fa-microchip text-info"
                        style={{
                          textShadow: '#007bff 0px 0px 1px'
                        }}
                        data-type="info"
                        data-tip={machine.software_version.split('.').join('<br />')}
                      /> */}
                      {machine.summary_status === 2 ? (
                        <i className="fa fa-check text-success mx-2" />
                      ) : machine.summary_status === 1 ? (
                        <i className="fa fa-exclamation-triangle text-warning mx-2" />
                      ) : (
                        <i className="fa fa-exclamation-circle text-danger mx-2" />
                      )}
                    </td>
                    <td>
                      <ReactTimeAgo date={new Date(machine.lastHeartbeat)} locale="pl" />
                    </td>
                    <td>
                      <span className="d-block">
                        {machine.name}
                        <span className="ml-1 font-italic">({machine.type})</span>
                      </span>
                      <span className="d-block small mt-1 font-weight-bolder">
                        {machine.customer_name}
                      </span>
                    </td>
                    {/* <td className="d-none d-md-table-cell">{machine.serialNo}</td> */}
                    <td className="d-none d-md-table-cell">
                      {/* <a
                        href={`http://${machine.ip}:8080`}
                        className="text-decoration-none small"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {machine.ip}
                      </a>
                      <br /> */}
                      <span className="small">{machine.serialNo}</span>
                      <br />
                      <span className="small">{machine.terminal}</span>
                      {/* <br />
                      <span className="small">{machine.terminal}</span> */}
                    </td>
                    <td>{machine.trx_count}</td>
                    {localStorage.getItem('zeroTier') === 'true' && (
                      <td>
                        <a
                          href={`http://${machine.ip}:8080`}
                          className="btn btn-link link-icon text-decoration-none small"
                          target="_blank"
                          rel="noopener noreferrer"
                          title={machine.ip}
                        >
                          <i className="fas fa-globe-europe" />
                        </a>
                      </td>
                    )}
                    <td className="align-middle">
                      <div className="d-flex">
                        {/* <i
                          style={{
                            textShadow: '#007bff 0px 0px 3px',
                            color: getColorByStatus(machine.heartbeat_status)
                          }}
                          className="fas fa-heart mr-2"
                          data-type="info"
                          data-tip={`Ostatni sygnał: <br />${machine.lastHeartbeat}`}
                        /> */}
                        <i
                          style={{
                            textShadow: '#007bff 0px 0px 3px',
                            color: getColorByStatus(machine.trx_status)
                          }}
                          className="fas fa-money-bill-wave"
                          data-type="info"
                          data-tip={machine.transactions
                            .slice(0, 5)
                            .map(trx => trx.status)
                            .join('<br />')}
                        />
                        {/* <i
                      style={{
                        textShadow: '#007bff 0px 0px 3px',
                        color: getColorByStatus(machine.notification_status)
                      }}
                      className="fas fa-bell mx-2"
                    />
                    <i
                      style={{
                        textShadow: '#007bff 0px 0px 3px',
                        color: getColorByStatus(machine.gsm_status)
                      }}
                      className="fas fa-rss ml-2"
                    /> */}
                      </div>
                    </td>
                    <td>
                      {/* <Link
                      to={`/config/${machine.serialNo}`}
                      className="d-flex p-1 mr-2 btn btn-link text-decoration-none"
                    >
                      <i className="fa fa-cog" />
                    </Link>
                    <Link
                      to={`/supply/${machine.serialNo}`}
                      className="d-flex p-1 mx-2 btn btn-link text-decoration-none"
                    >
                      <i className="fa fa-cart-plus" />
                    </Link> */}
                      <button
                        className="btn btn-link text-decoration-none link-icon"
                        onClick={handleSelectMachine(idx)}
                      >
                        <i className="fa fa-info-circle" />
                      </button>
                    </td>
                    {/* <td>
                  <i className="btn fas fa-sync mx-2" />
                </td> */}
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
      <ReactTooltip multiline border />
    </>
  )
}
