import React from 'react';
import { Cell } from './Cell';

type Props = {
  y: number;
  states: boolean[];
};

const Row = React.memo((props: Props) => {
  const {
    states
  } = props;

  return (
    <div className='row'>
    {
      states.map((state, x) => (
        <Cell
          key={x}
          state={state}
          />
      ))
    }
  </div>);
});
export { Row };