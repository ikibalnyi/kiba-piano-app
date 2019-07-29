import React from 'react';

import { useRecording, useTimer } from 'hooks';
import { formatTime } from 'utils';
import styles from 'App/styles.module.css';
import Piano from 'Piano';
import RecordButton from 'RecordButton';
import SongForm from 'SongForm';

const RecordingPiano = ({ saveSong, player }) => {
  const recorder = useRecording();
  const timer = useTimer();
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


  const handleSaveSong = (title) => {
    Promise.resolve(saveSong({
      title,
      notes: recorder.recordedNotes,
    }))
      .then(() => {
        recorder.clear();
        timer.resetTimer();
      });
  };

  return (
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
              onSave={handleSaveSong}
            />
          )}
        </div>
      </div>
    </div>
  );
};


export default RecordingPiano;
