import React, { useState } from 'react';
import PropTypes from 'propTypes';

import { PlayButton } from 'components';
import styles from './styles.module.css';

const SongForm = ({ song, player, onSave }) => {
  const [value, setValue] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleClickSave = () => {
    const normalizedValue = value.trim();

    if (normalizedValue) {
      onSave(normalizedValue);
      setValue('');
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      player.stop();
    } else {
      setIsPlaying(true);

      player.play(song)
        .then(() => {
          setIsPlaying(false);
        });
    }
  };

  return (
    <div className={styles.wrapper}>
      <PlayButton
        isPlaying={isPlaying}
        onClick={togglePlay}
      />
      <input
        type="text"
        placeholder="Song title"
        value={value}
        onKeyDown={evt => evt.stopPropagation()}
        onChange={handleChange}
      />
      <button
        type="button"
        className="btn"
        onClick={handleClickSave}
      >
        Save
      </button>
    </div>
  );
};

SongForm.propTypes = {
  song: PropTypes.KeySequence.isRequired,
  player: PropTypes.Player.isRequired,
  onSave: PropTypes.func,
};

export default SongForm;
