import React from 'react';

type Props = {
  state: boolean;
};

const Cell = React.memo((props: Props) => {
  const { state } = props;

  return (
    <input
      type='button'
      className={state ? 'alive' : 'dead'}
      />
  );
});
export { Cell };