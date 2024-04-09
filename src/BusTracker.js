import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Define the marker icon using the images from Leaflet's package
const markerIcon = new L.Icon({
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const myLocationIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png',
  iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.4/images/marker-shadow.png',
  shadowSize: [41, 41]
});



function BusTracker() {
  const [busLocations, setBusLocations] = useState([]);
  const [mapCenter, setMapCenter] = useState([13.038321, 80.213593]); // Default center
  // Assuming these are your coordinates; replace these with real values or state
  const myLat = 13.004202; 
  const myLon = 80.201471;

  useEffect(() => {
    async function fetchBusLocations() {
      try {
        const response = await axios.get('http://localhost:5000/api/bus-locations');
        setBusLocations(response.data);
        if (response.data.length > 0) {
          const avgLat = response.data.reduce((acc, cur) => acc + cur.lat, 0) / response.data.length;
          const avgLon = response.data.reduce((acc, cur) => acc + cur.lon, 0) / response.data.length;
          setMapCenter([avgLat, avgLon]); // Update map center
        }
      } catch (error) {
        console.error('Error fetching bus locations:', error);
      }
    }

    fetchBusLocations();
  }, []);

  return (
    <MapContainer center={mapCenter} zoom={12} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {busLocations.map(bus => (
        <Marker key={bus.id} position={[bus.lat, bus.lon]} icon={markerIcon}>
          <Popup>{bus.name}</Popup>
        </Marker>
      ))}
      {/* Add marker for your location */}
      <Marker position={[myLat, myLon]} icon={myLocationIcon}>
  <Popup>You are here</Popup>
</Marker>
    </MapContainer>
  );
}

export default BusTracker;