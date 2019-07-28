import React, { useState } from 'react';
import './style.css';
import Piano from '../Piano';

const App = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedNotes, setRecordedNotes] = useState([]);
  const [startRecordingTime, setStartRecordingTime] = useState(null);

  const toggleRecording = () => {
    setIsRecording(!isRecording);

    if (isRecording) {
      setStartRecordingTime(null);
      setRecordedNotes([...recordedNotes].sort((a, b) => a.startTime > b.startTime ? 1 :
        a.startTime < b.startTime ? -1 : 0));
    } else {
      setRecordedNotes([]);
    }
  };

  const handlePlayNote = () => {
    if (isRecording && !startRecordingTime) {
      setStartRecordingTime(Date.now());
    }
  };

  const handleRecordNote = ({ midiNumber, startTime, duration }) => {
    if (isRecording) {
      setRecordedNotes([
        ...recordedNotes,
        {
          midiNumber,
          startTime: startTime - startRecordingTime,
          duration,
        },
      ]);
    }
  };

  return (
    <div className="App">
      <h1>React Piano Task</h1>
      <Piano
        isRecording={isRecording}
        onPlayNote={handlePlayNote}
        onRecordNote={handleRecordNote}
      />
      <div>
        <button onClick={toggleRecording}>{!isRecording ? 'Start' : 'Stop'} recording</button>
      </div>
      <div>
        <strong>Recorded notes</strong>
        <div>{JSON.stringify(recordedNotes)}</div>
      </div>
    </div>
  );
};

export default App;
