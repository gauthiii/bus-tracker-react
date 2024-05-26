
import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, FormControl, InputLabel, Select, MenuItem, Button,LinearProgress } from '@mui/material';
import CustomProgressBar from './CustomProgressBar'; 


// Haversine formula to calculate distance between two points on Earth
function calculateDistance(lat1, lon1, lat2, lon2) {

    
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);

  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
}

function BusList({ buses, onBusSelect }) {
  const [selectedBusId, setSelectedBusId] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState('');
  const [selectedName, setSelectedName] = useState('');
  const [filteredBuses, setFilteredBuses] = useState(buses);
  const averageSpeedKmH = 20; // Average bus speed in km/h

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
    let result = buses;

    if (selectedRoute) {
      result = result.filter(bus => bus.route === selectedRoute);
    }

    if (selectedName) {
      result = result.filter(bus => bus.name === selectedName);
    }

    const sortedBuses = result.map(bus => ({
      ...bus,
      distance: calculateDistance(myLat, myLon, bus.lat, bus.lon)
    })).sort((a, b) => a.distance - b.distance);

    setFilteredBuses(sortedBuses);
  }, [buses, selectedRoute, selectedName]);

  const handleBusSelect = (bus) => {
    if (selectedBusId === bus.id) {
      setSelectedBusId(null);
      onBusSelect(null);
    } else {
      setSelectedBusId(bus.id);
      onBusSelect(bus);
    }
  };

  const handleRouteChange = (event) => {
    setSelectedRoute(event.target.value);
    setSelectedName('');
  };

  const handleNameChange = (event) => {
    setSelectedName(event.target.value);
    setSelectedRoute('');
  };

  const resetFilter = () => {
    setSelectedRoute('');
    setSelectedName('');
  };

  return (
    <Paper elevation={3} square className="bus-list">
      <Typography variant="h6" sx={{ padding: 2, color: 'var(--primary-color)' }}>
        Available Buses
      </Typography>
      <FormControl style={{width:"100%",paddingBottom:"20px"}}>
        <InputLabel>Filter by Route</InputLabel>
        <Select
          value={selectedRoute}
          label="Filter by Destination"
          onChange={handleRouteChange}
        >
          <MenuItem value="">All Routes</MenuItem>
          {buses.map(bus => (
            <MenuItem key={bus.route} value={bus.route}>{bus.route}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl style={{width:"100%",paddingBottom:"20px"}}>
        <InputLabel>Filter by Bus</InputLabel>
        <Select
          value={selectedName}
          label="Filter by Bus Name"
          onChange={handleNameChange}
        >
          <MenuItem value="">All Buses</MenuItem>
          {buses.map(bus => (
            <MenuItem key={bus.name} value={bus.name}>{bus.name}</MenuItem>
          ))}
        </Select>
      </FormControl>


      <Button onClick={resetFilter} variant="contained" color="primary" sx={{ mb: 2 }}>Reset Filter</Button>
      {filteredBuses.map((bus, index) => {
        const distance = calculateDistance(myLat, myLon, bus.lat, bus.lon).toFixed(2);
        const travelTimeHours = distance / averageSpeedKmH;
        const travelTimeMinutes = Math.round(travelTimeHours * 60);
        const completionRate = (bus.stopsCompleted / bus.routes.length) * 100; // Calculate the percentage of stops completed

        return (
          <Box key={bus.id} onClick={() => handleBusSelect(bus)} className="bus-list-item" sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'primary' } }}>
            <Typography variant="subtitle1">
              Bus: {bus.name} {index===0 && "(Nearest Bus)"}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              
              Final Destination: {bus.route}<br />
              Current Status: {bus.status}<br />
              Estimated Arrival Time: {travelTimeMinutes} minutes <br />
              {bus.routes.length !== 0 &&  <><div style={{marginTop:10,marginBottom:10}}><CustomProgressBar totalStops={bus.routes.length} completedStops={bus.stopsCompleted} /></div> </>}
              {selectedBusId === bus.id && (
                <>
                  
                  
                  Distance: {distance} km<br />
                  
                  Stops: {bus.routes.length}<br />
                  
                  {bus.routes.map((r) => {

                    return r+"\n"

                  })} <br />
                  Unique ID: {bus.id}<br />
                </>
              )}
            </Typography>
          </Box>
        );
      })}
    </Paper>
  );
}

export default BusList;
