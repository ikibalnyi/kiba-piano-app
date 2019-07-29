import React, { useState } from 'react';

import Piano from '../Piano';
import { useRecording, usePlayRecording } from '../hooks';
import RecordButton from '../RecordButton';
import SongList from '../SongList';
import SongTitleForm from '../SongForm';
import styles from './style.module.css';

const App = () => {
  const recorder = useRecording();
  const player = usePlayRecording();
  const [songs, setSongs] = useState([]);

  const toggleRecording = () => {
    if (recorder.isRecording) {
      if (recorder.canStopRecording) {
        recorder.stopRecording();
      }
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

  const handleSaveRecord = (title) => {
    setSongs([
      ...songs,
      {
        name: title,
        track: recorder.recordedNotes,
      },
    ]);

    recorder.clear();
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
          <RecordButton
            isRecording={recorder.isRecording}
            canStopRecording={recorder.canStopRecording}
            disabled={player.isPlaying || undefined}
            onClick={toggleRecording}
          />
          <div className={styles.songFormWrapper}>
            {!recorder.isRecording && !!recorder.recordedNotes.length && (
              <SongTitleForm
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
