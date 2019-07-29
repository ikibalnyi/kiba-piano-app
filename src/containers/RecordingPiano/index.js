import React from 'react';

import { useRecorder, useTimer } from 'hooks';
import { formatTime } from 'utils';
import { RecordButton } from 'components';
import Piano from 'containers/Piano';
import SongForm from 'containers/SongForm';
import PropTypes from 'propTypes';
import styles from './styles.module.css';

const RecordingPiano = ({ saveSong, player }) => {
  const recorder = useRecorder();
  const timer = useTimer();

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
          <div className={styles.recordingTimer}>{formatTime(timer.seconds)}</div>
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


RecordingPiano.propTypes = {
  saveSong: PropTypes.func.isRequired,
  player: PropTypes.Player.isRequired,
};

export default RecordingPiano;
