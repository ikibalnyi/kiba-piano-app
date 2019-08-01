import React from 'react';

import PropTypes from 'propTypes';
import usePlayback from './usePlayback';

const PlaybackButton = ({ keySequence, ...props }) => {
  const player = usePlayback();
  const isPlaying = player.isPlaying && player.currentSong === keySequence;

  const togglePlay = () => {
    if (isPlaying) {
      player.stop();
    } else {
      player.play(keySequence);
    }
  };

  return (
    <button
      type="button"
      onClick={togglePlay}
      {...props}
      disabled={player.isDisabled || props.disabled}
      className="btn btn-icon btn-play"
    >
      {isPlaying ? '■' : '▶'}
    </button>
  );
};

PlaybackButton.propTypes = {
  keySequence: PropTypes.KeySequence.isRequired,
  disabled: PropTypes.bool,
};

export default PlaybackButton;
