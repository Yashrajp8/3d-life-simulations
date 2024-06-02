import React, { useState } from 'react';
import AlgorithmicLife2D from './components/AlgorithmicLife2D';
import AlgorithmicLife3D from './components/AlgorithmicLife3D';
import './components/AlgorithmicLife.css';

const App = () => {
  const [running, setRunning] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [numAtoms, setNumAtoms] = useState(200);
  const [numAtomTypes, setNumAtomTypes] = useState(3);
  const [trailEffect, setTrailEffect] = useState(false);
  const [connectLines, setConnectLines] = useState(false);
  const [view3D, setView3D] = useState(false);
  const [useAR, setUseAR] = useState(false);
  const [colors, setColors] = useState([
    "#FFFF00", // yellow
    "#FF0000", // red
    "#00FF00", // green
    "#0000FF", // blue
    "#FF00FF", // magenta
    "#00FFFF", // cyan
  ]);
  const [rules, setRules] = useState({
    rule00: 0.15,
    rule01: -0.2,
    rule02: 0.34,
    rule11: -0.1,
    rule12: -0.34,
    rule22: -0.32,
  });
  const [ruleType, setRuleType] = useState('basic');

  const handleRestart = () => {
    setRunning(false);
    setTimeout(() => setRunning(true), 100);
  };

  const handlePlayPause = () => {
    setRunning(prev => !prev);
  };

  const handleSpeedChange = (event) => {
    setSpeed(event.target.value);
  };

  const handleNumAtomsChange = (event) => {
    setNumAtoms(event.target.value);
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
    setRules(prevRules => ({ ...prevRules, [name]: parseFloat(value) }));
  };

  const handleRuleTypeChange = (event) => {
    setRuleType(event.target.value);
  };

  const handleRandomizeRules = () => {
    const randomRules = {};
    Object.keys(rules).forEach(rule => {
      randomRules[rule] = Math.random() * 2 - 1;
    });
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
    handleRestart();
  };

  const handleARToggle = () => {
    setUseAR(prev => !prev);
    setView3D(true); // Switch to 3D view for AR mode
    handleRestart();
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
            Number of Atoms:
            <input
              type="number"
              min="50"
              max="500"
              value={numAtoms}
              onChange={handleNumAtomsChange}
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
            AR Mode:
            <input
              type="checkbox"
              checked={useAR}
              onChange={handleARToggle}
            />
          </label>
        </div>
        <div className="rule-section">
          <label>
            Yellow-Yellow Interaction:
            <input
              type="range"
              name="rule00"
              min="-1"
              max="1"
              step="0.01"
              value={rules.rule00}
              onChange={handleRuleChange}
            />
          </label>
          <label>
            Yellow-Red Interaction:
            <input
              type="range"
              name="rule01"
              min="-1"
              max="1"
              step="0.01"
              value={rules.rule01}
              onChange={handleRuleChange}
            />
          </label>
          <label>
            Yellow-Green Interaction:
            <input
              type="range"
              name="rule02"
              min="-1"
              max="1"
              step="0.01"
              value={rules.rule02}
              onChange={handleRuleChange}
            />
          </label>
          <label>
            Red-Red Interaction:
            <input
              type="range"
              name="rule11"
              min="-1"
              max="1"
              step="0.01"
              value={rules.rule11}
              onChange={handleRuleChange}
            />
          </label>
          <label>
            Red-Green Interaction:
            <input
              type="range"
              name="rule12"
              min="-1"
              max="1"
              step="0.01"
              value={rules.rule12}
              onChange={handleRuleChange}
            />
          </label>
          <label>
            Green-Green Interaction:
            <input
              type="range"
              name="rule22"
              min="-1"
              max="1"
              step="0.01"
              value={rules.rule22}
              onChange={handleRuleChange}
            />
          </label>
        </div>
      </div>
      <div className="simulation-container">
        {view3D ? (
          <AlgorithmicLife3D
            numAtoms={numAtoms}
            numAtomTypes={numAtomTypes}
            colors={colors}
            running={running}
            rules={rules}
            ruleType={ruleType}
            trailEffect={trailEffect}
            connectLines={connectLines}
            useAR={useAR}
          />
        ) : (
          <AlgorithmicLife2D
            numAtoms={numAtoms}
            numAtomTypes={numAtomTypes}
            colors={colors}
            rules={rules}
            speed={speed}
            ruleType={ruleType}
            connectLines={connectLines}
            trailEffect={trailEffect}
            running={running}
          />
        )}
      </div>
    </div>
  );
};

export default App;
