import { act } from '@testing-library/react';

import { renderHook } from 'utils/testing';
import useRecorder from '../useRecorder';

const realDateNow = Date.now;

describe('useRecorder', () => {
  let recorder;
  let dateNowMock;

  beforeEach(() => {
    renderHook(() => {
      recorder = useRecorder();
    });
    dateNowMock = jest.fn(() => 2000);

    Date.now = dateNowMock;
  });

  afterEach(() => {
    dateNowMock.mockReset();
  });

  afterAll(() => {
    Date.now = realDateNow;
  });

  it('should not record anything and be empty by default', () => {
    expect(recorder.isRecording).toBe(false);
    expect(recorder.keySequence).toEqual([]);
  });

  describe('startRecording', () => {
    it('should set isRecording to true but should not have anything recorded', () => {
      act(() => recorder.startRecording());

      expect(recorder.isRecording).toBe(true);
      expect(recorder.keySequence).toEqual([]);
    });

    it('should not reset recorder notes', () => {
      act(() => recorder.startRecording());
      act(() => recorder.onPlayNote(123));
      act(() => recorder.onStopNote(123));

      expect(recorder.isRecording).toBe(true);
      expect(recorder.keySequence).toHaveLength(1);

      act(() => recorder.startRecording());

      expect(recorder.isRecording).toBe(true);
      expect(recorder.keySequence).toHaveLength(1);
    });
  });

  describe('stopRecording', () => {
    it('should do nothing when recording is not started', () => {
      act(() => recorder.onPlayNote(123));
      expect(recorder.isRecording).toBe(false);
      expect(recorder.hasPressedKeys).toBe(true);

      act(() => recorder.stopRecording());
      expect(recorder.isRecording).toBe(false);
      expect(recorder.hasPressedKeys).toBe(true);
    });

    it('should stop recording and save recorded notes', () => {
      act(() => recorder.startRecording());
      act(() => recorder.onPlayNote(123));
      act(() => recorder.onStopNote(123));

      expect(recorder.isRecording).toBe(true);
      expect(recorder.hasPressedKeys).toBe(false);

      act(() => recorder.stopRecording());
      expect(recorder.isRecording).toBe(false);
    });

    it('should stop recording and save them active notes', () => {
      dateNowMock
        .mockReturnValueOnce(200) // start first note
        .mockReturnValueOnce(250) // start second node
        .mockReturnValueOnce(300) // end first note
        .mockReturnValueOnce(300); // end second node

      act(() => recorder.startRecording());
      act(() => recorder.onPlayNote(123));
      act(() => recorder.onPlayNote(321));

      expect(recorder.isRecording).toBe(true);
      expect(recorder.hasPressedKeys).toBe(true);
      expect(recorder.keySequence).toHaveLength(0);

      act(() => recorder.stopRecording());

      expect(recorder.isRecording).toBe(false);
      expect(recorder.hasPressedKeys).toBe(false);
      expect(recorder.keySequence).toHaveLength(2);
    });
  });


  it('should not record note when recording is not started', () => {
    act(() => recorder.onPlayNote(123));
    act(() => recorder.onStopNote(123));

    expect(recorder.isRecording).toBe(false);
    expect(recorder.keySequence).toEqual([]);
  });


  it('should not record when note is not played', () => {
    act(() => recorder.startRecording());
    act(() => recorder.onStopNote(123));

    expect(recorder.isRecording).toBe(true);
    expect(recorder.keySequence).toEqual([]);
  });

  it('should record note', () => {
    const startTime = 2000;
    const endTime = 2500;
    const midiNumber = 123;

    dateNowMock
      .mockReturnValueOnce(startTime) // actual start recording time
      .mockReturnValueOnce(startTime) // play note time
      .mockReturnValueOnce(endTime); // stop note time

    act(() => recorder.startRecording());
    act(() => recorder.onPlayNote(midiNumber));
    act(() => recorder.onStopNote(midiNumber));

    expect(recorder.isRecording).toBe(true);
    expect(recorder.keySequence).toHaveLength(1);
    expect(recorder.keySequence[0]).toHaveProperty('midiNumber', midiNumber);
  });

  it('notes start time should depend on first touched note', () => {
    const notes = [
      {
        midiNumber: 123,
        startTime: 2000,
        endTime: 5000,
      },
      {
        midiNumber: 321,
        startTime: 2500,
        endTime: 2600,
      },
    ];

    dateNowMock
      .mockReturnValueOnce(notes[0].startTime) // play note time
      .mockReturnValueOnce(notes[1].startTime) // play note time
      .mockReturnValueOnce(notes[1].endTime); // stop note time

    act(() => recorder.startRecording());
    act(() => recorder.onPlayNote(notes[0].midiNumber));
    act(() => recorder.onPlayNote(notes[1].midiNumber));
    act(() => recorder.onStopNote(notes[1].midiNumber));

    expect(recorder.isRecording).toBe(true);
    expect(recorder.keySequence).toEqual([{
      midiNumber: notes[1].midiNumber,
      startTime: notes[1].startTime - notes[0].startTime,
      duration: notes[1].endTime - notes[1].startTime,
    }]);
  });

  it('clear should reset everything', () => {
    const startRecordingTime = 2000;
    const startNoteTime = 2000;
    const endNoteTime = 2500;
    const midiNumber = 123;

    dateNowMock
      .mockReturnValueOnce(startRecordingTime) // actual start recording time
      .mockReturnValueOnce(startNoteTime) // play note time
      .mockReturnValueOnce(endNoteTime); // stop note time

    act(() => recorder.startRecording());
    act(() => recorder.onPlayNote(midiNumber));
    act(() => recorder.onStopNote(midiNumber));
    act(() => recorder.clear());

    expect(recorder.isRecording).toBe(false);
    expect(recorder.keySequence).toEqual([]);
  });
});
