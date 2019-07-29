
const formatTime = (timestamp) => {
  const minutes = Math.floor(timestamp / 60);
  const seconds = timestamp % 60;

  return [minutes, seconds]
    .map(v => (v < 10 ? `0${v}` : v))
    .join(':');
};

export default formatTime;
