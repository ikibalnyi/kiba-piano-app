import React, { useState } from 'react';

import PlayButton from '../PlayButton';
import styles from './style.module.css';

const SongsList = ({ songs, player }) => {
  const [songIndex, setSongIndex] = useState(-1);

  const handlePlaySong = (index) => {
    if (songIndex === index) {
      player.stop();
    } else {
      const song = songs[index];
      if (song) {
        setSongIndex(index);
        player
          .play(song.track)
          .then(() => {
            setSongIndex(-1);
          });
      }
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>My Songs</div>
      {songs.map(({ name, track }, index) => (
        <div key={index} className={styles.songWrapper}>
          <PlayButton
            className={styles.playBtn}
            isPlaying={index === songIndex}
            onClick={() => handlePlaySong(index)}
          />
          <div className={styles.songTitle}>{name}</div>
        </div>
      ))}
    </div>
  );
};

export default SongsList;
