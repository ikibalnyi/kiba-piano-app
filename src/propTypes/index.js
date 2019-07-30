import PropTypes from 'prop-types';

const NoteEvent = PropTypes.shape({
  midiNumber: PropTypes.number,
  startTime: PropTypes.number,
  duration: PropTypes.number,
});

const KeySequence = PropTypes.arrayOf(NoteEvent);

const Song = PropTypes.shape({
  title: PropTypes.string,
  keySequence: KeySequence,
});

const Player = PropTypes.shape({
  activeNotes: PropTypes.arrayOf(PropTypes.number),
  isPlaying: PropTypes.bool,
  play: PropTypes.func,
  stop: PropTypes.func,
});


export default {
  ...PropTypes,
  NoteEvent,
  KeySequence,
  Song,
  Player,
};
