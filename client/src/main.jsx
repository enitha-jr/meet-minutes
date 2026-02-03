import React from 'react'
import ReactDOM from 'react-dom/client'
import { StrictMode } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store/store'

import App from './App.jsx'
import routes from './routes/routes.jsx'
import './index.css'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: routes,
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor}
        loading={<div>Loading...</div>}
        onBeforeLift={() => {
          const token = store.getState().auth.token;
          if (token) {
            import('./socketio/connectSocket').then(({ connectSocket }) => {
              connectSocket(token);
            });
          }
        }}
      >
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>
  </StrictMode>
)
