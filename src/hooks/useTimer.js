import { useState, useRef } from 'react';

const useTimer = () => {
  const [seconds, setSeconds] = useState(0);
  const interval = useRef();

  const startTimer = () => {
    setSeconds(0);

    interval.current = setInterval(() => {
      setSeconds((sec) => sec + 1);
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(interval.current);
    interval.current = null;
  };

  const resetTimer = () => {
    stopTimer();
    setSeconds(0);
  };


  return { seconds, startTimer, stopTimer, resetTimer };
};

export default useTimer;
