import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

class ManageStore extends Component {
  //Click should open the store
  constructor() {
    super();
    this.state = { deployedStores: [] };
  }
  async componentDidMount() {
    const { drizzle } = this.props;
    const deployedStores = await drizzle.contracts.StoreFactory.methods
      .getDeployedStores()
      .call({ from: this.state.currAccount });
    this.setState({ deployedStores });
  }

  render() {
    const { deployedStores } = this.state;
    return (
      <div>
        <h2>Manage Stores</h2>
        {deployedStores.length
          ? deployedStores.map(store => (
              <div
                key={store}
                onClick={() => this.props.history.push(`/store/${store}`)}
              >
                Store Address: {store}
              </div>
            ))
          : `You don't own any stores`}
      </div>
    );
  }
}

export default withRouter(ManageStore);
