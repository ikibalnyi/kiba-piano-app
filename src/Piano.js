import React, { useContext } from 'react';
import { Piano as ReactPiano, KeyboardShortcuts, MidiNumbers } from 'react-piano';
import 'react-piano/dist/styles.css';

import SoundfontContext from './SoundfontContext';

const noteRange = {
  first: MidiNumbers.fromNote('c3'),
  last: MidiNumbers.fromNote('f4'),
};

const keyboardShortcuts = KeyboardShortcuts.create({
  firstNote: noteRange.first,
  lastNote: noteRange.last,
  keyboardConfig: KeyboardShortcuts.HOME_ROW,
});

const Piano = (props) => {
  const { isLoading, playNote, stopNote } = useContext(SoundfontContext);

  return (
    <div>
      <ReactPiano
        disabled={isLoading}
        width={1000}
        {...props}

        noteRange={noteRange}
        playNote={playNote}
        stopNote={stopNote}
        keyboardShortcuts={keyboardShortcuts}
      />
    </div>
  );
};

{ // encapsulate variables
  const { noteRange, playNote, stopNote, keyboardShortcuts, ...pianoPropTypes } = ReactPiano.propTypes;

  Piano.propTypes = pianoPropTypes;
}

export default Piano;
