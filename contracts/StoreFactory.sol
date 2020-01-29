pragma solidity ^0.6.1;
import './Store.sol';

contract StoreFactory {
    mapping(address => address[]) public deployedStores;

    event LogCreateStore(address indexed creator, address indexed storeAddress);

    function createStore() public {
        address newStore = address(new Store(msg.sender));
        deployedStores[msg.sender].push(newStore);
        emit LogCreateStore(msg.sender, newStore);
    }

    function getDeployedStores() public view returns (address[] memory) {
        return deployedStores[msg.sender];
    }
}
