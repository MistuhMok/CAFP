import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { Drizzle } from 'drizzle';
import { DrizzleContext } from 'drizzle-react';
import './App.css';
import store from './middleware';
import { BrowserRouter } from 'react-router-dom';
import options from './drizzleOptions';
import Routes from './Routes';

const drizzle = new Drizzle(options, store);

ReactDOM.render(
  <DrizzleContext.Provider drizzle={drizzle}>
    <BrowserRouter>
      <DrizzleContext.Consumer>
        {drizzleContext => {
          const { drizzle, drizzleState, initialized } = drizzleContext;

          if (!initialized) {
            return (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'column',
                }}
              >
                <h1>Loading...</h1>
              </div>
            );
          }
          return <Routes drizzle={drizzle} drizzleState={drizzleState} />;
        }}
      </DrizzleContext.Consumer>
    </BrowserRouter>
  </DrizzleContext.Provider>,

  document.getElementById('root')
);

serviceWorker.unregister();
