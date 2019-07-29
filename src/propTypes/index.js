import PropTypes from 'prop-types';

const NoteEvent = PropTypes.shape({
  midiNumber: PropTypes.number,
  startTime: PropTypes.number,
  duration: PropTypes.number,
});

const Song = PropTypes.arrayOf(NoteEvent);

const Player = PropTypes.shape({
  activeNotes: PropTypes.arrayOf(PropTypes.number),
  isPlaying: PropTypes.bool,
  play: PropTypes.func,
  stop: PropTypes.func,
});


export default {
  ...PropTypes,
  NoteEvent,
  Song,
  Player,
};
