import { useState, useRef, useEffect } from 'react';
import _ from 'lodash';

const getRecordingEndTime = (recording = []) => {
  if (recording.length === 0) {
    return 0;
  }
  return Math.max(...recording.map((event) => event.startTime + event.duration));
};

const usePlayRecording = () => {
  const [activeNotes, setActiveNotes] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const scheduledEvents = useRef([]);
  const cancel = useRef();

  const stop = () => {
    scheduledEvents.current.forEach((scheduledEvent) => {
      clearTimeout(scheduledEvent);
    });
    scheduledEvents.current = [];
    setIsPlaying(false);
    setActiveNotes(null);

    if (cancel.current) {
      cancel.current();
      cancel.current = null;
    }
  };

  const play = (recording) => {
    stop();

    return new Promise((resolve) => {
      cancel.current = resolve;

      setIsPlaying(true);
      const startAndEndTimes = _.uniq(
        _.flatMap(recording, (event) => [
          event.startTime,
          event.startTime + event.duration,
        ])
      );
      startAndEndTimes.forEach((time) => {
        scheduledEvents.current.push(
          setTimeout(() => {
            const currentEvents = recording.filter((event) => {
              return event.startTime <= time && event.startTime + event.duration > time;
            });

            setActiveNotes(currentEvents.map(({ midiNumber }) => midiNumber));
          }, time)
        );
      });

      // Stop at the end
      scheduledEvents.current.push(
        setTimeout(() => {
          stop();
        }, getRecordingEndTime(recording))
      );
    });
  };

  useEffect(() => () => stop(), []);


  return { isPlaying, play, stop, activeNotes };
};

export default usePlayRecording;
