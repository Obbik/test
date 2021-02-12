import React, { useEffect } from 'react'
import { compose, withProps } from 'recompose'
import { withScriptjs, withGoogleMap, GoogleMap } from 'react-google-maps'
import MapMarker from './MachineMapMarker'

export default ({ machines }) => {
  useEffect(
    () => () =>
      document.querySelectorAll('script[src*="map"]').forEach(el => el.remove()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  let machinesByPosition = {}

  machines.forEach(m => {
    if (machinesByPosition[`${m.lat.toFixed(2)}-${m.lng.toFixed(2)}`])
      machinesByPosition[`${m.lat.toFixed(2)}-${m.lng.toFixed(2)}`].push(m)
    else machinesByPosition[`${m.lat.toFixed(2)}-${m.lng.toFixed(2)}`] = [m]
  })

  return compose(
    withProps({
      googleMapURL:
        'https://maps.googleapis.com/maps/api/js?key=AIzaSyAVuam0wLMHMAQDR3WrUpoaExs7WZMutxc&?v=3.exp&libraries=geometry,drawing,places',
      loadingElement: <div style={{ height: `100%` }} />,
      containerElement: <div style={{ height: `650px` }} />,
      mapElement: <div style={{ height: `100%` }} />
    }),
    withScriptjs,
    withGoogleMap
  )(() => (
    <GoogleMap defaultZoom={6.5} defaultCenter={{ lat: 52, lng: 19.4 }}>
      {Object.keys(machinesByPosition).map((key, idx) => (
        <MapMarker key={idx} machines={machinesByPosition[key]} />
      ))}
    </GoogleMap>
  ))()
}
