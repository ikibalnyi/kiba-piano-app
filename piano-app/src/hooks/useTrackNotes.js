import { useState } from 'react';

const useTrackNotes = () => {
  const [activeNotes, setActiveNotes] = useState({});

  const startNote = (midiNumber, state, forceOverride = false) => {
    if (!activeNotes[midiNumber] || forceOverride) {
      setActiveNotes(activeNotes => ({
        ...activeNotes,
        [midiNumber]: state,
      }));
    }
  };

  const stopNote = (midiNumber) => {
    const { [midiNumber]: state } = activeNotes;

    if (state) {
      setActiveNotes(({ [midiNumber]: state, ...activeNotes }) => activeNotes);
    }

    return state;
  };

  const stopAllNotes = () => {
    const entries = Object.entries(activeNotes);
    setActiveNotes({});
    return entries;
  };

  const isTracking = !!Object.keys(activeNotes).length;

  return { hasActiveNotes: isTracking, activeNotes, startNote, stopNote, stopAllNotes };
};

export default useTrackNotes;
