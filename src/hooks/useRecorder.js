import { useState } from 'react';

import useTrackNotes from './useTrackNotes';

const compareStartTime = (a, b) => {
  if (a.startTime > b.startTime) return 1;
  if (a.startTime < b.startTime) return -1;

  return 0;
};

const useRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedNotes, setRecordedNotes] = useState([]);
  const [startRecordingTime, setStartRecordingTime] = useState(null);
  const tracker = useTrackNotes();

  const canStopRecording = !tracker.isTracking;

  const clear = () => {
    setIsRecording(false);
    setStartRecordingTime(null);
    setRecordedNotes([]);
    tracker.clear();
  };

  const startRecording = () => {
    setIsRecording(true);
    setRecordedNotes([]);
  };

  const stopRecording = () => {
    if (canStopRecording) {
      setIsRecording(false);
      setStartRecordingTime(null);
      setRecordedNotes([...recordedNotes].sort(compareStartTime));
      tracker.clear();
    }
  };

  const playNote = (midiNumber) => {
    if (isRecording) {
      if (!startRecordingTime) {
        setStartRecordingTime(Date.now());
      }

      tracker.startNote(midiNumber);
    }
  };

  const stopNote = (midiNumber) => {
    if (isRecording) {
      const noteEvent = tracker.stopNote(midiNumber);
      if (noteEvent) {
        const { startTime, duration } = noteEvent;

        setRecordedNotes([
          ...recordedNotes,
          {
            midiNumber,
            startTime: startTime - startRecordingTime,
            duration,
          },
        ]);
      }
    }
  };

  return { isRecording, canStopRecording, recordedNotes, startRecording, stopRecording, playNote, stopNote, clear };
};

export default useRecorder;
