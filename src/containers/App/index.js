import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import { usePlayer } from 'hooks';
import RecordingPiano from 'containers/RecordingPiano';
import SongList from 'containers/SongList';
import styles from 'containers/App/styles.module.css';

const GET_SONGS = gql`
    query Songs {
        songs {
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

const App = () => {
  const player = usePlayer();

  return (
    <div className={styles.wrapper}>
      <h1>React Piano Task</h1>
      <RecordingPiano player={player} />
      <Query query={GET_SONGS}>
        {({ data }) => (data && data.songs && data.songs.length ? (
          <SongList
            songs={data.songs}
            player={player}
          />
        ) : null)}
      </Query>
    </div>
  );
};

export default App;
