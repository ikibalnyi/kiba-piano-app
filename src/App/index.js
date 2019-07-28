import React from 'react';

import Piano from '../Piano';
import { useRecording, usePlayRecording } from '../hooks';
import styles from './style.module.css';
import RecordButton from '../RecordButton';

const App = () => {
  const recorder = useRecording();
  const player = usePlayRecording();

  const toggleRecording = () => {
    if (recorder.isRecording) {
      recorder.stopRecording();
    } else {
      recorder.startRecording();
    }
  };

  const handlePlayNoteInput = async (midiNumber) => {
    recorder.playNote(midiNumber);
  };

  const handleStopNoteInput = async (midiNumber) => {
    recorder.stopNote(midiNumber);
  };

  const togglePlay = () => {
    if (!recorder.isRecording) {
      if (player.isPlaying) {
        player.stop();
      } else {
        player.play(recorder.recordedNotes);
      }
    }
  };

  return (
    <div className={styles.wrapper}>
      <h1>React Piano Task</h1>
      <Piano
        activeNotes={player.activeNotes}
        onPlayNoteInput={handlePlayNoteInput}
        onStopNoteInput={handleStopNoteInput}
      />
      <div>
        <RecordButton
          isRecording={recorder.isRecording}
          canStopRecording={recorder.canStopRecording}
          disabled={player.isPlaying || undefined}
          onClick={toggleRecording}
        />
        <button
          onClick={togglePlay}
          disabled={recorder.isRecording || !recorder.recordedNotes.length}
        >
          {player.isPlaying ? 'Stop playing' : 'Play song'}
        </button>
      </div>
      <div>
        <strong>Recorded notes</strong>
        <div>{JSON.stringify(recorder.recordedNotes)}</div>
      </div>
    </div>
  );
};

export default App;
