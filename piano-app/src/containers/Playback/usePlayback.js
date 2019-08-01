import { useContext } from 'react';

import { PlaybackContext } from './PlaybackProvider';

const usePlayback = () => {
  const playback = useContext(PlaybackContext);

  return playback;
};

export default usePlayback;
