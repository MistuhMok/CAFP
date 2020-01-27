pragma solidity ^0.5.0;

contract StoreFactory {
    address[] public deployedStores;
    
    function createStore() public {
        address newStore = address(new Store(msg.sender));
        deployedStores.push(newStore);
    }
    
    function getDeployedStores() public view returns (address[] memory){
        return deployedStores;
    }
}


contract Store {
    address payable public owner;
    uint itemID;
    mapping(uint => Item) public items;
    
    struct Item {
        string name;
        string imageURL;
        string description;
        uint inventory;
        uint price;
        uint sales;
        bool forSale;
        mapping(address => uint) buyers;
    }
    
    event LogItemAdded(string name, string img, string description, uint inventory, uint price, uint itemID);
    event LogItemBought(address buyer, uint itemID, uint numItems);
    event LogEndSale(address owner, uint balance, uint eventId);
    
    constructor(address payable creator) public {
        owner = creator;
    }
    
    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }
    
    function addItem(
        string memory name,
        string memory imageURL,
        string memory description,
        uint inventory,
        uint price
    ) public onlyOwner returns (uint itemID){
        
        items[itemID] = Item({
            name: name,
            imageURL: imageURL,
            description: description,
            inventory: inventory,
            price: price,
            sales: 0,
            forSale: true
        });
        
        emit LogItemAdded(name, imageURL, description, inventory, price, itemID);
        return itemID++;
    }
    
    function itemInfo(uint itemId) public view returns (
        string memory name,
        string memory imageURL,
        string memory description,
        uint inventory,
        uint price,
        uint sales,
        bool forSale
        ) {
            return (
                items[itemId].name,
                items[itemId].imageURL,
                items[itemId].description,
                items[itemId].inventory,
                items[itemId].price,
                items[itemId].sales,
                items[itemId].forSale
                );
    }
    
    function buyItems(uint itemId, uint numItems) public payable {
        require(items[itemId].forSale == true, 'This item is not for sale!');
        require(msg.value >= numItems * items[itemId].price, "Not enough funding");
        require(items[itemId].inventory - items[itemId].sales >= numItems, 'Not enough inventory remaining');
        
        items[itemId].buyers[msg.sender] += numItems;
        items[itemId].sales += numItems;
        
    }
}
