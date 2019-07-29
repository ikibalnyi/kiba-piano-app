import { act } from '@testing-library/react';

import { renderHook } from 'utils/testing';
import useRecorder from 'hooks/useRecorder';

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
    expect(recorder.recordedNotes).toEqual([]);
  });

  describe('startRecording', () => {
    it('should set isRecording to true but should not have anything recorded', () => {
      act(() => {
        recorder.startRecording();
      });

      expect(recorder.isRecording).toBe(true);
      expect(recorder.recordedNotes).toEqual([]);
    });

    it('should reset recorder notes', () => {
      act(() => recorder.startRecording());
      act(() => recorder.playNote(123));
      act(() => recorder.stopNote(123));

      expect(recorder.isRecording).toBe(true);
      expect(recorder.recordedNotes).toHaveLength(1);

      act(() => recorder.startRecording());

      expect(recorder.isRecording).toBe(true);
      expect(recorder.recordedNotes).toEqual([]);
    });
  });

  describe('stopRecording', () => {
    it('should not stop recording when notes a tracking', () => {
      act(() => recorder.startRecording());
      act(() => recorder.playNote(123));

      expect(recorder.isRecording).toBe(true);

      act(() => recorder.stopRecording());

      expect(recorder.isRecording).toBe(true);
    });

    it('should stop recording but keep recorded notes', () => {
      act(() => recorder.startRecording());
      act(() => recorder.playNote(123));
      act(() => recorder.stopNote(123));

      expect(recorder.isRecording).toBe(true);
      const { recordedNotes } = recorder;

      act(() => recorder.stopRecording());

      expect(recorder.isRecording).toBe(false);
      expect(recorder.recordedNotes).toEqual(recordedNotes);
    });
  });


  it('should not record note when recording is not started', () => {
    act(() => recorder.playNote(123));
    act(() => recorder.stopNote(123));

    expect(recorder.isRecording).toBe(false);
    expect(recorder.recordedNotes).toEqual([]);
  });


  it('should not record when note is not played', () => {
    act(() => recorder.startRecording());
    act(() => recorder.stopNote(123));

    expect(recorder.isRecording).toBe(true);
    expect(recorder.recordedNotes).toEqual([]);
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
    act(() => recorder.playNote(midiNumber));
    act(() => recorder.stopNote(midiNumber));

    expect(recorder.isRecording).toBe(true);
    expect(recorder.recordedNotes).toHaveLength(1);
    expect(recorder.recordedNotes[0]).toHaveProperty('midiNumber', midiNumber);
  });

  it('notes start time should depend on first touched note', () => {
    const startRecordingTime = 2000;
    const startNoteTime = 2000;
    const endNoteTime = 2500;
    const midiNumber = 123;

    dateNowMock
      .mockReturnValueOnce(startRecordingTime) // actual start recording time
      .mockReturnValueOnce(startNoteTime) // play note time
      .mockReturnValueOnce(endNoteTime); // stop note time

    act(() => recorder.startRecording());
    act(() => recorder.playNote(midiNumber));
    act(() => recorder.stopNote(midiNumber));

    expect(recorder.isRecording).toBe(true);
    expect(recorder.recordedNotes).toEqual([{
      startTime: startNoteTime - startRecordingTime,
      midiNumber,
      duration: endNoteTime - startNoteTime,
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
    act(() => recorder.playNote(midiNumber));
    act(() => recorder.stopNote(midiNumber));
    act(() => recorder.clear());

    expect(recorder.isRecording).toBe(false);
    expect(recorder.recordedNotes).toEqual([]);
  });
});
