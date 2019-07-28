import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Piano as ReactPiano, KeyboardShortcuts, MidiNumbers } from 'react-piano';
import 'react-piano/dist/styles.css';

import SoundfontProvider from './SoundfontProvider';

const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const soundfontHostname = 'https://d1pzp51pvbm36p.cloudfront.net';

const noteRange = {
  first: MidiNumbers.fromNote('c3'),
  last: MidiNumbers.fromNote('f4'),
};
const keyboardShortcuts = KeyboardShortcuts.create({
  firstNote: noteRange.first,
  lastNote: noteRange.last,
  keyboardConfig: KeyboardShortcuts.HOME_ROW,
});

const Piano = ({ isRecording, onPlayNote, onRecordNote }) => {
  const [playingNotes, setPlayingNotes] = useState({});

  const handlePlayNoteInput = (midiNumber, event) => {
    if (isRecording && !playingNotes[midiNumber]) {
      setPlayingNotes({
        ...playingNotes,
        [midiNumber]: Date.now(),
      });
    }

    onPlayNote && onPlayNote(midiNumber, event);
  };

  const handleStopNoteInput = (midiNumber) => {
    if (isRecording) {
      const { [midiNumber]: startTime, ...restPlayingNotes } = playingNotes;
      if (startTime) {
        const duration = Date.now() - startTime;

        setPlayingNotes(restPlayingNotes);
        onRecordNote && onRecordNote({ midiNumber, startTime, duration });
      }
    }
  };

  return (
    <SoundfontProvider
      instrumentName="acoustic_grand_piano"
      audioContext={audioContext}
      hostname={soundfontHostname}
      render={({ isLoading, playNote, stopNote }) => (
        <div>
          <div>
            <ReactPiano
              disabled={isLoading}
              noteRange={noteRange}
              playNote={playNote}
              stopNote={stopNote}
              onPlayNoteInput={handlePlayNoteInput}
              onStopNoteInput={handleStopNoteInput}
              width={1000}
              keyboardShortcuts={keyboardShortcuts}
            />
          </div>
          <div>
            <strong>Playing notes</strong>
            <div>{JSON.stringify(playingNotes)}</div>
          </div>
        </div>
      )}
    />
  );
};

Piano.propTypes = {
  isRecording: PropTypes.bool,
  onPlayNote: PropTypes.func,
  onRecordNote: PropTypes.func,
};

export default Piano;
