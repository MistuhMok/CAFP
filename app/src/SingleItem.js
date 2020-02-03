import React, { Component } from 'react';
import { Button, Card, Image, Input, Form } from 'semantic-ui-react';

export default class SingleItem extends Component {
  state = { numItems: '', userAddress: this.props.userAddress };

  handleInputChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = async event => {
    event.preventDefault();
    const { numItems, userAddress } = this.state;
    const { drizzle, itemId, item } = this.props;
    await drizzle.contracts.Store.methods
      .buyItems(itemId, numItems)
      .send({ from: userAddress, value: item.price * numItems });

    this.props.updateItem();
    this.setState({ numItems: '' });
  };
  render() {
    const {
      name,
      imageURL,
      description,
      inventory,
      sales,
      price,
      owned,
    } = this.props.item;

    console.log(owned, this.state.userAddress);
    return (
      <Card>
        <Card.Content>
          <Image floated="right" size="mini" src={imageURL} />
          <Card.Header>{name}</Card.Header>
          <Card.Meta>
            Stock: {inventory - sales} Owned: {owned} Price: {price}
          </Card.Meta>
          <Card.Description>{description}</Card.Description>
        </Card.Content>
        <Card.Content extra>
          <div>
            <Form onSubmit={this.handleSubmit}>
              <Button as="div" labelPosition="left">
                <Input
                  size="mini"
                  name="numItems"
                  value={this.state.numItems}
                  placeholder="Amount"
                  type="number"
                  onChange={this.handleInputChange}
                />
                <Button basic color="green" type="submit">
                  Purchase
                </Button>
              </Button>
            </Form>
          </div>
        </Card.Content>
      </Card>
    );
  }
}
