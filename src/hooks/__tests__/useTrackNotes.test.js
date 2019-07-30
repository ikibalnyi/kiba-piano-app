import { act } from '@testing-library/react';

import { renderHook } from 'utils/testing';
import useTrackNotes from '../useTrackNotes';

describe('useTrackNotes', () => {
  let tracker;

  beforeEach(() => {
    renderHook(() => {
      tracker = useTrackNotes();
    });
  });


  it('should not track notes by default', () => {
    expect(tracker.hasActiveNotes).toBe(false);
    expect(tracker.activeNotes).toEqual({});
  });

  describe('startNote', () => {
    it('should set hasActiveNotes to true', () => {
      act(() => tracker.startNote(38));
      expect(tracker.hasActiveNotes).toBe(true);
    });

    it('should set note state', () => {
      const midiNumber = 38;
      const state = 123456789;

      act(() => tracker.startNote(midiNumber, state));
      expect(tracker.hasActiveNotes).toBe(true);
      expect(tracker.activeNotes).toHaveProperty(String(midiNumber), state);
    });

    it('should not override tracking note by default', () => {
      const midiNumber = 38;
      const state = 123456789;
      const newState = 987654321;

      act(() => tracker.startNote(midiNumber, state));
      act(() => tracker.startNote(midiNumber, newState));

      expect(tracker.hasActiveNotes).toBe(true);
      expect(tracker.activeNotes).toHaveProperty(String(midiNumber), state);
    });

    it('should override tracking note if said', () => {
      const midiNumber = 38;
      const state = 123456789;
      const newState = 987654321;

      act(() => tracker.startNote(midiNumber, state));
      act(() => tracker.startNote(midiNumber, newState, true));

      expect(tracker.hasActiveNotes).toBe(true);
      expect(tracker.activeNotes).toHaveProperty(String(midiNumber), newState);
    });
  });

  describe('stopNote', () => {
    it('should not do anything when note is not tracked', () => {
      const midiNumber = 38;

      act(() => {
        tracker.stopNote(midiNumber);
      });

      expect(tracker.activeNotes).toEqual({});
      expect(tracker.hasActiveNotes).toBe(false);
    });

    it('should remove active notes', () => {
      const midiNumber = 38;
      const state = 2000;

      act(() => tracker.startNote(midiNumber, state));

      expect(tracker.activeNotes).toEqual({ [midiNumber]: state });

      act(() => { tracker.stopNote(midiNumber); });

      expect(tracker.activeNotes).toEqual({});
      expect(tracker.hasActiveNotes).toBe(false);
    });

    it('should return state when note stopped', () => {
      const midiNumber = 38;
      const state = 2000;
      let received;

      act(() => tracker.startNote(midiNumber, state));

      act(() => {
        received = tracker.stopNote(midiNumber);
      });

      expect(received).toBe(state);
    });
  });

  describe('stopAll', () => {
    it('should stop all tracking notes', () => {
      const midiNumber = 38;
      const state = 2000;

      act(() => tracker.startNote(midiNumber, state));

      expect(tracker.hasActiveNotes).toBe(true);

      act(() => { tracker.stopAllNotes(); });

      expect(tracker.activeNotes).toEqual({});
      expect(tracker.hasActiveNotes).toBe(false);
    });

    it('should return entries of all active notes', () => {
      const notes = [
        {
          midiNumber: 321,
          state: 321,
        },
        {
          midiNumber: 123,
          state: 123,
        },
      ];
      let received;

      act(() => tracker.startNote(notes[0].midiNumber, notes[0].state));
      act(() => tracker.startNote(notes[1].midiNumber, notes[1].state));

      expect(tracker.hasActiveNotes).toBe(true);

      act(() => {
        received = tracker.stopAllNotes();
      });

      expect(tracker.hasActiveNotes).toBe(false);
      expect(received).toEqual(expect.arrayContaining([
        [String(notes[0].midiNumber), notes[0].state],
        [String(notes[1].midiNumber), notes[1].state],
      ]));
    });
  });
});
