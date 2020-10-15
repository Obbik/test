import React, { useContext } from 'react'
import { LangContext } from '../../context/lang-context'

export default ({ events }) => {
  const { TRL_Pack } = useContext(LangContext)

  return (
    <div className="overflow-auto">
      <table className="table table-striped">
        <thead>
          <tr>
            <th className="text-center" style={{ width: 50 }}>
              #
            </th>
            {/* <th style={{ width: 75 }}>{TRL_Pack.notifications.level}</th> */}
            <th>{TRL_Pack.notifications.alert}</th>
            <th style={{ width: 175 }}>{TRL_Pack.notifications.date}</th>
            {/* <th style={{ width: '1%' }} /> */}
          </tr>
        </thead>
        <tbody>
          {events.map((event, idx) => (
            <tr key={idx}>
              <td className="font-weight-bold text-center">{idx + 1}</td>
              {/* <td>{event.level}</td> */}
              <td>{event.type}</td>
              <td>{event.create_date_time}</td>
              {/* <td>
                <button className="btn btn-link link-icon">
                  <i className="fas fa-trash-alt" />
                </button>
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
