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

  const hasPressedKeys = keyTracker.hasActiveNotes;

  const clear = () => {
    setIsRecording(false);
    setStartRecordingTime(null);
    setKeySequence([]);
    keyTracker.stopAllNotes();
  };

  const recordNote = (midiNumber, startTime, endTime) => {
    const duration = endTime - startTime;

    setKeySequence(keySequence => [
      ...keySequence,
      {
        midiNumber,
        startTime: startTime - startRecordingTime,
        duration,
      },
    ]);
  };

  const recordActiveNotes = () => {
    const entries = keyTracker.stopAllNotes();
    const endTime = Date.now();

    for (const [midiNumber, startTime] of entries) {
      recordNote(midiNumber, startTime, endTime);
    }
  };

  const onPlayNote = (midiNumber) => {
    const startTime = Date.now();

    if (isRecording) {
      if (!startRecordingTime) {
        setStartRecordingTime(startTime);
      }
    }

    keyTracker.startNote(midiNumber, startTime);
  };

  const onStopNote = (midiNumber) => {
    const startTime = keyTracker.stopNote(midiNumber);

    if (isRecording && startTime) {
      const endTime = Date.now();
      recordNote(midiNumber, startTime, endTime);
    }
  };

  const startRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      setKeySequence([]);
      setStartRecordingTime(null);
    }
  };

  const stopRecording = () => {
    if (isRecording) {
      if (hasPressedKeys) {
        recordActiveNotes();
      }
      setIsRecording(false);
      setStartRecordingTime(null);
      setKeySequence(keySequence => [...keySequence].sort(compareStartTime));
    }
  };

  return { isRecording, hasPressedKeys, keySequence, startRecording, stopRecording, onPlayNote, onStopNote, clear };
};

export default useRecorder;
