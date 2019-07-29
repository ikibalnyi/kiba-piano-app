import { act } from '@testing-library/react';

import { renderHook } from 'utils/testing';
import useTrackNotes from '../useTrackNotes';

const realDateNow = Date.now;

describe('useTrackNotes', () => {
  let tracker;
  let nowMock;

  beforeEach(() => {
    renderHook(() => {
      tracker = useTrackNotes();
    });
    nowMock = jest.fn();
    Date.now = nowMock;
  });

  afterEach(() => {
    nowMock.mockReset();
  });

  afterAll(() => {
    Date.now = realDateNow;
  });

  it('should not track notes by default', () => {
    expect(tracker.isTracking).toBe(false);
    expect(tracker.trackingNotes).toEqual({});
  });

  describe('startNote', () => {
    it('should set isTracking to true', () => {
      act(() => {
        tracker.startNote(38);
      });
      expect(tracker.isTracking).toBe(true);
    });

    it('should set tracking note with Date.now', () => {
      const midiNumber = 38;
      const nowValue = 123456789;
      nowMock.mockReturnValue(nowValue);

      act(() => {
        tracker.startNote(midiNumber);
      });
      expect(tracker.isTracking).toBe(true);
      expect(nowMock).toHaveBeenCalled();
      expect(tracker.trackingNotes).toHaveProperty(String(midiNumber), nowValue);
    });

    it('should not override tracking note', () => {
      const midiNumber = 38;
      const firstStartTime = 123456789;
      const secondStartTime = 987654321;
      nowMock
        .mockReturnValueOnce(firstStartTime)
        .mockReturnValueOnce(secondStartTime);

      act(() => {
        tracker.startNote(midiNumber);
      });

      act(() => {
        tracker.startNote(midiNumber);
      });

      expect(tracker.isTracking).toBe(true);
      expect(nowMock).toHaveBeenCalledTimes(1);
      expect(tracker.trackingNotes).toHaveProperty(String(midiNumber), firstStartTime);
    });
  });

  describe('stopNote', () => {
    it('should not do anything when note is not tracked', () => {
      const midiNumber = 38;

      act(() => {
        tracker.stopNote(midiNumber);
      });

      expect(nowMock).not.toHaveBeenCalled();
      expect(tracker.trackingNotes).toEqual({});
      expect(tracker.isTracking).toBe(false);
    });

    it('should stop tracking a note', () => {
      const midiNumber = 38;
      const startTime = 2000;
      const stopTime = 2500;

      nowMock
        .mockReturnValueOnce(startTime)
        .mockReturnValueOnce(stopTime);

      act(() => {
        tracker.startNote(midiNumber);
      });

      act(() => {
        tracker.stopNote(midiNumber);
      });

      expect(nowMock).toHaveBeenCalledTimes(2);
      expect(tracker.trackingNotes).toEqual({});
    });

    it('should return midiNumber, startTime and duration that note was playing', () => {
      const midiNumber = 38;
      const startTime = 2000;
      const stopTime = 2500;
      let received;

      nowMock
        .mockReturnValueOnce(startTime)
        .mockReturnValueOnce(stopTime);

      act(() => {
        tracker.startNote(midiNumber);
      });

      act(() => {
        received = tracker.stopNote(midiNumber);
      });

      expect(received).toMatchObject({
        midiNumber,
        startTime,
        duration: stopTime - startTime,
      });
    });
  });

  describe('clear', () => {
    it('should stop all tracking notes', () => {
      const midiNumber = 38;
      const startTime = 2000;

      nowMock
        .mockReturnValueOnce(startTime);

      act(() => {
        tracker.startNote(midiNumber);
      });

      act(() => {
        tracker.clear();
      });

      expect(tracker.trackingNotes).toEqual({});
      expect(tracker.isTracking).toEqual(false);
    });
  });
});
