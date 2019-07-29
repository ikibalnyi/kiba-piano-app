import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

import './global.css';
import App from 'containers/App';
import { SoundfontProvider } from 'components';

const client = new ApolloClient({
  uri: 'http://localhost:4000',
});

const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const soundfontHostname = 'https://d1pzp51pvbm36p.cloudfront.net';

ReactDOM.render(
  <ApolloProvider client={client}>
    <SoundfontProvider
      instrumentName="acoustic_grand_piano"
      audioContext={audioContext}
      hostname={soundfontHostname}
    >
      <App />
    </SoundfontProvider>
  </ApolloProvider>,
  document.getElementById('root'),
);
