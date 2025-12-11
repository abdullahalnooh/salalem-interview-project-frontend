import React from 'react';
import ReactDOM from 'react-dom/client'; // ← important
import { ApolloProvider } from '@apollo/client/react';
import App from './App';
import client from './client';

function Root() {
  return (
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Root />);
