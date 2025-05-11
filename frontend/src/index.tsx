import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google'; 

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="1097095888255-ck0tuobs981gtv02r082a9h8u6f6cf18.apps.googleusercontent.com
  "
    > 
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);
