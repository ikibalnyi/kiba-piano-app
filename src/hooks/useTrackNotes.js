import { useState } from 'react';

const useTrackNotes = () => {
  const [trackingNotes, setTrackingNotes] = useState({});

  const startNote = (midiNumber) => {
    if (!trackingNotes[midiNumber]) {
      setTrackingNotes({
        ...trackingNotes,
        [midiNumber]: Date.now(),
      });
    }
  };

  const stopNote = (midiNumber) => {
    const { [midiNumber]: startTime, ...restPlayingNotes } = trackingNotes;

    if (startTime) {
      const duration = Date.now() - startTime;

      setTrackingNotes(restPlayingNotes);
      return { midiNumber, startTime, duration };
    }
  };

  const clear = () => {
    setTrackingNotes({});
  };

  const isTracking = !!Object.keys(trackingNotes).length;

  return { isTracking, trackingNotes, startNote, stopNote, clear };
};

export default useTrackNotes;
