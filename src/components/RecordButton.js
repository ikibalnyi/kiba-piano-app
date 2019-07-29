import React from 'react';
import PropTypes from 'propTypes';

const RecordButton = ({ disabled, isRecording, canStopRecording, ...props }) => (
  <button
    type="button"
    {...props}
    className="btn btn-icon btn-record"
    disabled={disabled || (isRecording && !canStopRecording)}
  >
    {!isRecording ? 'Start' : 'Stop'} recording
  </button>
);

RecordButton.propTypes = {
  disabled: PropTypes.bool,
  isRecording: PropTypes.bool,
  canStopRecording: PropTypes.bool,
};

export default RecordButton;
