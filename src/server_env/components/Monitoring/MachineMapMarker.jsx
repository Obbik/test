import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Marker } from 'react-google-maps'
import InfoBox from 'react-google-maps/lib/components/addons/InfoBox'

import greenPin from '../../assets/pins/green-pin.png'
import yellowPin from '../../assets/pins/yellow-pin.png'
import redPin from '../../assets/pins/red-pin.png'

export default ({ machines }) => {
  const history = useHistory()
  const [infoBox, setInfoBox] = useState(true)

  const getColorByStatus = status => {
    if (status === 2) return 'green'
    else if (status === 1) return 'yellow'
    else return 'red'
  }

  return (
    <>
      {infoBox && (
        <InfoBox
          defaultPosition={
            new window.google.maps.LatLng(machines[0].lat, machines[0].lng)
          }
          options={{ closeBoxURL: ``, enableEventPropagation: true }}
        >
          <div
            className="rounded border border-secondary"
            style={{
              opacity: 0.8,
              fontSize: `16px`,
              textAlign: 'center',
              cursor: 'pointer'
            }}
          >
            {machines.map((machine, idx) => (
              <div
                key={idx}
                className="p-2"
                onClick={() => history.push(`/status/${machine.serialNo}`)}
                style={{ backgroundColor: getColorByStatus(machine.summary_status) }}
              >
                <div className="px-2 mb-2 text-light">
                  <small className="font-weight-bold">{machine.name}</small>
                </div>
                <div className="px-2 py-1 rounded bg-light">
                  <i
                    style={{
                      textShadow: '#007bff 0px 0px 2px',
                      color: getColorByStatus(machine.heartbeat_status)
                    }}
                    className="fas fa-heart mx-2"
                  />
                  <i
                    style={{
                      textShadow: '#007bff 0px 0px 2px',
                      color: getColorByStatus(machine.trx_status)
                    }}
                    className="fas fa-money-bill-wave mx-2"
                  />
                  <i
                    style={{
                      textShadow: '#007bff 0px 0px 2px',
                      color: getColorByStatus(machine.notification_status)
                    }}
                    className="fas fa-bell mx-2"
                  />
                  <i
                    style={{
                      textShadow: '#007bff 0px 0px 2px',
                      color: getColorByStatus(machine.gsm_status)
                    }}
                    className="fas fa-rss mx-2"
                  />
                </div>
              </div>
            ))}
          </div>
        </InfoBox>
      )}
      <Marker
        onClick={() => setInfoBox(prev => !prev)}
        options={{
          icon: machines.every(m => m.summary_status === 2)
            ? greenPin
            : machines[0].summary_status === 1
            ? yellowPin
            : redPin
        }}
        position={{ lat: machines[0].lat, lng: machines[0].lng }}
      />
    </>
  )
}
