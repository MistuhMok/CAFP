pragma solidity ^0.6.1;
import './Store.sol';

contract StoreFactory {
    address[] public deployedStores;
    mapping(address => bool) public storeOwners;

    function createStore() public {
        address newStore = address(new Store(msg.sender));
        deployedStores.push(newStore);
        storeOwners[msg.sender] = true;
    }

    function getDeployedStores() public view returns (address[] memory) {
        return deployedStores;
    }
}
