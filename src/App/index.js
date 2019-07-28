import React from 'react';

import Piano from '../Piano';
import { useRecording } from '../hooks';
import styles from './style.module.css';

const App = () => {
  const {
    isRecording, canStopRecording, startRecording, recordedNotes, stopRecording, playNote, stopNote,
  } = useRecording();

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handlePlayNoteInput = (midiNumber) => {
    playNote(midiNumber);
  };

  const handleStopNoteInput = (midiNumber) => {
    stopNote(midiNumber);
  };

  const isRecordingBtnDisabled = isRecording && !canStopRecording;

  return (
    <div className={styles.wrapper}>
      <h1>React Piano Task</h1>
      <Piano
        onPlayNoteInput={handlePlayNoteInput}
        onStopNoteInput={handleStopNoteInput}
      />
      <div>
        <button
          onClick={toggleRecording}
          disabled={isRecordingBtnDisabled}
        >{!isRecording ? 'Start' : 'Stop'} recording</button>
      </div>
      <div>
        <strong>Recorded notes</strong>
        <div>{JSON.stringify(recordedNotes)}</div>
      </div>
    </div>
  );
};

export default App;
