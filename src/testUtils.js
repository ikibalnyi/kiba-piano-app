import React from 'react';
import { render } from '@testing-library/react';

const TestHook = ({ callback }) => {
  callback();
  return null;
};

export const renderHook = (callback) => {
  render(<TestHook callback={callback} />);
};
