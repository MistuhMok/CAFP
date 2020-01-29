import React from 'react';
import { Button, Divider, Grid, Segment, Form } from 'semantic-ui-react';
// import { withRouter } from "react-router-dom";

// import SearchBar from "./SearchBar";

class SplashPage extends React.Component {
  render() {
    // const { drizzle, drizzleState, props } = this.props;
    return (
      <Segment placeholder>
        <Grid columns={2}>
          <Grid.Column>
            <Form>
              <Form.Input
                icon="building"
                iconPosition="left"
                label="Store Address"
                placeholder="Address"
              />
              <Button content="Search" primary />
            </Form>
          </Grid.Column>

          <Grid.Column verticalAlign="middle">
            <Button content="Manage Stores" icon="signup" size="big" />
            <Button content="Create a Store" icon="add" size="big" />
          </Grid.Column>
        </Grid>

        <Divider vertical>Or</Divider>
      </Segment>
    );
  }
}

export default SplashPage;
