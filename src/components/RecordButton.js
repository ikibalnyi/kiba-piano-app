import React from 'react';
import PropTypes from 'propTypes';

const RecordButton = ({ isRecording, ...props }) => (
  <button
    type="button"
    {...props}
    className="btn btn-icon btn-record"
  >
    {!isRecording ? 'Start' : 'Stop'} recording
  </button>
);

RecordButton.propTypes = {
  isRecording: PropTypes.bool,
};

export default RecordButton;
