import { useState } from 'react';

const useTrackNotes = () => {
  const [activeNotes, setActiveNotes] = useState({});

  const startNote = (midiNumber, state, forceOverride = false) => {
    if (!activeNotes[midiNumber] || forceOverride) {
      setActiveNotes({
        ...activeNotes,
        [midiNumber]: state,
      });
    }
  };

  const stopNote = (midiNumber) => {
    const { [midiNumber]: state, ...restPlayingNotes } = activeNotes;

    if (state) {
      setActiveNotes(restPlayingNotes);
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
