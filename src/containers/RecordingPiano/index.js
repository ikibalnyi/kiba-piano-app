import React from 'react';
import gql from 'graphql-tag';

import { useRecorder, useTimer } from 'hooks';
import { formatTime } from 'utils';
import { RecordButton } from 'components';
import Piano from 'containers/Piano';
import SongForm from 'containers/SongForm';
import PropTypes from 'propTypes';
import { Mutation } from 'react-apollo';
import styles from './styles.module.css';


const ADD_SONG = gql`
    mutation AddSong($title: String!, $keySequence: [NoteEventInput]!) {
        addSong(title: $title, keySequence: $keySequence) {
            _id
            title
            keySequence {
                midiNumber
                startTime
                duration
            }
        }
    }
`;

const RecordingPiano = ({ player }) => {
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

  const handleSongAdded = () => {
    recorder.clear();
    timer.resetTimer();
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
          {!recorder.isRecording && !!recorder.keySequence.length && (
            <Mutation mutation={ADD_SONG} refetchQueries={['Songs']} onCompleted={handleSongAdded}>
              {addSong => (
                <SongForm
                  player={player}
                  song={recorder.keySequence}
                  onSave={(title) => {
                    addSong({
                      variables: { title, keySequence: recorder.keySequence },
                    });
                  }}
                />
              )}
            </Mutation>
          )}
        </div>
      </div>
    </div>
  );
};


RecordingPiano.propTypes = {
  player: PropTypes.Player.isRequired,
};

export default RecordingPiano;
