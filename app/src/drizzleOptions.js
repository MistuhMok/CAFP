import StoreFactory from './contracts/StoreFactory.json';
const options = {
  contracts: [StoreFactory],
  events: {
    StoreFactory: ['LogCreateStore'],
  },
};

export default options;
