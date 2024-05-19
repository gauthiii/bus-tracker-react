import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { API_URL } from './App'; 

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

function BusTracker({ selectedBus }) {
  const [busLocations, setBusLocations] = useState([]);
  const [mapCenter, setMapCenter] = useState([13.038321, 80.213593]); // Default center
  const [mapZoom, setMapZoom] = useState(12); // Default zoom level
  const [myLat,setLat] = useState(13.004202)
  const [myLon,setLon] = useState(80.201471)

  navigator.geolocation.getCurrentPosition(async (position) => {
    const { latitude, longitude } = position.coords;

    setLat(latitude)
    setLon(longitude)
   

  
}, (err) => {
    console.error('Error obtaining location:', err.message);
    alert('Failed to get current location. Please ensure location services are enabled.');
  
});

useEffect(() => {
  if (selectedBus) {
    setMapCenter([selectedBus.lat, selectedBus.lon]);
    setMapZoom(15); // A good zoom level to focus on the bus
  }
}, [selectedBus]);  // Ensure effect runs only when selectedBus changes



  useEffect(() => {
    async function fetchBusLocations() {
      try {
        const response = await axios.get(`${API_URL}/api/bus-locations`);
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

  const createBusIcon = (busName) => {
    return L.divIcon({
      className: 'custom-icon',
      html: `<div>${busName}</div>`,
      iconSize: [25, 25],
      iconAnchor: [25, 50]
    });
  };

  const handleBusClick = (bus) => {
    setMapCenter([bus.lat, bus.lon]);
    setMapZoom(15); // Zoom level to be adjusted as per requirement
  };

  return (
    <MapContainer center={mapCenter} zoom={mapZoom} style={{ height: '550px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {busLocations.map(bus => (
        <Marker key={bus.id} position={[bus.lat, bus.lon]} icon={createBusIcon(bus.name)} eventHandlers={{ click: () => handleBusClick(bus) }} />
      ))}
      <Marker position={[myLat, myLon]} icon={myLocationIcon} />
    </MapContainer>
  );
}

export default BusTracker;
