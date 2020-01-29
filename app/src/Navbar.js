import React from 'react';
import Web3 from 'web3';
import Store from './contracts/Store.json';
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
    if (!this.state.currAccount)
      this.setState({
        currAccount,
      });

    await this.checkforDeployedStores();
  }

  checkforDeployedStores = async () => {
    const { drizzle } = this.props;
    const deployedStores = await drizzle.contracts.StoreFactory.methods
      .getDeployedStores()
      .call({ from: this.state.currAccount });

    //Adds all the stores that the individual created to drizzle
    if (deployedStores.length) {
      this.setState({ deployedStores });

      for (let i = 0; i < deployedStores.length; i++) {
        let web3 = new Web3(Web3.givenProvider);
        let contractName = `Store${i}`;

        let web3Contract = new web3.eth.Contract(
          Store['abi'],
          deployedStores[i]
        );
        let contractConfig = { contractName, web3Contract };
        let events = ['LogItemAdded'];
        drizzle.addContract(contractConfig, events);
      }
      console.log('added to drizzle!');
    }
  };

  createStore = async () => {
    await this.props.drizzle.contracts.StoreFactory.methods
      .createStore()
      .send({ from: this.state.currAccount });
    this.checkforDeployedStores();
    //Should change to only check for the last one and add that to contracts
  };

  render() {
    console.log(this.props, ' STATE');
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
