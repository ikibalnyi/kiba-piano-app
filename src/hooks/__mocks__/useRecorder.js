
const returnValue = {
  get isRecording() { return false; },
  get hasPressedKeys() { return false; },
  get keySequence() { return []; },
  startRecording: jest.fn(),
  stopRecording: jest.fn(),
  onPlayNote: jest.fn(),
  onStopNote: jest.fn(),
  clear: jest.fn(),
};

const mocks = {
  ...returnValue,
  isRecording: jest.spyOn(returnValue, 'isRecording', 'get'),
  hasPressedKeys: jest.spyOn(returnValue, 'hasPressedKeys', 'get'),
  keySequence: jest.spyOn(returnValue, 'keySequence', 'get'),
};

const useRecorderMock = () => returnValue;

// eslint-disable-next-line no-underscore-dangle
useRecorderMock.__mocks__ = mocks;
// eslint-disable-next-line no-underscore-dangle
useRecorderMock.__resetAllMocks = () => {
  mocks.isRecording.mockReset();
  mocks.hasPressedKeys.mockReset();
  mocks.keySequence.mockReset();
  mocks.startRecording.mockReset();
  mocks.stopRecording.mockReset();
  mocks.onPlayNote.mockReset();
  mocks.onStopNote.mockReset();
  mocks.clear.mockReset();
};

export default useRecorderMock;
