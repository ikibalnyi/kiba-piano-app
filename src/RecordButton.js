import React from 'react';

const RecordButton = ({ disabled, isRecording, canStopRecording, ...props }) => (
  <button
    {...props}
    className="btn btn-icon btn-record"
    disabled={disabled || (isRecording && !canStopRecording)}
  >
    {!isRecording ? 'Start' : 'Stop'} recording
  </button>
);

export default RecordButton;
