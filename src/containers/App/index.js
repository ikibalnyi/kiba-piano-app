import React, { useState } from 'react';

import { usePlayer } from 'hooks';
import RecordingPiano from 'containers/RecordingPiano';
import SongList from 'containers/SongList';
import styles from 'containers/App/styles.module.css';

const App = () => {
  const player = usePlayer();
  const [songs, setSongs] = useState([]);

  const handleSaveSong = ({ title, keySequence }) => {
    setSongs([
      ...songs,
      {
        title,
        keySequence,
      },
    ]);
  };

  return (
    <div className={styles.wrapper}>
      <h1>React Piano Task</h1>
      <RecordingPiano
        player={player}
        saveSong={handleSaveSong}
      />
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
