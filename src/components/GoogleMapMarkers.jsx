import React, { useEffect, useRef } from 'react'

const GoogleMapMarkers = ({ locations }) => {
  const mapRef = useRef(null)

  useEffect(() => {
    const loadGoogleMapsScript = () => {
      if (!window.google) {
        const script = document.createElement('script')
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAP_API}&libraries=places`
        script.async = true
        script.defer = true
        script.onload = initMap
        document.head.appendChild(script)
      } else {
        initMap()
      }
    }

    const initMap = () => {
      if (!locations || locations.length === 0) return

      const map = new window.google.maps.Map(mapRef.current, {
        zoom: 6,
        center: {
          lat: locations[0].latitude,
          lng: locations[0].longitude,
        },
      })

      const infowindow = new window.google.maps.InfoWindow()

      locations.forEach((loc) => {
        const marker = new window.google.maps.Marker({
          position: { lat: loc.latitude, lng: loc.longitude },
          map,
          title: loc.name,
        })

        marker.addListener('click', () => {
          infowindow.setContent(`<div><b>${loc.name}</b></div>`)
          infowindow.open(map, marker)
        })
      })
    }

    loadGoogleMapsScript()
  }, [locations])

  return <div ref={mapRef} style={{ height: '500px', width: '100%' }} />
}

export default GoogleMapMarkers
