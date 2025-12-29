import { DoodleElement } from '../types';

interface DoodlesProps {
  elements: DoodleElement[];
}

export function Doodles({ elements }: DoodlesProps) {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1 }}
    >
      {elements.map((element, index) => {
        const transform = `translate(${element.x}, ${element.y}) rotate(${element.rotation})`;

        switch (element.type) {
          case 'circle':
            return (
              <circle
                key={index}
                cx={0}
                cy={0}
                r={element.size}
                fill="none"
                stroke={element.color}
                strokeWidth="2"
                transform={transform}
                opacity="0.3"
              />
            );

          case 'square':
            return (
              <rect
                key={index}
                x={-element.size / 2}
                y={-element.size / 2}
                width={element.size}
                height={element.size}
                fill="none"
                stroke={element.color}
                strokeWidth="2"
                transform={transform}
                opacity="0.3"
              />
            );

          case 'triangle':
            const points = `0,${-element.size / 2} ${element.size / 2},${element.size / 2} ${-element.size / 2},${element.size / 2}`;
            return (
              <polygon
                key={index}
                points={points}
                fill="none"
                stroke={element.color}
                strokeWidth="2"
                transform={transform}
                opacity="0.3"
              />
            );

          case 'line':
            return (
              <line
                key={index}
                x1={-element.size / 2}
                y1={0}
                x2={element.size / 2}
                y2={0}
                stroke={element.color}
                strokeWidth="3"
                transform={transform}
                opacity="0.4"
              />
            );

          case 'curve':
            return (
              <path
                key={index}
                d={`M ${-element.size / 2} 0 Q 0 ${-element.size / 2} ${element.size / 2} 0`}
                fill="none"
                stroke={element.color}
                strokeWidth="2"
                transform={transform}
                opacity="0.3"
              />
            );

          default:
            return null;
        }
      })}
    </svg>
  );
}

/**
 * Генерирует случайные дудлы для слайда
 */
export function generateRandomDoodles(count: number = 5): DoodleElement[] {
  const types: DoodleElement['type'][] = ['circle', 'line', 'square', 'triangle', 'curve'];
  const colors = ['#000000', '#333333', '#666666'];
  const doodles: DoodleElement[] = [];

  for (let i = 0; i < count; i++) {
    doodles.push({
      type: types[Math.floor(Math.random() * types.length)],
      x: Math.random() * 1080,
      y: Math.random() * 1350,
      size: 30 + Math.random() * 80,
      rotation: Math.random() * 360,
      color: colors[Math.floor(Math.random() * colors.length)],
    });
  }

  return doodles;
}
