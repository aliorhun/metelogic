import { useState, useRef, useEffect } from 'react';
import alorakLogo from '../assets/alorakgames.png';

const LogicGatesBreadboard = () => {
  const [connections, setConnections] = useState([]);
  const [drawingMode, setDrawingMode] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [tempLine, setTempLine] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const svgRef = useRef(null);

  const [switches, setSwitches] = useState({
    A: false,
    B: false,
    C: false
  });

  const fixedValues = {
    fixed_0: false,
    fixed_1: true
  };

  const [nodeStates, setNodeStates] = useState({});

  // Tüm bağlantı noktaları tanımları
  const connectionPoints = {
    // Anahtarlar
    'switch_A_out': { x: 120, y: 140, label: 'A' },
    'switch_B_out': { x: 120, y: 240, label: 'B' },
    'switch_C_out': { x: 120, y: 340, label: 'C' },

    // Sabit değerler
    'fixed_0_out': { x: 120, y: 440, label: '0' },
    'fixed_1_out': { x: 120, y: 500, label: '1' },

    // Sol sütun - AND kapıları
    'and1_in1': { x: 235, y: 110, label: 'AND1-I1' },
    'and1_in2': { x: 235, y: 130, label: 'AND1-I2' },
    'and1_out': { x: 305, y: 120, label: 'AND1-O' },

    'and2_in1': { x: 235, y: 180, label: 'AND2-I1' },
    'and2_in2': { x: 235, y: 200, label: 'AND2-I2' },
    'and2_out': { x: 305, y: 190, label: 'AND2-O' },

    // Sol sütun - NAND kapıları
    'nand1_in1': { x: 235, y: 250, label: 'NAND1-I1' },
    'nand1_in2': { x: 235, y: 270, label: 'NAND1-I2' },
    'nand1_out': { x: 314, y: 260, label: 'NAND1-O' },

    'nand2_in1': { x: 235, y: 320, label: 'NAND2-I1' },
    'nand2_in2': { x: 235, y: 340, label: 'NAND2-I2' },
    'nand2_out': { x: 314, y: 330, label: 'NAND2-O' },

    // Sol sütun - OR kapıları
    'or1_in1': { x: 235, y: 390, label: 'OR1-I1' },
    'or1_in2': { x: 235, y: 410, label: 'OR1-I2' },
    'or1_out': { x: 305, y: 400, label: 'OR1-O' },

    'or2_in1': { x: 235, y: 460, label: 'OR2-I1' },
    'or2_in2': { x: 235, y: 480, label: 'OR2-I2' },
    'or2_out': { x: 305, y: 470, label: 'OR2-O' },

    // Sağ sütun - NOR kapıları
    'nor1_in1': { x: 485, y: 110, label: 'NOR1-I1' },
    'nor1_in2': { x: 485, y: 130, label: 'NOR1-I2' },
    'nor1_out': { x: 562, y: 120, label: 'NOR1-O' },

    'nor2_in1': { x: 485, y: 180, label: 'NOR2-I1' },
    'nor2_in2': { x: 485, y: 200, label: 'NOR2-I2' },
    'nor2_out': { x: 562, y: 190, label: 'NOR2-O' },

    // Sağ sütun - XOR kapıları
    'xor1_in1': { x: 480, y: 250, label: 'XOR1-I1' },
    'xor1_in2': { x: 480, y: 270, label: 'XOR1-I2' },
    'xor1_out': { x: 555, y: 260, label: 'XOR1-O' },

    'xor2_in1': { x: 480, y: 320, label: 'XOR2-I1' },
    'xor2_in2': { x: 480, y: 340, label: 'XOR2-I2' },
    'xor2_out': { x: 555, y: 330, label: 'XOR2-O' },

    // Sağ sütun - NOT kapıları
    'not1_in': { x: 485, y: 400, label: 'NOT1-I' },
    'not1_out': { x: 546, y: 400, label: 'NOT1-O' },

    'not2_in': { x: 485, y: 470, label: 'NOT2-I' },
    'not2_out': { x: 546, y: 470, label: 'NOT2-O' },

    // LED'ler
    'led_X_in': { x: 785, y: 160, label: 'LED-X' },
    'led_Y_in': { x: 785, y: 300, label: 'LED-Y' },
    'led_Z_in': { x: 785, y: 440, label: 'LED-Z' },
  };

  // Mantık kapıları hesaplamaları
  const calculateGateOutput = (type, input1, input2 = null) => {
    const val1 = input1 || false;
    const val2 = input2 || false;
    
    switch (type) {
      case 'AND': return val1 && val2;
      case 'OR': return val1 || val2;
      case 'NAND': return !(val1 && val2);
      case 'NOR': return !(val1 || val2);
      case 'XOR': return val1 !== val2;
      case 'NOT': return !val1;
      default: return false;
    }
  };

  // Tüm devreyi hesapla
  useEffect(() => {
    const newStates = {};

    // 1. Anahtar çıkışları
    newStates['switch_A_out'] = switches.A;
    newStates['switch_B_out'] = switches.B;
    newStates['switch_C_out'] = switches.C;

    // 1b. Sabit değerler
    newStates['fixed_0_out'] = false;
    newStates['fixed_1_out'] = true;

    // 2. Her bağlantı noktası için değer hesapla
    connections.forEach(conn => {
      if (newStates[conn.from] !== undefined) {
        newStates[conn.to] = newStates[conn.from];
      }
    });

    // 3. Mantık kapılarının çıkışlarını hesapla
    // AND1
    const and1_i1 = newStates['and1_in1'] || false;
    const and1_i2 = newStates['and1_in2'] || false;
    newStates['and1_out'] = calculateGateOutput('AND', and1_i1, and1_i2);

    // AND2
    const and2_i1 = newStates['and2_in1'] || false;
    const and2_i2 = newStates['and2_in2'] || false;
    newStates['and2_out'] = calculateGateOutput('AND', and2_i1, and2_i2);

    // NAND1
    const nand1_i1 = newStates['nand1_in1'] || false;
    const nand1_i2 = newStates['nand1_in2'] || false;
    newStates['nand1_out'] = calculateGateOutput('NAND', nand1_i1, nand1_i2);

    // NAND2
    const nand2_i1 = newStates['nand2_in1'] || false;
    const nand2_i2 = newStates['nand2_in2'] || false;
    newStates['nand2_out'] = calculateGateOutput('NAND', nand2_i1, nand2_i2);

    // OR1
    const or1_i1 = newStates['or1_in1'] || false;
    const or1_i2 = newStates['or1_in2'] || false;
    newStates['or1_out'] = calculateGateOutput('OR', or1_i1, or1_i2);

    // OR2
    const or2_i1 = newStates['or2_in1'] || false;
    const or2_i2 = newStates['or2_in2'] || false;
    newStates['or2_out'] = calculateGateOutput('OR', or2_i1, or2_i2);

    // NOR1
    const nor1_i1 = newStates['nor1_in1'] || false;
    const nor1_i2 = newStates['nor1_in2'] || false;
    newStates['nor1_out'] = calculateGateOutput('NOR', nor1_i1, nor1_i2);

    // NOR2
    const nor2_i1 = newStates['nor2_in1'] || false;
    const nor2_i2 = newStates['nor2_in2'] || false;
    newStates['nor2_out'] = calculateGateOutput('NOR', nor2_i1, nor2_i2);

    // XOR1
    const xor1_i1 = newStates['xor1_in1'] || false;
    const xor1_i2 = newStates['xor1_in2'] || false;
    newStates['xor1_out'] = calculateGateOutput('XOR', xor1_i1, xor1_i2);

    // XOR2
    const xor2_i1 = newStates['xor2_in1'] || false;
    const xor2_i2 = newStates['xor2_in2'] || false;
    newStates['xor2_out'] = calculateGateOutput('XOR', xor2_i1, xor2_i2);

    // NOT1
    const not1_i = newStates['not1_in'] || false;
    newStates['not1_out'] = calculateGateOutput('NOT', not1_i);

    // NOT2
    const not2_i = newStates['not2_in'] || false;
    newStates['not2_out'] = calculateGateOutput('NOT', not2_i);

    // Kapı çıkışlarını kablolara yay
    connections.forEach(conn => {
      if (newStates[conn.from] !== undefined) {
        newStates[conn.to] = newStates[conn.from];
      }
    });

    setNodeStates(newStates);
  }, [switches, connections]);

  const handlePointClick = (pointId) => {
    if (!drawingMode) return;

    if (!selectedPoint) {
      setSelectedPoint(pointId);
    } else {
      if (selectedPoint !== pointId) {
        setConnections([...connections, { from: selectedPoint, to: pointId }]);
      }
      setSelectedPoint(null);
      setTempLine(null);
    }
  };

  const handleMouseMove = (e) => {
    if (!drawingMode || !selectedPoint || !svgRef.current) return;

    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());

    const startPoint = connectionPoints[selectedPoint];
    setTempLine({
      x1: startPoint.x,
      y1: startPoint.y,
      x2: svgP.x,
      y2: svgP.y
    });
  };

  const removeConnection = (index) => {
    setConnections(connections.filter((_, i) => i !== index));
  };

  const toggleSwitch = (sw) => {
    setSwitches(prev => ({ ...prev, [sw]: !prev[sw] }));
  };

  const ConnectionPointComponent = ({ id, x, y, isActive }) => (
    <circle
      cx={x}
      cy={y}
      r="6"
      fill={isActive ? '#4CAF50' : '#999'}
      stroke={selectedPoint === id ? '#FFD700' : '#333'}
      strokeWidth={selectedPoint === id ? '3' : '2'}
      className="connection-point"
      onClick={() => handlePointClick(id)}
      style={{
        filter: isActive ? 'drop-shadow(0 0 4px #4CAF50)' : 'none'
      }}
    />
  );

  const LogicGate = ({ x, y, type, name }) => {
    const renderGate = () => {
      const strokeColor = '#333';
      const strokeWidth = 2;
      const fillColor = 'white';

      switch (type) {
        case 'AND':
          return (
            <path
              d="M 0,0 L 0,40 L 20,40 Q 40,40 40,20 Q 40,0 20,0 Z"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
          );
        case 'OR':
          return (
            <>
              <path
                d="M 0,0 Q 10,0 20,20 Q 10,40 0,40 Q 10,20 0,0"
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
              />
              <path d="M 20,20 Q 30,20 40,20" fill="none" stroke={strokeColor} strokeWidth={strokeWidth} />
            </>
          );
        case 'NAND':
          return (
            <>
              <path
                d="M 0,0 L 0,40 L 20,40 Q 40,40 40,20 Q 40,0 20,0 Z"
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
              />
              <circle cx="45" cy="20" r="4" fill="white" stroke={strokeColor} strokeWidth={strokeWidth} />
            </>
          );
        case 'NOR':
          return (
            <>
              <path
                d="M 0,0 Q 10,0 20,20 Q 10,40 0,40 Q 10,20 0,0"
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
              />
              <circle cx="43" cy="20" r="4" fill="white" stroke={strokeColor} strokeWidth={strokeWidth} />
            </>
          );
        case 'XOR':
          return (
            <>
              <path d="M -5,0 Q 5,20 -5,40" fill="none" stroke={strokeColor} strokeWidth={strokeWidth} />
              <path
                d="M 0,0 Q 10,0 20,20 Q 10,40 0,40 Q 10,20 0,0"
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
              />
              <path d="M 20,20 Q 30,20 40,20" fill="none" stroke={strokeColor} strokeWidth={strokeWidth} />
            </>
          );
        case 'NOT':
          return (
            <>
              <path
                d="M 0,0 L 0,40 L 35,20 Z"
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
              />
              <circle cx="38" cy="20" r="4" fill="white" stroke={strokeColor} strokeWidth={strokeWidth} />
            </>
          );
        default:
          return null;
      }
    };

    return (
      <g transform={`translate(${x}, ${y})`}>
        {renderGate()}
        <text 
          x="25" 
          y="60" 
          textAnchor="middle"
          fontSize="14" 
          fontWeight="bold" 
          fill="#333"
          style={{ userSelect: 'none' }}
        >
          {name}
        </text>
      </g>
    );
  };

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="w-full max-w-[900px] px-2">
        <svg
          ref={svgRef}
          width="100%"
          height="auto"
          viewBox="0 50 900 530"
          className="border-4 border-gray-700 rounded-xl shadow-2xl mb-2"
          style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}
          onMouseMove={handleMouseMove}
          onTouchMove={(e) => {
            if (e.touches.length === 1) {
              handleMouseMove({
                clientX: e.touches[0].clientX,
                clientY: e.touches[0].clientY
              });
            }
          }}
        >
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e0e0e0" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="900" height="650" fill="url(#grid)" />

          {/* Anahtarlar */}
          <g id="switches">
            {['A', 'B', 'C'].map((sw, idx) => {
              const y = 140 + idx * 100;
              const isOn = switches[sw];
              return (
                <g key={sw}>
                  {/* Switch ikonu */}
                  <g transform={`translate(30, ${y})`}>
                    <rect x="-8" y="-12" width="16" height="24" fill="none" stroke="#666" strokeWidth="2" rx="2" />
                    <rect 
                      x="-6" 
                      y={isOn ? "-8" : "0"} 
                      width="12" 
                      height="12" 
                      fill={isOn ? '#4CAF50' : '#999'}
                      rx="2"
                    />
                  </g>
                  
                  <rect 
                    x="60" 
                    y={y - 20} 
                    width="40" 
                    height="40" 
                    fill={isOn ? '#4CAF50' : '#333'}
                    stroke="#666"
                    strokeWidth="2"
                    rx="5"
                    onClick={() => toggleSwitch(sw)}
                    style={{ cursor: 'pointer' }}
                  />
                  <text 
                    x="80" 
                    y={y + 8} 
                    textAnchor="middle" 
                    fontSize="20" 
                    fill="white" 
                    fontWeight="bold"
                    style={{ userSelect: 'none', pointerEvents: 'none' }}
                  >
                    {sw}
                  </text>
                  <line 
                    x1="100" 
                    y1={y} 
                    x2="120" 
                    y2={y}
                    stroke={isOn ? '#4CAF50' : '#999'}
                    strokeWidth="3"
                  />
                </g>
              );
            })}
          </g>

          {/* Sabit Değerler */}
          <g id="fixed-values">
            {[
              { label: '0', y: 440, isOn: false },
              { label: '1', y: 500, isOn: true }
            ].map((item) => (
              <g key={item.label}>
                <rect 
                  x="60" 
                  y={item.y - 20} 
                  width="40" 
                  height="40" 
                  fill={item.isOn ? '#4CAF50' : '#333'}
                  stroke="#666"
                  strokeWidth="2"
                  rx="5"
                />
                <text 
                  x="80" 
                  y={item.y + 8} 
                  textAnchor="middle" 
                  fontSize="20" 
                  fill="white" 
                  fontWeight="bold"
                  style={{ userSelect: 'none' }}
                >
                  {item.label}
                </text>
                <line 
                  x1="100" 
                  y1={item.y} 
                  x2="120" 
                  y2={item.y}
                  stroke={item.isOn ? '#4CAF50' : '#999'}
                  strokeWidth="3"
                />
              </g>
            ))}
          </g>

          {/* Sol sütun - Mantık kapıları */}
          <LogicGate x={250} y={100} type="AND" name="AND" />
          <LogicGate x={250} y={170} type="AND" name="AND" />
          <LogicGate x={250} y={240} type="NAND" name="NAND" />
          <LogicGate x={250} y={310} type="NAND" name="NAND" />
          <LogicGate x={250} y={380} type="OR" name="OR" />
          <LogicGate x={250} y={450} type="OR" name="OR" />

          {/* Sağ sütun - Mantık kapıları */}
          <LogicGate x={500} y={100} type="NOR" name="NOR" />
          <LogicGate x={500} y={170} type="NOR" name="NOR" />
          <LogicGate x={500} y={240} type="XOR" name="XOR" />
          <LogicGate x={500} y={310} type="XOR" name="XOR" />
          <LogicGate x={500} y={380} type="NOT" name="NOT" />
          <LogicGate x={500} y={450} type="NOT" name="NOT" />

          {/* LED'ler */}
          <g id="leds">
            {/* MeteLogicApp başlık */}
            <text 
              x="800" 
              y="100" 
              textAnchor="middle" 
              fontSize="16" 
              fill="#333" 
              fontWeight="bold"
              style={{ userSelect: 'none' }}
            >
              MeteLogicApp
            </text>
            
            {[
              { label: 'X', y: 160, id: 'led_X_in', color: '#ff4444', textColor: '#dc2626' },
              { label: 'Y', y: 300, id: 'led_Y_in', color: '#ffcc00', textColor: '#ca8a04' },
              { label: 'Z', y: 440, id: 'led_Z_in', color: '#4444ff', textColor: '#2563eb' }
            ].map(led => {
              const isOn = nodeStates[led.id] || false;
              return (
                <g key={led.label}>
                  <line 
                    x1="770" 
                    y1={led.y} 
                    x2="785" 
                    y2={led.y}
                    stroke={isOn ? '#4CAF50' : '#999'}
                    strokeWidth="3"
                  />
                  <circle 
                    cx="805" 
                    cy={led.y} 
                    r="15" 
                    fill={isOn ? led.color : '#666'} 
                    stroke="#333" 
                    strokeWidth="2"
                    className={isOn ? 'pulse' : ''}
                    style={{ filter: isOn ? `drop-shadow(0 0 10px ${led.color})` : 'none' }}
                  />
                  <circle cx="805" cy={led.y} r="10" fill={isOn ? led.color : '#888'} opacity="0.8" />
                  <text 
                    x="805" 
                    y={led.y + 35} 
                    textAnchor="middle"
                    fontSize="18" 
                    fill={led.textColor} 
                    fontWeight="bold"
                    style={{ userSelect: 'none' }}
                  >
                    {led.label}
                  </text>
                  
                  {/* LED Ampul ikonu */}
                  <g transform={`translate(850, ${led.y})`}>
                    <circle 
                      cx="0" 
                      cy="-5" 
                      r="8" 
                      fill="none" 
                      stroke={isOn ? led.color : '#666'} 
                      strokeWidth="2"
                    />
                    <line x1="-6" y1="4" x2="6" y2="4" stroke={isOn ? led.color : '#666'} strokeWidth="2" />
                    <line x1="-6" y1="7" x2="6" y2="7" stroke={isOn ? led.color : '#666'} strokeWidth="2" />
                    {isOn && (
                      <>
                        <line x1="-12" y1="-5" x2="-15" y2="-5" stroke={led.color} strokeWidth="1.5" />
                        <line x1="12" y1="-5" x2="15" y2="-5" stroke={led.color} strokeWidth="1.5" />
                        <line x1="-9" y1="-12" x2="-11" y2="-15" stroke={led.color} strokeWidth="1.5" />
                        <line x1="9" y1="-12" x2="11" y2="-15" stroke={led.color} strokeWidth="1.5" />
                      </>
                    )}
                  </g>
                </g>
              );
            })}
          </g>

          {/* Kablolar */}
          {connections.map((conn, idx) => {
            const from = connectionPoints[conn.from];
            const to = connectionPoints[conn.to];
            const isActive = nodeStates[conn.from] || false;
            
            return (
              <line
                key={idx}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={isActive ? '#4CAF50' : '#FF6B6B'}
                strokeWidth="3"
                className="wire"
                onClick={() => removeConnection(idx)}
                style={{
                  filter: isActive ? 'drop-shadow(0 0 3px #4CAF50)' : 'none',
                  cursor: 'pointer'
                }}
              />
            );
          })}

          {/* Geçici çizgi */}
          {tempLine && (
            <line
              x1={tempLine.x1}
              y1={tempLine.y1}
              x2={tempLine.x2}
              y2={tempLine.y2}
              stroke="#FFD700"
              strokeWidth="3"
              strokeDasharray="5,5"
              style={{ pointerEvents: 'none' }}
            />
          )}

          {/* Bağlantı noktaları */}
          {Object.entries(connectionPoints).map(([id, point]) => (
            <ConnectionPointComponent
              key={id}
              id={id}
              x={point.x}
              y={point.y}
              isActive={nodeStates[id] || false}
            />
          ))}
        </svg>

        {/* Butonlar */}
        <div className="flex gap-2 sm:gap-4 items-center justify-center flex-wrap">
          <button
            onClick={() => {
              setDrawingMode(!drawingMode);
              setSelectedPoint(null);
              setTempLine(null);
            }}
            className={`px-6 sm:px-8 py-3 rounded-lg font-bold text-white text-2xl transition-all shadow-lg ${
              drawingMode 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            {drawingMode ? '⏸' : '🔌'}
          </button>

          <button
            onClick={() => setShowModal(true)}
            className="px-6 sm:px-8 py-3 rounded-lg font-bold text-white text-2xl bg-gray-500 hover:bg-gray-600 transition-all shadow-lg"
          >
            ⚙
          </button>

          {/* Alorak Games Logo */}
          <a 
            href="https://www.alorak.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="transition-transform hover:scale-105"
          >
            <img 
              src={alorakLogo} 
              alt="Alorak Games" 
              className="h-10 sm:h-12 rounded-lg shadow-lg"
            />
          </a>

          <button
            onClick={() => {
              setConnections([]);
              setSelectedPoint(null);
              setTempLine(null);
              setDrawingMode(false);
            }}
            className="px-6 sm:px-8 py-3 rounded-lg font-bold text-white text-2xl bg-gray-500 hover:bg-gray-600 transition-all shadow-lg"
          >
            ↻
          </button>
        </div>

        {/* Modal */}
        {showModal && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowModal(false)}
          >
            <div 
              className="bg-white rounded-xl shadow-2xl p-4 sm:p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800">🎛️ Kontrol Paneli</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-3xl font-bold"
                >
                  ×
                </button>
              </div>

              <div className="mb-4 sm:mb-6">
                <h4 className="font-bold text-base sm:text-lg mb-3 text-gray-700">📊 Anahtar Durumları</h4>
                <div className="grid grid-cols-3 gap-2 sm:gap-4">
                  <div className="text-center p-3 sm:p-4 bg-gray-100 rounded-lg">
                    <div className={`text-2xl sm:text-3xl font-bold ${switches.A ? 'text-green-500' : 'text-gray-400'}`}>
                      A: {switches.A ? '1' : '0'}
                    </div>
                  </div>
                  <div className="text-center p-3 sm:p-4 bg-gray-100 rounded-lg">
                    <div className={`text-2xl sm:text-3xl font-bold ${switches.B ? 'text-green-500' : 'text-gray-400'}`}>
                      B: {switches.B ? '1' : '0'}
                    </div>
                  </div>
                  <div className="text-center p-3 sm:p-4 bg-gray-100 rounded-lg">
                    <div className={`text-2xl sm:text-3xl font-bold ${switches.C ? 'text-green-500' : 'text-gray-400'}`}>
                      C: {switches.C ? '1' : '0'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-4 sm:mb-6">
                <h4 className="font-bold text-base sm:text-lg mb-3 text-gray-700">💡 LED Durumları</h4>
                <div className="grid grid-cols-3 gap-2 sm:gap-4">
                  <div className="text-center p-3 sm:p-4 bg-gray-100 rounded-lg">
                    <div className={`text-xl sm:text-2xl font-bold ${nodeStates['led_X_in'] ? 'text-red-600' : 'text-gray-400'}`}>
                      LED X: {nodeStates['led_X_in'] ? '🔴' : '⚫'}
                    </div>
                  </div>
                  <div className="text-center p-3 sm:p-4 bg-gray-100 rounded-lg">
                    <div className={`text-xl sm:text-2xl font-bold ${nodeStates['led_Y_in'] ? 'text-yellow-600' : 'text-gray-400'}`}>
                      LED Y: {nodeStates['led_Y_in'] ? '🟡' : '⚫'}
                    </div>
                  </div>
                  <div className="text-center p-3 sm:p-4 bg-gray-100 rounded-lg">
                    <div className={`text-xl sm:text-2xl font-bold ${nodeStates['led_Z_in'] ? 'text-blue-600' : 'text-gray-400'}`}>
                      LED Z: {nodeStates['led_Z_in'] ? '🔵' : '⚫'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 sm:p-4 bg-gray-100 rounded-lg text-center">
                <div className="text-base sm:text-lg text-gray-700">
                  <strong>Toplam Bağlantı:</strong> {connections.length} kablo
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LogicGatesBreadboard;
