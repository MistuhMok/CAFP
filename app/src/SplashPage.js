import React from 'react';
import { Button, Segment, Form } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';

// import SearchBar from "./SearchBar";

class SplashPage extends React.Component {
  onSubmit() {}

  render() {
    // const { drizzle, drizzleState, props } = this.props;
    return (
      <Segment placeholder>
        <Form>
          <Form.Input
            icon="building"
            iconPosition="left"
            label="Store Address"
            placeholder="Address"
          />
          <Button content="Search" primary />
        </Form>
      </Segment>
    );
  }
}

export default withRouter(SplashPage);
