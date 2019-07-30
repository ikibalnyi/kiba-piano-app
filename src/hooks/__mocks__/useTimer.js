const returnValue = {
  get seconds() { return 0; },
  startTimer: jest.fn(),
  stopTimer: jest.fn(),
  resetTimer: jest.fn(),
};

const mocks = {
  ...returnValue,
  seconds: jest.spyOn(returnValue, 'seconds', 'get'),
};

const useTimerMock = () => returnValue;

// eslint-disable-next-line no-underscore-dangle
useTimerMock.__mocks__ = mocks;
// eslint-disable-next-line no-underscore-dangle
useTimerMock.__resetAllMocks = () => {
  mocks.seconds.mockReset();
  mocks.startTimer.mockReset();
  mocks.stopTimer.mockReset();
  mocks.resetTimer.mockReset();
};

export default useTimerMock;
