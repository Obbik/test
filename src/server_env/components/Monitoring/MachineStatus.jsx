import React /*, { useContext } */ from 'react'
// import { LangContext } from '../../context/lang-context'

export default ({ machine }) => {
  // const { TRL_Pack } = useContext(LangContext)

  return (
    <ul className="list-group list-group-flush">
      <li className="list-group-item">
        Nazwa maszyny <span className="ml-2 text-monospace">{machine.name}</span>
      </li>
      <li className="list-group-item">
        Model <span className="ml-2 text-monospace">{machine.type}</span>
      </li>
      <li className="list-group-item">
        Nr seryjny <span className="ml-2 text-monospace">{machine.serialNo}</span>
      </li>
      <li className="list-group-item">
        Terminal <span className="ml-2 text-monospace">{machine.terminal}</span>
      </li>
      <li className="list-group-item">
        ZeroTier IP <span className="ml-2 text-monospace">{machine.ip}</span>
      </li>
      <li className="list-group-item">
        Właściciel <span className="ml-2 text-monospace">{machine.customer_name}</span>
      </li>
      <li className="list-group-item">
        Ilość transakcji <span className="ml-2 text-monospace">{machine.trx_count}</span>
      </li>
      <li className="list-group-item">
        Ostatni sygnał<span className="ml-2 text-monospace">{machine.lastHeartbeat}</span>
      </li>
      <li className="list-group-item">
        Zajęte miejsce na dysku
        <span className="ml-2 text-monospace">{machine.disk_usage}</span>
      </li>
      <li className="list-group-item">
        Wersja oprogramowania
        <div className="overflow-auto">
          <table className="mt-2 table table-borderless text-center">
            <thead>
              <tr>
                <td>Shop</td>
                <td>API</td>
                <td>Dashboard</td>
                <td>RPI</td>
                <td>Main_Hex</td>
                <td>MDB_Hex</td>
                <td>RS232_Hex</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                {machine.software_version.split('.').map((comp, idx) => (
                  <td key={idx}>{comp.replace(/[^\d]/g, '')}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </li>
    </ul>
  )
}
