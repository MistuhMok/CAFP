pragma solidity ^0.6.1;
import './SafeMath.sol';

contract StoreFactory {
    address[] public deployedStores;

    function createStore() public {
        address newStore = address(new Store(msg.sender));
        deployedStores.push(newStore);
    }

    function getDeployedStores() public view returns (address[] memory) {
        return deployedStores;
    }
}

contract Store {
    address payable public owner;
    uint256 itemID;
    mapping(uint256 => Item) public items;

    struct Item {
        string name;
        string imageURL;
        string description;
        uint256 inventory;
        uint256 price;
        uint256 sales;
        mapping(address => uint256) buyers;
    }

    event LogItemAdded(
        string name,
        string imageURL,
        string description,
        uint256 inventory,
        uint256 price,
        uint256 itemID
    );
    event LogItemBought(address buyer, uint256 itemID, uint256 numItems);
    event LogEndSale(address owner, uint256 balance, uint256 eventId);

    constructor(address payable creator) public {
        owner = creator;
    }

    modifier onlyOwner {
        require(msg.sender == owner, 'You are not the owner of the store!');
        _;
    }

    function addItem(
        string memory name,
        string memory imageURL,
        string memory description,
        uint256 inventory,
        uint256 price
    ) public onlyOwner returns (uint256 itemId) {
        items[itemID] = Item({
            name: name,
            imageURL: imageURL,
            description: description,
            inventory: inventory,
            price: price,
            sales: 0
        });

        emit LogItemAdded(
            name,
            imageURL,
            description,
            inventory,
            price,
            itemID
        );
        return itemID++;
    }

    function itemInfo(uint256 itemId)
        public
        view
        returns (
            string memory name,
            string memory imageURL,
            string memory description,
            uint256 inventory,
            uint256 price,
            uint256 sales
        )
    {
        return (
            items[itemId].name,
            items[itemId].imageURL,
            items[itemId].description,
            items[itemId].inventory,
            items[itemId].price,
            items[itemId].sales
        );
    }

    function buyItems(uint256 itemId, uint256 numItems) public payable {
        require(
            msg.value >= SafeMath.mul(numItems, items[itemId].price),
            'Not enough funding'
        );
        require(
            SafeMath.sub(items[itemId].inventory, items[itemId].sales) >=
                numItems,
            'Not enough inventory remaining'
        );
        emit LogItemBought(msg.sender, itemId, numItems);

        items[itemId].buyers[msg.sender] = SafeMath.add(
            items[itemId].buyers[msg.sender],
            numItems
        );
        items[itemId].sales = SafeMath.add(numItems, items[itemId].sales);
    }

    function getBuyerNumItems(uint256 itemId)
        public
        view
        returns (uint256 itemsPurchased)
    {
        return items[itemId].buyers[msg.sender];
    }
}
