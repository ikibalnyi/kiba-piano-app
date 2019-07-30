import { useState } from 'react';

import useTrackNotes from './useTrackNotes';

const compareStartTime = (a, b) => {
  if (a.startTime > b.startTime) return 1;
  if (a.startTime < b.startTime) return -1;

  return 0;
};

const useRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [keySequence, setKeySequence] = useState([]);
  const [startRecordingTime, setStartRecordingTime] = useState(null);
  const keyTracker = useTrackNotes();

  const canStopRecording = !keyTracker.isTracking;

  const clear = () => {
    setIsRecording(false);
    setStartRecordingTime(null);
    setKeySequence([]);
    keyTracker.clear();
  };

  const startRecording = () => {
    setIsRecording(true);
    setKeySequence([]);
  };

  const stopRecording = () => {
    if (canStopRecording) {
      setIsRecording(false);
      setStartRecordingTime(null);
      setKeySequence([...keySequence].sort(compareStartTime));
      keyTracker.clear();
    }
  };

  const playNote = (midiNumber) => {
    if (isRecording) {
      if (!startRecordingTime) {
        setStartRecordingTime(Date.now());
      }

      keyTracker.startNote(midiNumber);
    }
  };

  const stopNote = (midiNumber) => {
    if (isRecording) {
      const noteEvent = keyTracker.stopNote(midiNumber);
      if (noteEvent) {
        const { startTime, duration } = noteEvent;

        setKeySequence([
          ...keySequence,
          {
            midiNumber,
            startTime: startTime - startRecordingTime,
            duration,
          },
        ]);
      }
    }
  };

  return { isRecording, canStopRecording, keySequence, startRecording, stopRecording, playNote, stopNote, clear };
};

export default useRecorder;
