import React from 'react';
import { Box, Slider, Typography, Button } from '@mui/material';

const ControlPanel = ({ settings, onSettingsChange, onRestart }) => {
  const handleSliderChange = (name) => (event, newValue) => {
    onSettingsChange(name, newValue);
  };

  return (
    <Box sx={{ p: 2, backgroundColor: '#333', color: '#fff', borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>Control Panel</Typography>
      <Typography gutterBottom>Number of Yellow Atoms</Typography>
      <Slider
        value={settings.numYellow}
        onChange={handleSliderChange('numYellow')}
        aria-labelledby="num-yellow-slider"
        min={0}
        max={500}
      />
      <Typography gutterBottom>Number of Red Atoms</Typography>
      <Slider
        value={settings.numRed}
        onChange={handleSliderChange('numRed')}
        aria-labelledby="num-red-slider"
        min={0}
        max={500}
      />
      <Typography gutterBottom>Number of Green Atoms</Typography>
      <Slider
        value={settings.numGreen}
        onChange={handleSliderChange('numGreen')}
        aria-labelledby="num-green-slider"
        min={0}
        max={500}
      />
      <Button variant="contained" color="primary" onClick={onRestart} sx={{ mt: 2 }}>
        Restart Simulation
      </Button>
    </Box>
  );
};

export default ControlPanel;
