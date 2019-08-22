import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import { useRecorder, useTimer } from 'hooks';
import Recorder from '../Recorder';

// eslint-disable-next-line react/button-has-type
jest.mock('../Playback/PlaybackButton', () => () => <button />);
jest.mock('hooks/useRecorder');
jest.mock('hooks/useTimer');

const renderWithProps = ({ saveSong = () => Promise.resolve(), renderPiano = () => null, ...props } = {}) => (
  render(
    <Recorder
      saveSong={saveSong}
      renderPiano={renderPiano}
      {...props}
    />,
  )
);

describe('Recorder', () => {
  beforeEach(() => {
    useRecorder.__resetAllMocks();
    useTimer.__resetAllMocks();
  });

  it('should start recording when button pressed', () => {
    useRecorder.__mocks__.isRecording.mockReturnValue(false);
    useRecorder.__mocks__.keySequence.mockReturnValue([]);
    const mock = jest.fn();
    const { getByTestId } = renderWithProps({ onStartRecording: mock });
    const recordButton = getByTestId('record-button');

    fireEvent.click(recordButton);

    expect(useRecorder.__mocks__.startRecording).toHaveBeenCalled();
    expect(useTimer.__mocks__.startTimer).toHaveBeenCalled();
    expect(mock).toHaveBeenCalled();
  });

  it('should stop recording when button pressed', () => {
    useRecorder.__mocks__.isRecording.mockReturnValue(true);
    const stopRecordingMock = jest.fn();
    const { getByTestId } = renderWithProps({ onStopRecording: stopRecordingMock });
    const recordButton = getByTestId('record-button');

    fireEvent.click(recordButton);

    expect(useRecorder.__mocks__.stopRecording).toHaveBeenCalled();
    expect(useTimer.__mocks__.stopTimer).toHaveBeenCalled();
    expect(stopRecordingMock).toHaveBeenCalled();
  });

  it('should call onPlayNote and onStopNote', () => {
    const renderPiano = ({ onPlayNote, onStopNote }) => {
      onPlayNote();
      onStopNote();
    };
    const { getByTestId } = renderWithProps({ renderPiano });
    const recordButton = getByTestId('record-button');

    fireEvent.click(recordButton);

    expect(useRecorder.__mocks__.onPlayNote).toHaveBeenCalled();
    expect(useRecorder.__mocks__.onStopNote).toHaveBeenCalled();
  });

  it('should clear recorder and timer after save', async () => {
    useRecorder.__mocks__.isRecording.mockReturnValue(false);
    useRecorder.__mocks__.keySequence.mockReturnValue([{}]);
    const saveSong = () => Promise.resolve();
    const { getByTestId } = renderWithProps({ saveSong });

    fireEvent.change(getByTestId('song-form-input'), { target: { value: 'test' } });
    fireEvent.click(getByTestId('song-form-button'));

    await new Promise(r => setTimeout(r, 500));

    expect(useRecorder.__mocks__.clear).toHaveBeenCalled();
    expect(useTimer.__mocks__.resetTimer).toHaveBeenCalled();
  });

  describe('RecordButton', () => {
    it('should be disabled when prop passed', () => {
      const { getByTestId } = renderWithProps({ disabled: true });
      const recordButton = getByTestId('record-button');

      expect(recordButton.disabled).toBe(true);
    });

    it('should be disabled when hasPressedKeys', () => {
      useRecorder.__mocks__.hasPressedKeys.mockReturnValue(true);
      const { getByTestId } = renderWithProps();
      const recordButton = getByTestId('record-button');

      expect(recordButton.disabled).toBe(true);
    });
  });

  describe('SongFrom', () => {
    it('should not be visible when recording', () => {
      useRecorder.__mocks__.isRecording.mockReturnValue(true);
      const { queryByTestId } = renderWithProps();

      expect(queryByTestId('song-form-wrapper')).toBeNull();
    });

    it('should not be visible when keySequence is empty', () => {
      useRecorder.__mocks__.isRecording.mockReturnValue(false);
      useRecorder.__mocks__.keySequence.mockReturnValue([]);
      const { queryByTestId } = renderWithProps();

      expect(queryByTestId('song-form-wrapper')).toBeNull();
    });

    it('should not be visible when is not recording and keySequence is not empty', () => {
      useRecorder.__mocks__.isRecording.mockReturnValue(false);
      useRecorder.__mocks__.keySequence.mockReturnValue([{}]);
      const { queryByTestId } = renderWithProps();

      expect(queryByTestId('song-form-wrapper')).not.toBeNull();
    });
  });
});
