import React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import Recorder from 'containers/Recorder';
import SongList from 'containers/SongList';
import Piano from 'containers/Piano';
import { PlaybackProvider } from 'containers/Playback';
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

const App = () => (
  <PlaybackProvider>
    {player => (
      <div className={styles.wrapper}>
        <h1>React Piano Task</h1>
        <Mutation mutation={ADD_SONG} refetchQueries={['Songs']}>
          {addSong => (
            <Recorder
              onStartRecording={() => player.disable()}
              onStopRecording={() => player.enable()}
              disabled={player.isPlaying}
              saveSong={({ title, keySequence }) => (
                addSong({ variables: { title, keySequence } })
              )}
              renderPiano={({ onPlayNote, onStopNote }) => (
                <Piano
                  activeNotes={player.activeNotes}
                  onPlayNoteInput={onPlayNote}
                  onStopNoteInput={onStopNote}
                />
              )}
            />
          )}
        </Mutation>
        <SongList />
      </div>
    )}
  </PlaybackProvider>
);

export default App;
