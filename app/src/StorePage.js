import React from 'react';
import Web3 from 'web3';
import Store from './contracts/Store.json';
import { Button, Label, Icon, Card } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import AddItemForm from './AddItemForm.js';
import SingleItem from './SingleItem.js';

class StorePage extends React.Component {
  state = {
    userAddress: '',
    storeAddress: this.props.props.match.params.address,
    numItems: 0,
    itemInfo: [],
    showAddItemForm: false,
  };

  async componentDidMount() {
    const { drizzle } = this.props;
    const { storeAddress } = this.state;
    const currAccount = (await drizzle.web3.eth.getAccounts())[0];
    if (!this.state.userAddress) this.setState({ userAddress: currAccount });

    let web3 = new Web3(Web3.givenProvider);
    let web3Contract = new web3.eth.Contract(Store['abi'], storeAddress);
    let contractConfig = { contractName: 'Store', web3Contract };
    let events = ['LogItemAdded'];
    if (drizzle.contracts.Store) drizzle.deleteContract('Store');

    drizzle.addContract(contractConfig, events);

    this.fetchItems();
  }

  fetchItems = async () => {
    const { drizzle } = this.props;
    let numItems = this.state.numItems;
    const numStoreItems = await drizzle.contracts.Store.methods.itemID().call();
    const items = [];
    const owned = [];

    while (numItems < numStoreItems) {
      owned.push(
        drizzle.contracts.Store.methods.getBuyerNumItems(numItems).call()
      );
      items.push(drizzle.contracts.Store.methods.itemInfo(numItems++).call());
    }

    if (items.length) {
      const results = await Promise.all(items);
      const ownedResults = await Promise.all(owned);
      const newItems = results.map((result, index) => {
        return {
          name: result.name,
          imageURL: result.imageURL,
          description: result.description,
          inventory: +result.inventory,
          price: +result.price,
          sales: +result.sales,
          owned: ownedResults[index],
        };
      });
      const currItems = this.state.itemInfo;
      this.setState({
        numItems,
        itemInfo: [...currItems, ...newItems],
        showAddItemForm: false,
      });
    }
  };

  updateItem = async index => {
    const { drizzle } = this.props;
    const result = await drizzle.contracts.Store.methods.itemInfo(index).call();
    const owned = await drizzle.contracts.Store.methods
      .getBuyerNumItems(index)
      .call();
    const itemInfo = this.state.itemInfo;
    const updatedItem = {
      name: result.name,
      imageURL: result.imageURL,
      description: result.description,
      inventory: +result.inventory,
      price: +result.price,
      sales: +result.sales,
      owned,
    };
    itemInfo[index] = updatedItem;
    this.setState({ itemInfo });
  };

  render() {
    console.log(this.state, ' STATE');
    const {
      userAddress,
      storeAddress,
      showAddItemForm,
      numItems,
      itemInfo,
    } = this.state;
    const { drizzle } = this.props;
    return (
      <div>
        <div className="storePageHeader">
          <div>STORE PAGE ({numItems})</div>
          <Label
            as="a"
            onClick={() => this.setState({ showAddItemForm: !showAddItemForm })}
          >
            <Icon name="add" /> Add Item
          </Label>
        </div>
        <h2>{storeAddress}</h2>
        {showAddItemForm ? (
          <AddItemForm
            fetchItems={this.fetchItems}
            drizzle={drizzle}
            userAddress={userAddress}
          />
        ) : (
          ''
        )}
        <Card.Group>
          {itemInfo.map((item, index) => (
            <SingleItem
              key={index}
              item={item}
              itemId={index}
              userAddress={userAddress}
              drizzle={drizzle}
              updateItem={() => this.updateItem(index)}
            />
          ))}
        </Card.Group>
      </div>
    );
  }
}

export default StorePage;
