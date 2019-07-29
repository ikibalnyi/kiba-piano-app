import React, { useState } from 'react';

import { usePlayer } from 'hooks';
import RecordingPiano from 'RecordingPiano';
import SongList from '../SongList';
import styles from './styles.module.css';

const App = () => {
  const player = usePlayer();
  const [songs, setSongs] = useState([]);

  const handleSaveSong = ({ title, notes }) => {
    setSongs([
      ...songs,
      {
        name: title,
        track: notes,
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
