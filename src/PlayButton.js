import React from 'react';

const PlayButton = ({ isPlaying, ...props }) => (
  <button
    {...props}
    className="btn btn-icon btn-play"
  >
    {isPlaying ? '■' : '▶'}
  </button>
);

export default PlayButton;
