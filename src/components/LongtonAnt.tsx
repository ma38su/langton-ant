import React from 'react';
import { Row } from './Row';

const nextDirection = [
  [0, -1],
  [1, -1],
  [1, 0],
  [1, 1],
  [0, 1],
  [-1, 1],
  [-1, 0],
  [-1, -1]
];

function range(n: number) {
  return [...Array(n).keys()];
}
function generateState(width: number, height: number): State {
  const table = range(height)
    .map(_ => range(width).map(_ => false));

  return {
    step: 0,
    ants: [
      {x: Math.floor(width / 2), y: Math.floor(height / 2), dir: 6}
    ],
    field: table
  };
}

type Ant = {
  x: number;
  y: number;
  dir: number;
};
type State = {
  step: number,
  ants: Ant[];
  field: boolean[][];
};

type Props = {
  width: number;
  height: number;
};

function rotateRight(direction: number) {
  return (direction + 2) & 0b111;
}

function rotateLeft(direction: number) {
  return (direction + 6) & 0b111;
}

function periodic(n: number, max: number) {
  if (n < 0) {
    return max - 1;
  } else if (n >= max) {
    return 0;
  }
  return n;
}

function LongtonAnt(props: Props) {
  const {
    width, height,
  } = props;

  const [stop, setStop] = React.useState(true);
  const [state, setState] = React.useState(generateState(width, height));

  const animateRef = React.useRef(0);

  const animate = React.useCallback(() => {
    setState(state => {
      const { step, ants, field } = state;
      if (step > 11000) {
        return state;
      }

      const newField = [...field];
      const newAnts = ants.map(ant => {
        const {x, y, dir: d} = ant;
        const fary = [...newField[y]];
        fary[x] = !field[y][x];
        newField[y] = fary;

        const d2 = field[y][x] ? rotateRight(d) : rotateLeft(d);
        const ny = periodic(y + nextDirection[d2][1], field.length);
        const nx = periodic(x + nextDirection[d2][0], field[ny].length);
        return {
          x: nx,
          y: ny,
          dir: d2
        };
      });
      return {
        step: step + 1,
        ants: newAnts,
        field: newField
      };
    });
  }, []);
  
  React.useEffect(() => {
    if (stop) return;
    animateRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animateRef.current);
  }, [stop, state, animate]);

  const handleStop = React.useCallback(() => {
    setStop(prev => !prev);
  }, []);

  const { step, field } = state;
  return (
    <>
    <h1>Longton Ant</h1>
    {
      field.map((array, y) => (
        <Row
          key={y}
          states={array}
          y={y}
          />
      ))
    }
      <p className='step'>Step: {step}</p>
      <input
      className='ctrl'
      type='button'
      value={stop ? 'Start' : 'Stop'}
      onClick={handleStop} />
    </>
  );
}
export { LongtonAnt };