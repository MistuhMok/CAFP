import React from 'react';
import { Button, Segment, Form } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';

// import SearchBar from "./SearchBar";

class SplashPage extends React.Component {
  state = { address: '' };

  handleInputChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    // const { drizzle, drizzleState, props } = this.props;
    return (
      <Segment placeholder>
        <Form
          onSubmit={() =>
            this.props.history.push(`/store/${this.state.address}`)
          }
        >
          <Form.Input
            icon="building"
            iconPosition="left"
            label="Store Address"
            placeholder="Address"
            name="address"
            value={this.state.address}
            onChange={this.handleInputChange}
          />
          <Button content="Search" primary />
        </Form>
      </Segment>
    );
  }
}

export default withRouter(SplashPage);
