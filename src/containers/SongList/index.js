import React, { useState } from 'react';

import { PlayButton } from 'components';
import PropTypes from 'propTypes';
import styles from './styles.module.css';

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
            setSongIndex(currentIndex => (currentIndex === index ? -1 : currentIndex));
          });
      }
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>My Songs</div>
      {songs.map(({ name, track }, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <div key={index} className={styles.songWrapper}>
          <PlayButton
            isPlaying={index === songIndex}
            onClick={() => handlePlaySong(index)}
          />
          <div className={styles.songTitle}>{name}</div>
        </div>
      ))}
    </div>
  );
};


SongsList.propTypes = {
  songs: PropTypes.arrayOf(PropTypes.Song).isRequired,
  player: PropTypes.Player.isRequired,
};

export default SongsList;
