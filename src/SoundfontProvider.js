import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import Soundfont from 'soundfont-player';
import SoundfontContext from './SoundfontContext';

const SoundfontProvider = (props) => {
  const [activeAudioNodes, setActiveAudioNodes] = useState({});
  const [instrument, setInstrument] = useState(null);

  useEffect(() => {
    // Re-trigger loading state
    setInstrument(null);

    Soundfont.instrument(props.audioContext, props.instrumentName, {
      format: props.format,
      soundfont: props.soundfont,
      nameToUrl: (name, soundfont, format) => {
        return `${props.hostname}/${soundfont}/${name}-${format}.js`;
      },
    }).then((instrument) => {
      setInstrument(instrument);
    });
  }, [props.instrumentName]);

  const playNote = (midiNumber) => {
    props.audioContext.resume().then(() => {
      const audioNode = instrument.play(midiNumber);
      setActiveAudioNodes({
        ...activeAudioNodes,
        [midiNumber]: audioNode,
      });
    });
  };

  const stopNote = (midiNumber) => {
    props.audioContext.resume().then(() => {
      if (!activeAudioNodes[midiNumber]) {
        return;
      }
      const audioNode = activeAudioNodes[midiNumber];
      audioNode.stop();
      setActiveAudioNodes({
        ...activeAudioNodes,
        [midiNumber]: null,
      });
    });
  };

  // Clear any residual notes that don't get called with stopNote
  const stopAllNotes = () => {
    props.audioContext.resume().then(() => {
      for (const node of activeAudioNodes) {
        if (node) {
          node.stop();
        }
      }
      setActiveAudioNodes({});
    });
  };

  return (
    <SoundfontContext.Provider value={{
      playNote,
      stopNote,
      stopAllNotes,
      isLoading: !instrument,
    }}>
      {props.children}
    </SoundfontContext.Provider>
  );
};

SoundfontProvider.propTypes = {
  instrumentName: PropTypes.string.isRequired,
  hostname: PropTypes.string.isRequired,
  format: PropTypes.oneOf(['mp3', 'ogg']),
  soundfont: PropTypes.oneOf(['MusyngKite', 'FluidR3_GM']),
  audioContext: PropTypes.instanceOf(window.AudioContext),
  render: PropTypes.func,
};

SoundfontProvider.defaultProps = {
  format: 'mp3',
  soundfont: 'MusyngKite',
  instrumentName: 'acoustic_grand_piano',
};

export default SoundfontProvider;
