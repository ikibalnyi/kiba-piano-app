import React, { useState } from 'react';

import { useRecording, usePlayRecording, useTimer } from '../hooks';
import { formatTime } from 'utils';
import Piano from '../Piano';
import RecordButton from '../RecordButton';
import SongList from '../SongList';
import SongForm from '../SongForm';
import styles from './styles.module.css';

const App = () => {
  const recorder = useRecording();
  const player = usePlayRecording();
  const timer = useTimer();
  const [songs, setSongs] = useState([]);
  const recordingTime = formatTime(timer.seconds);

  const toggleRecording = () => {
    if (recorder.isRecording) {
      if (recorder.canStopRecording) {
        recorder.stopRecording();
        timer.stopTimer();
      }
    } else {
      recorder.startRecording();
      timer.startTimer();
    }
  };

  const handlePlayNoteInput = async (midiNumber) => {
    recorder.playNote(midiNumber);
  };

  const handleStopNoteInput = async (midiNumber) => {
    recorder.stopNote(midiNumber);
  };

  const handleSaveRecord = (title) => {
    setSongs([
      ...songs,
      {
        name: title,
        track: recorder.recordedNotes,
      },
    ]);

    recorder.clear();
    timer.resetTimer();
  };

  return (
    <div className={styles.wrapper}>
      <h1>React Piano Task</h1>
      <div>
        <div className={styles.pianoWrapper}>
          <Piano
            activeNotes={player.activeNotes}
            onPlayNoteInput={handlePlayNoteInput}
            onStopNoteInput={handleStopNoteInput}
          />
        </div>
        <div className={styles.recordingWrapper}>
          <div className={styles.recordingButtons}>
            <RecordButton
              isRecording={recorder.isRecording}
              canStopRecording={recorder.canStopRecording}
              disabled={player.isPlaying}
              onClick={toggleRecording}
            />
            <div className={styles.recordingTimer}>{recordingTime}</div>
          </div>
          <div className={styles.songFormWrapper}>
            {!recorder.isRecording && !!recorder.recordedNotes.length && (
              <SongForm
                player={player}
                song={recorder.recordedNotes}
                onSave={handleSaveRecord}
              />
            )}
          </div>
        </div>
      </div>
      {!!songs.length && (
        <SongList
          player={player}
          songs={songs}
        />
      )}
    </div>
  );
};

export default App;
