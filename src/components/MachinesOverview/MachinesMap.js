import React, { useEffect, useState } from 'react'
import { compose, withProps } from 'recompose'
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps'
import InfoBox from 'react-google-maps/lib/components/addons/InfoBox'

import greenPin from '../../assets/pins/green-pin.png'
import yellowPin from '../../assets/pins/yellow-pin.png'
import redPin from '../../assets/pins/red-pin.png'

export default ({ machines }) => {
  useEffect(() => {
    return () =>
      document.querySelectorAll('script[src*="map"]').forEach(el => el.remove())
  })

  const [infoBox, setInfoBox] = useState(false)

  const getStatusColor = status => {
    if (status === 2) return 'green'
    else if (status === 1) return 'yellow'
    else return 'red'
  }

  return compose(
    withProps({
      googleMapURL:
        'https://maps.googleapis.com/maps/api/js?key=AIzaSyAVuam0wLMHMAQDR3WrUpoaExs7WZMutxc&?v=3.exp&libraries=geometry,drawing,places',
      loadingElement: <div style={{ height: `100%` }} />,
      containerElement: <div style={{ height: `600px` }} />,
      mapElement: <div style={{ height: `100%` }} />
    }),
    withScriptjs,
    withGoogleMap
  )(() => (
    <GoogleMap defaultZoom={15} defaultCenter={{ lat: 53.37, lng: 14.47 }}>
      {infoBox && (
        <InfoBox
          defaultPosition={new window.google.maps.LatLng(infoBox.lat, infoBox.lng)}
          options={{ closeBoxURL: ``, enableEventPropagation: true }}
        >
          <div
            style={{
              backgroundColor: getStatusColor(infoBox.summary_status),
              opacity: 0.8,
              padding: '8px',
              fontSize: `16px`,
              color: 'black',
              textAlign: 'center'
            }}
          >
            <div className="px-2 py-1">{infoBox.name}</div>
            <hr className="my-2" />
            <div
              className="mb-1 px-2 py-1"
              style={{ backgroundColor: getStatusColor(infoBox.heartbeat_status) }}
            >
              Heartbeat
            </div>
            <div
              className="mb-1 px-2 py-1"
              style={{ backgroundColor: getStatusColor(infoBox.trx_status) }}
            >
              Transactions
            </div>
            <div
              className="mb-1 px-2 py-1"
              style={{ backgroundColor: getStatusColor(infoBox.notification_status) }}
            >
              Notifications
            </div>
            <div
              className="px-2 py-1"
              style={{ backgroundColor: getStatusColor(infoBox.gsm_status) }}
            >
              GMS
            </div>
          </div>
        </InfoBox>
      )}
      {machines.map((machine, idx) => (
        <Marker
          key={idx}
          onClick={() =>
            setInfoBox(prev => {
              if (prev.serialNo === machine.serialNo) return false
              else return machine
            })
          }
          options={{
            icon:
              machine.summary_status === 2
                ? greenPin
                : machine.summary_status === 1
                ? yellowPin
                : redPin
          }}
          position={{ lat: machine.lat, lng: machine.lng }}
        />
      ))}
    </GoogleMap>
  ))()
}
