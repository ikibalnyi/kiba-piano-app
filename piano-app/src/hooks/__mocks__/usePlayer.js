
const returnValue = {
  get isPlaying() { return false; },
  get isDisabled() { return false; },
  get currentSong() { return null; },
  get activeNotes() { return null; },
  play: jest.fn(),
  stop: jest.fn(),
  disable: jest.fn(),
  enable: jest.fn(),
};

const mocks = {
  ...returnValue,
  isPlaying: jest.spyOn(returnValue, 'isPlaying', 'get'),
  isDisabled: jest.spyOn(returnValue, 'isDisabled', 'get'),
  currentSong: jest.spyOn(returnValue, 'currentSong', 'get'),
  activeNotes: jest.spyOn(returnValue, 'activeNotes', 'get'),
};

const usePlayerMock = () => returnValue;

// eslint-disable-next-line no-underscore-dangle
usePlayerMock.__mocks__ = mocks;
// eslint-disable-next-line no-underscore-dangle
usePlayerMock.__resetAllMocks = () => {
  mocks.isPlaying.mockReset();
  mocks.isDisabled.mockReset();
  mocks.currentSong.mockReset();
  mocks.activeNotes.mockReset();
  mocks.play.mockReset();
  mocks.stop.mockReset();
  mocks.disable.mockReset();
  mocks.enable.mockReset();
};

export default usePlayerMock;
