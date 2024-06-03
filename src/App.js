import React, { useState, useEffect } from 'react';
import { useAudio } from 'react-use';
import AlgorithmicLife2D from './components/AlgorithmicLife2D';
import AlgorithmicLife3D from './components/AlgorithmicLife3D';
import './components/AlgorithmicLife.css';

const App = () => {
  const [running, setRunning] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [numAtomsPerType, setNumAtomsPerType] = useState(100);
  const [numAtomTypes, setNumAtomTypes] = useState(3);
  const [trailEffect, setTrailEffect] = useState(true); // Turned on by default
  const [connectLines, setConnectLines] = useState(false);
  const [view3D, setView3D] = useState(false);
  const [viscosity, setViscosity] = useState(Math.random() * 0.2); // Random viscosity between 0 and 0.2
  const [colors, setColors] = useState([
    "#FFFF00", // yellow
    "#FF0000", // red
    "#00FF00", // green
    "#0000FF", // blue
    "#FF00FF", // magenta
    "#00FFFF", // cyan
  ]);
  const [rules, setRules] = useState({});
  const [ruleType, setRuleType] = useState('basic');
  const [audioEnabled, setAudioEnabled] = useState(false);

  const [audio, state, controls] = useAudio({
    autoPlay: true
  });

  useEffect(() => {
    const generateRules = () => {
      const newRules = {};
      for (let i = 0; i < numAtomTypes; i++) {
        for (let j = 0; j < numAtomTypes; j++) {
          newRules[`${colors[i]}-${colors[j]}`] = {
            attraction: Math.random() * 2 - 1, // Random value between -1 and 1 for attraction
            repulsion: Math.random() * 2 - 1, // Random value between -1 and 1 for repulsion
          };
        }
      }
      setRules(newRules);
    };

    generateRules();
  }, [numAtomTypes, colors]);

  const handleRestart = () => {
    setRunning(false);
    setViscosity(Math.random() * 0.2); // Set random viscosity between 0 and 0.2 on restart
    setTimeout(() => setRunning(true), 100);
  };

  const handlePlayPause = () => {
    setRunning(prev => !prev);
  };

  const handleSpeedChange = (event) => {
    setSpeed(event.target.value);
  };

  const handleNumAtomsPerTypeChange = (event) => {
    setNumAtomsPerType(event.target.value);
  };

  const handleNumAtomTypesChange = (event) => {
    setNumAtomTypes(event.target.value);
  };

  const handleColorChange = (index, event) => {
    const newColors = [...colors];
    newColors[index] = event.target.value;
    setColors(newColors);
  };

  const handleRuleChange = (event) => {
    const { name, value } = event.target;
    const [type, forceType] = name.split('-');
    setRules(prevRules => ({
      ...prevRules,
      [type]: {
        ...prevRules[type],
        [forceType]: parseFloat(value),
      },
    }));
  };

  const handleRuleTypeChange = (event) => {
    setRuleType(event.target.value);
  };

  const handleRandomizeRules = () => {
    const randomRules = {};
    for (let i = 0; i < numAtomTypes; i++) {
      for (let j = 0; j < numAtomTypes; j++) {
        randomRules[`${colors[i]}-${colors[j]}`] = {
          attraction: Math.random() * 2 - 1, // Random value between -1 and 1 for attraction
          repulsion: Math.random() * 2 - 1, // Random value between -1 and 1 for repulsion
        };
      }
    }
    setRules(randomRules);
  };

  const handleTrailEffectToggle = () => {
    setTrailEffect(prev => !prev);
  };

  const handleConnectLinesToggle = () => {
    setConnectLines(prev => !prev);
  };

  const handleView3DToggle = () => {
    setView3D(prev => !prev);
    handleRestart(); // Restart the simulation to reinitialize atoms
  };

  const handleAudioToggle = () => {
    setAudioEnabled(prev => !prev);
  };

  return (
    <div className="container">
      <div className="left-panel">
        <div className="control-section">
          <button onClick={handlePlayPause} className="control-button">
            {running ? 'Pause' : 'Play'}
          </button>
          <button onClick={handleRestart} className="control-button">
            Restart
          </button>
          <button onClick={handleRandomizeRules} className="control-button">
            Randomize Rules
          </button>
          <label>
            Speed:
            <input
              type="range"
              min="0.1"
              max="3"
              step="0.1"
              value={speed}
              onChange={handleSpeedChange}
            />
          </label>
          <label>
            Number of Atoms for Each Type:
            <input
              type="number"
              min="50"
              max="500"
              value={numAtomsPerType}
              onChange={handleNumAtomsPerTypeChange}
            />
          </label>
          <label>
            Number of Atom Types:
            <input
              type="number"
              min="3"
              max="6"
              value={numAtomTypes}
              onChange={handleNumAtomTypesChange}
            />
          </label>
          {colors.slice(0, numAtomTypes).map((color, index) => (
            <label key={index}>
              Atom Type {index + 1} Color:
              <input
                type="color"
                value={color}
                onChange={(e) => handleColorChange(index, e)}
              />
            </label>
          ))}
          <label>
            Rule Type:
            <select value={ruleType} onChange={handleRuleTypeChange}>
              <option value="basic">Basic</option>
              <option value="complex">Complex</option>
            </select>
          </label>
          <label>
            Trail Effect:
            <input
              type="checkbox"
              checked={trailEffect}
              onChange={handleTrailEffectToggle}
            />
          </label>
          <label>
            Connect Lines:
            <input
              type="checkbox"
              checked={connectLines}
              onChange={handleConnectLinesToggle}
            />
          </label>
          <label>
            3D View:
            <input
              type="checkbox"
              checked={view3D}
              onChange={handleView3DToggle}
            />
          </label>
          <label>
            React to Audio:
            <input
              type="checkbox"
              checked={audioEnabled}
              onChange={handleAudioToggle}
            />
          </label>
        </div>
        <div className="rule-section">
          {Object.keys(rules).map(rule => (
            <div key={rule}>
              <label>
                {rule.replace(/#/g, '')} Attraction:
                <input
                  type="range"
                  name={`${rule}-attraction`}
                  min="-1"
                  max="1"
                  step="0.01"
                  value={rules[rule].attraction}
                  onChange={handleRuleChange}
                />
              </label>
              <label>
                {rule.replace(/#/g, '')} Repulsion:
                <input
                  type="range"
                  name={`${rule}-repulsion`}
                  min="-1"
                  max="1"
                  step="0.01"
                  value={rules[rule].repulsion}
                  onChange={handleRuleChange}
                />
              </label>
            </div>
          ))}
        </div>
      </div>
      {view3D ? (
        <AlgorithmicLife3D
          numAtoms={numAtomsPerType * numAtomTypes}
          numAtomTypes={numAtomTypes}
          colors={colors}
          rules={rules}
          speed={speed}
          ruleType={ruleType}
          running={running}
          viscosity={viscosity} // Pass viscosity to 3D simulation
          audioEnabled={audioEnabled}
        />
      ) : (
        <AlgorithmicLife2D
          numAtoms={numAtomsPerType * numAtomTypes}
          numAtomTypes={numAtomTypes}
          colors={colors}
          rules={rules}
          speed={speed}
          ruleType={ruleType}
          connectLines={connectLines}
          trailEffect={trailEffect}
          running={running}
          viscosity={viscosity} // Pass viscosity to 2D simulation
          audioEnabled={audioEnabled}
        />
      )}
      {audio}
    </div>
  );
};

export default App;
