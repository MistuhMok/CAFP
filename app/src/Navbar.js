import React from 'react';
import { Button } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';

class Navbar extends React.Component {
  state = {
    currAccount: '',
    deployedStores: [],
  };

  async componentDidMount() {
    const { drizzle } = this.props;
    const currAccount = (await drizzle.web3.eth.getAccounts())[0];
    if (!this.state.currAccount) this.setState({ currAccount });

    await this.checkforDeployedStores();
  }

  checkforDeployedStores = async () => {
    const { drizzle } = this.props;
    const deployedStores = await drizzle.contracts.StoreFactory.methods
      .getDeployedStores()
      .call({ from: this.state.currAccount });

    if (deployedStores.length) this.setState({ deployedStores });
  };

  createStore = async () => {
    await this.props.drizzle.contracts.StoreFactory.methods
      .createStore()
      .send({ from: this.state.currAccount });
    this.checkforDeployedStores();
  };

  render() {
    // console.log(this.props, ' STATE');
    // const { drizzle, drizzleState } = this.props;
    const { deployedStores } = this.state;
    return (
      <div>
        <div className="App">
          <h2>ACCOUNT INFO</h2>
          <div>{this.state.currAccount}</div>
          <div>
            <Button
              primary
              icon="add"
              content="Create Store"
              onClick={this.createStore}
            />
            <Button
              primary
              onClick={() => this.props.history.push('/managestores')}
            >
              Manage Stores ({deployedStores.length})
            </Button>
            <Button primary onClick={() => this.props.history.push('/')}>
              Home
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Navbar);
