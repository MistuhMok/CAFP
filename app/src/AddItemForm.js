import React, { Component } from 'react';
import { Button, Form, Input } from 'semantic-ui-react';

export default class AddItemForm extends Component {
  constructor() {
    super();
    this.state = {
      currentAddress: '',
      name: '',
      imageURL: '',
      description: '',
      inventory: '',
      price: '',
    };
  }

  async componentDidMount() {
    const currentAddress = await this.props.drizzle.web3.eth.getAccounts();
    this.setState({
      currentAddress: currentAddress[0],
    });
  }

  handleInputChange = event => {
    this.setState(
      {
        [event.target.name]: event.target.value,
      },
      console.log(this.state)
    );
  };

  handleSubmit = async event => {
    event.preventDefault();
    // await this.props.drizzle.contracts.Store.methods
    //   .addItem(
    //     this.state.name,
    //     this.state.imageURL,
    //     this.state.description,
    //     this.state.inventory,
    //     this.state.price
    //   )
    //   .send({ from: this.state.currentAddress });

    console.log(this.props.drizzle.contracts);
  };

  render() {
    const fields = ['name', 'imageURL', 'description', 'inventory', 'price'];
    return (
      <div className="addItemForm">
        <h1>Add Item</h1>
        <Form onSubmit={this.handleSubmit}>
          {fields.map((field, index) => (
            <Input
              key={field}
              name={field}
              value={this.state[`${field}`]}
              placeholder={field.replace(field[0], field[0].toUpperCase())}
              onChange={this.handleInputChange}
              type={index > 2 ? 'number' : 'text'}
            />
          ))}
          <Button type="submit">Submit</Button>
        </Form>
      </div>
    );
  }
}
