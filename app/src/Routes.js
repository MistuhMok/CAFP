import { Route, Switch } from 'react-router-dom';

import React from 'react';
import Navbar from './Navbar';
import SplashPage from './SplashPage';
import ManageStore from './ManageStore';

export default function Routes(props) {
  const { drizzle, drizzleState } = props;

  return (
    <div>
      <Navbar drizzle={drizzle} drizzleState={drizzleState} />

      <Switch>
        <Route
          exact
          path="/"
          render={props => {
            return (
              <SplashPage
                drizzle={drizzle}
                drizzleState={drizzleState}
                props={props}
              />
            );
          }}
        />
        <Route
          exact
          path="/managestores"
          render={props => {
            return (
              <ManageStore
                drizzle={drizzle}
                drizzleState={drizzleState}
                props={props}
              />
            );
          }}
        />
        <Route path="*" render={() => <h1>No Route Found!</h1>} />
      </Switch>
    </div>
  );
}
