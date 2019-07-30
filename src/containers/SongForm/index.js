import React, { useState } from 'react';
import PropTypes from 'propTypes';

import styles from './styles.module.css';

const SongForm = ({ onSave }) => {
  const [value, setValue] = useState('');

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleClickSave = () => {
    const normalizedValue = value.trim();

    if (normalizedValue) {
      onSave(normalizedValue, () => {
        setValue(() => '');
      });
    }
  };

  return (
    <div className={styles.wrapper}>
      <input
        type="text"
        placeholder="Song title"
        value={value}
        onKeyDown={evt => evt.stopPropagation()}
        onChange={handleChange}
      />
      <button
        type="button"
        className="btn"
        onClick={handleClickSave}
      >
        Save
      </button>
    </div>
  );
};

SongForm.propTypes = {
  onSave: PropTypes.func,
};

export default SongForm;
