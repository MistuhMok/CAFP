pragma solidity ^0.5.0;

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
    }
    
    event LogItemAdded(string name, string img, string description, uint inventory, uint price, uint itemID);
    event LogItemBought(address buyer, uint itemID, uint numItems);
    event LogEndSale(address owner, uint balance, uint eventId);
    
    constructor() public {
        owner = msg.sender;
    }
    
    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }
    
    function addItem (
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
}
