import React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { render, fireEvent } from '@testing-library/react';

import { useRecorder, usePlayer, useTimer } from 'hooks';
import App from '../App';

jest.mock('../Piano', () => () => <div />);
jest.mock('../SongList', () => () => <div />);
jest.mock('hooks/usePlayer');
jest.mock('hooks/useRecorder');
jest.mock('hooks/useTimer');

const renderApp = () => (
  render(
    <MockedProvider>
      <App />
    </MockedProvider>,
  )
);

describe('App', () => {
  beforeEach(() => {
    useRecorder.__resetAllMocks();
    useTimer.__resetAllMocks();
    usePlayer.__resetAllMocks();
  });

  it('should disable record button when playing', () => {
    usePlayer.__mocks__.isPlaying.mockReturnValue(true);
    const { getByTestId } = renderApp();

    expect(getByTestId('record-button').disabled).toBe(true);
  });

  it('should disable player when start recording', () => {
    const { getByTestId } = renderApp();

    fireEvent.click(getByTestId('record-button'));
    expect(usePlayer.__mocks__.disable).toHaveBeenCalled();
  });

  it('should enable player when stop recording', () => {
    useRecorder.__mocks__.isRecording.mockReturnValue(true);
    const { getByTestId } = renderApp();

    fireEvent.click(getByTestId('record-button'));
    expect(usePlayer.__mocks__.enable).toHaveBeenCalled();
  });
});
