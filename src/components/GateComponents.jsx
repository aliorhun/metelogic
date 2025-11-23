export const ConnectionPoint = ({ id, x, y, isActive, onClick }) => (
  <circle
    cx={x}
    cy={y}
    r="6"
    fill={isActive ? '#4CAF50' : '#999'}
    stroke={isActive === 'selected' ? '#FFD700' : '#333'}
    strokeWidth={isActive === 'selected' ? '3' : '2'}
    className="connection-point"
    onClick={onClick}
    style={{
      filter: isActive && isActive !== 'selected' ? 'drop-shadow(0 0 4px #4CAF50)' : 'none'
    }}
  />
);

export const LogicGate = ({ x, y, type, name }) => {
  const renderGate = () => {
    const strokeColor = '#333';
    const strokeWidth = 2;
    const fillColor = 'white';

    switch (type) {
      case 'AND':
        return (
          <g>
            <path
              d="M 0,0 L 0,40 L 20,40 Q 40,40 40,20 Q 40,0 20,0 Z"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
          </g>
        );
      case 'OR':
        return (
          <g>
            <path
              d="M 0,0 Q 10,0 20,20 Q 10,40 0,40 Q 10,20 0,0"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <path d="M 20,20 Q 30,20 40,20" fill="none" stroke={strokeColor} strokeWidth={strokeWidth} />
          </g>
        );
      case 'NAND':
        return (
          <g>
            <path
              d="M 0,0 L 0,40 L 20,40 Q 40,40 40,20 Q 40,0 20,0 Z"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <circle cx="45" cy="20" r="4" fill="white" stroke={strokeColor} strokeWidth={strokeWidth} />
          </g>
        );
      case 'NOR':
        return (
          <g>
            <path
              d="M 0,0 Q 10,0 20,20 Q 10,40 0,40 Q 10,20 0,0"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <circle cx="43" cy="20" r="4" fill="white" stroke={strokeColor} strokeWidth={strokeWidth} />
          </g>
        );
      case 'XOR':
        return (
          <g>
            <path d="M -5,0 Q 5,20 -5,40" fill="none" stroke={strokeColor} strokeWidth={strokeWidth} />
            <path
              d="M 0,0 Q 10,0 20,20 Q 10,40 0,40 Q 10,20 0,0"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <path d="M 20,20 Q 30,20 40,20" fill="none" stroke={strokeColor} strokeWidth={strokeWidth} />
          </g>
        );
      case 'NOT':
        return (
          <g>
            <path
              d="M 0,0 L 0,40 L 35,20 Z"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <circle cx="38" cy="20" r="4" fill="white" stroke={strokeColor} strokeWidth={strokeWidth} />
          </g>
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
