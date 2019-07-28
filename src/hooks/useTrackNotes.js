import { useState } from 'react';

const useTrackNotes = () => {
  const [playingNotes, setPlayingNotes] = useState({});

  const startNote = (midiNumber) => {
    if (!playingNotes[midiNumber]) {
      setPlayingNotes({
        ...playingNotes,
        [midiNumber]: Date.now(),
      });
    }
  };

  const stopNote = (midiNumber) => {
    const { [midiNumber]: startTime, ...restPlayingNotes } = playingNotes;

    if (startTime) {
      const duration = Date.now() - startTime;

      setPlayingNotes(restPlayingNotes);
      return { midiNumber, startTime, duration };
    }
  };

  const clear = () => {
    setPlayingNotes({});
  };

  const isPlaying = !!Object.keys(playingNotes).length;

  return { isPlaying, startNote, stopNote, clear };
};

export default useTrackNotes;
