pragma solidity ^0.6.1;
import './Store.sol';

/*
 * @dev Factory contract that deploys individual Store contracts
 */
contract StoreFactory {
    mapping(address => address[]) public deployedStores;

    /*
    * @dev Event when a Store is created
    */
    event LogCreateStore(address indexed creator, address indexed storeAddress);

    /*
    * @dev Create a Store, passes in the creator's address, and stores the store's address in a mapping so that an individual can manage all of the stores that were created by that address
    */
    function createStore() public {
        address newStore = address(new Store(msg.sender));
        deployedStores[msg.sender].push(newStore);
        emit LogCreateStore(msg.sender, newStore);
    }

    /*
    * @dev Fetches all the Stores created by the msg.sender
    * @return Address array of all Stores created by the msg.sender
    */
    function getDeployedStores() public view returns (address[] memory) {
        return deployedStores[msg.sender];
    }
}
