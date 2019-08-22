import { useState, useRef, useEffect } from 'react';
import _ from 'lodash';

const getRecordingEndTime = (recording = []) => {
  if (recording.length === 0) {
    return 0;
  }
  return Math.max(...recording.map(event => event.startTime + event.duration));
};

const usePlayer = () => {
  const [activeNotes, setActiveNotes] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [currentSong, setCurrentSong] = useState(null);
  const scheduledEvents = useRef([]);
  const cancel = useRef();

  const stop = () => {
    scheduledEvents.current.forEach((scheduledEvent) => {
      clearTimeout(scheduledEvent);
    });
    scheduledEvents.current = [];
    setIsPlaying(false);
    setActiveNotes(null);
    setCurrentSong(null);

    if (cancel.current) {
      cancel.current();
      cancel.current = null;
    }
  };

  const play = (keySequence) => {
    stop();

    return new Promise((resolve) => {
      cancel.current = resolve;

      setCurrentSong(keySequence);
      setIsPlaying(true);

      const startAndEndTimes = _.uniq(
        _.flatMap(keySequence, event => [
          event.startTime,
          event.startTime + event.duration,
        ]),
      );
      startAndEndTimes.forEach((time) => {
        scheduledEvents.current.push(
          setTimeout(() => {
            const currentEvents = keySequence.filter(event => (
              event.startTime <= time && event.startTime + event.duration > time
            ));

            setActiveNotes(() => currentEvents.map(({ midiNumber }) => midiNumber));
          }, time),
        );
      });

      // Stop at the end
      scheduledEvents.current.push(
        setTimeout(() => {
          stop();
        }, getRecordingEndTime(keySequence)),
      );
    });
  };

  useEffect(() => () => stop(), []);

  const disable = () => setIsDisabled(true);
  const enable = () => setIsDisabled(false);

  return { isPlaying, currentSong, play, stop, activeNotes, isDisabled, disable, enable };
};

export default usePlayer;
