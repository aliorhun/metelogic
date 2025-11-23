import { useState, useRef, useEffect } from 'react';
import LogicGatesBreadboard from './components/LogicGatesBreadboard';
import alorakLogo from './assets/alorakgames.png';

function App() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 p-2 sm:p-4">
      <LogicGatesBreadboard />
    </div>
  );
}

export default App;
