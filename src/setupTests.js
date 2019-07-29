import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import '@testing-library/jest-dom/extend-expect';
import { cleanup } from '@testing-library/react';

afterEach(cleanup);

configure({ adapter: new Adapter() });
