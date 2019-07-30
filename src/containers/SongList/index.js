import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import { PlaybackButton } from 'containers/Playback';
import styles from './styles.module.css';

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

const SongsList = () => (
  <div className={styles.wrapper}>
    <div className={styles.title}>My Songs</div>
    <Query query={GET_SONGS}>
      {({ data, loading, error }) => {
        if (loading) return <div>Loading songs...</div>;
        if (error) return <div>Error: {error.message}</div>;

        return data.songs.map(({ _id, title, keySequence }) => (
          <div key={_id} className={styles.songWrapper}>
            <PlaybackButton keySequence={keySequence} />
            <div className={styles.songTitle}>{title}</div>
          </div>
        ));
      }}
    </Query>
  </div>
);

export default SongsList;
