import React from 'react';
import PropTypes from 'propTypes';

const PlayButton = ({ isPlaying, ...props }) => (
  <button
    type="button"
    {...props}
    className="btn btn-icon btn-play"
  >
    {isPlaying ? '■' : '▶'}
  </button>
);

PlayButton.propTypes = {
  isPlaying: PropTypes.bool,
};

export default PlayButton;
