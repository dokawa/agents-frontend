import logo from './logo.svg';
import './App.css';
import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';

function App() {
  const containerStyle = {
    margin: 0,
    padding: 0,
    minWidth: '100vw',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const canvasStyle = {
    borderRadius: '5px',
  };

  

  return (
    <div id="game-container" style={containerStyle}>
      <canvas style={canvasStyle}></canvas>
    </div>
  );
}

export default App;
