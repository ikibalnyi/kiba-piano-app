import React from 'react';

import { useRecorder, useTimer } from 'hooks';
import { formatTime } from 'utils';
import { RecordButton } from 'components';
import { PlaybackButton } from 'containers/Playback';
import SongForm from 'containers/SongForm';
import PropTypes from 'propTypes';
import styles from './styles.module.css';


const Recorder = ({ disabled, renderPiano, saveSong, onStartRecording, onStopRecording }) => {
  const recorder = useRecorder();
  const timer = useTimer();

  const toggleRecording = () => {
    if (recorder.isRecording) {
      recorder.stopRecording();
      timer.stopTimer();
      if (onStopRecording) onStopRecording();
    } else {
      recorder.startRecording();
      timer.startTimer();
      if (onStartRecording) onStartRecording();
    }
  };

  const handleClickSave = (title) => {
    saveSong({ title, keySequence: recorder.keySequence })
      .then(() => {
        recorder.clear();
        timer.resetTimer();
      });
  };

  return (
    <div>
      <div className={styles.pianoWrapper}>
        {renderPiano({
          onPlayNote: recorder.onPlayNote,
          onStopNote: recorder.onStopNote,
        })}
      </div>
      <div className={styles.recordingWrapper}>
        <div className={styles.recordingButtons}>
          <RecordButton
            data-testid="record-button"
            isRecording={recorder.isRecording}
            disabled={disabled || recorder.hasPressedKeys}
            onClick={toggleRecording}
          />
          <div className={styles.recordingTimer}>{formatTime(timer.seconds)}</div>
        </div>
        {!recorder.isRecording && recorder.keySequence && !!recorder.keySequence.length && (
          <div className={styles.songFormWrapper} data-testid="song-form-wrapper">
            <PlaybackButton keySequence={recorder.keySequence} />
            <SongForm onSave={handleClickSave} data-testid="song-form" />
          </div>
        )}
      </div>
    </div>
  );
};


Recorder.propTypes = {
  renderPiano: PropTypes.func.isRequired,
  saveSong: PropTypes.func.isRequired,
  onStartRecording: PropTypes.func,
  onStopRecording: PropTypes.func,
  disabled: PropTypes.bool,
};

export default Recorder;
