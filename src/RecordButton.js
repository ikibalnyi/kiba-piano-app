import React from 'react';

const RecordButton = ({ isRecording, canStopRecording, ...props }) => (
  <button
    disabled={isRecording && !canStopRecording}
    {...props}
  >
    {!isRecording ? 'Start' : 'Stop'} recording
  </button>
);

export default RecordButton;
