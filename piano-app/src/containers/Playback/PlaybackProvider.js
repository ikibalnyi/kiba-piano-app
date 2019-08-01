import React from 'react';

import { usePlayer } from 'hooks';
import PropTypes from 'propTypes';

export const PlaybackContext = React.createContext(null);

const PlaybackProvider = (props) => {
  const player = usePlayer();

  return (
    <PlaybackContext.Provider value={player}>
      {props.children(player)}
    </PlaybackContext.Provider>
  );
};

PlaybackProvider.propTypes = {
  children: PropTypes.func.isRequired,
};

export default PlaybackProvider;
