import React from 'react';

const RecordButton = ({ isRecording, canStopRecording, ...props }) => (
  <button
    className="btn btn-icon btn-record"
    disabled={isRecording && !canStopRecording}
    {...props}
  >
    {!isRecording ? 'Start' : 'Stop'} recording
  </button>
);

export default RecordButton;
