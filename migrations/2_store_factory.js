const StoreFactory = artifacts.require('StoreFactory');

module.exports = function(deployer) {
  deployer.deploy(StoreFactory);
};
