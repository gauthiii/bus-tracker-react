
import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';



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

function BusList({ buses, onBusSelect, myLat, myLon }) {
  const [selectedBusId, setSelectedBusId] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState('');
  const [selectedName, setSelectedName] = useState('');
  const [filteredBuses, setFilteredBuses] = useState(buses);
  const averageSpeedKmH = 20; // Average bus speed in km/h

  useEffect(() => {
    let result = buses;

    if (selectedRoute) {
      result = result.filter(bus => bus.route === selectedRoute);
    }

    if (selectedName) {
      result = result.filter(bus => bus.name === selectedName);
    }

    setFilteredBuses(result);
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
          label="Filter by Route"
          onChange={handleRouteChange}
        >
          <MenuItem value="">All Routes</MenuItem>
          {['Tambaram', 'Chrompet', 'Pallavaram', 'Tirusulam', 'Nanganallur', 'Meenambakkam', 'Alandur', 'Guindy', 'Ashok Nagar', 'Valasaravakkam', 'Vadapalani', 'Koyambedu'].map(route => (
            <MenuItem key={route} value={route}>{route}</MenuItem>
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
      {filteredBuses.map(bus => {
        const distance = calculateDistance(13.004202, 80.201471, bus.lat, bus.lon).toFixed(2);
        const travelTimeHours = distance / averageSpeedKmH;
        const travelTimeMinutes = Math.round(travelTimeHours * 60);

        return (
          <Box key={bus.id} onClick={() => handleBusSelect(bus)} className="bus-list-item" sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#f0f0f0' } }}>
            <Typography variant="subtitle1">
              Bus: {bus.name}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              ID: {bus.id}<br />
              Route: {bus.route}<br />
              Status: {bus.status}
              {selectedBusId === bus.id && (
                <>
                  <br />Distance: {distance} km<br />
                  Estimated Arrival Time: {travelTimeMinutes} minutes
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
