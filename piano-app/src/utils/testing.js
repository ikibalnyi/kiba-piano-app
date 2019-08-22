import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render } from '@testing-library/react';

const TestHook = ({ callback }) => {
  callback();
  return null;
};

export const renderHook = (callback) => {
  render(<TestHook callback={callback} />);
};
