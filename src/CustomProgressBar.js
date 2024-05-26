import React from 'react';
import { Box, LinearProgress } from '@mui/material';

function CustomProgressBar({ totalStops, completedStops }) {
    const completionRate = (completedStops / totalStops) * 100;

    // Ensure there's always a start and end point
    let stopPositions = [0]; // Start
    if (totalStops > 1) {
        const eachSection = 100 / totalStops;
        for (let i = 1; i < totalStops; i++) {  // Skip the first and last since we already have 0%
            stopPositions.push(eachSection * i);
        }
        stopPositions.push(100); // End
    } else {
        stopPositions.push(100); // Only one stop, at the end
    }

    return (
        <Box position="relative" width="100%" mr={2} sx={{ height: 20, position: 'relative' }}>
            <LinearProgress variant="determinate" value={completionRate} sx={{ height: 8, borderRadius: 5, position: 'relative' }} />
            {stopPositions.map((pos, index) => (
                <Box
                    key={index}
                    sx={{
                        position: 'absolute',
                        top: '-2px',  // Adjusting position to make sure it's visible
                        left: `${pos}%`,
                        transform: 'translateX(-50%)',
                        width: '12px',  // Made slightly larger for visibility
                        height: '12px',  // Made slightly larger for visibility
                        bgcolor: index <= completedStops ? 'primary.main' : 'grey.400', // Color based on completion
                        borderRadius: '50%',
                        border: '2px solid black',  // Make borders more visible
                        boxSizing: 'border-box'  // Ensure the border is included in width/height calculations
                    }}
                />
            ))}
        </Box>
    );
}

export default CustomProgressBar;
