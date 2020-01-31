pragma solidity ^0.6.1;

import './SafeMath.sol';
import './Pausable.sol';

/*
* @dev The Store contract keeps track of the details and sales of all the items in the store
*/
contract Store is Pausable {
    /*
    * @dev Variables to keep track of the itemIDs and store all the item info
    */
    uint256 public itemID;
    mapping(uint256 => Item) public items;

    /*
    * @dev Store struct stores Item details and keeps track amount sold and who a mapping of who bought it
    */
    struct Item {
        string name;
        string imageURL;
        string description;
        uint256 inventory;
        uint256 price;
        uint256 sales;
        mapping(address => uint256) buyers;
    }

    /*
    * @dev Logging events provide information about the status of the function
    *   LogItemAdded provides information of an item that was just added
    *   LogItemBought provides information about the buyer and the amount purchased
    */
    event LogItemAdded(
        string name,
        string imageURL,
        string description,
        uint256 inventory,
        uint256 price,
        uint256 itemID
    );
    event LogItemBought(address buyer, uint256 itemID, uint256 numItems);

    //Passes the address of the creator to the Pausable contract
    constructor(address payable creator) public Pausable(creator) {}

    /*
    * @dev Adds item to the store and can only be run by the store owner
    * @param Name of the item
    * @param URL of an image of the item
    * @param Description of the item
    * @param Amount of the item that is stocked
    * @param Price of the item
    */
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

    /*
    * @dev Fetch item info
    * @param ID of the item
    * @return The item info
    */
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

    /*
    * @dev Buys an Item and sends the money directly to the store owner
    * @param ID of the item
    * @param Amount of items to be bought
    */
    function buyItems(uint256 itemId, uint256 numItems)
        public
        payable
        whenNotPaused
    {
        require(
            msg.value >= SafeMath.mul(numItems, items[itemId].price),
            'Not enough funding'
        );
        require(
            SafeMath.sub(items[itemId].inventory, items[itemId].sales) >=
                numItems,
            'Not enough inventory remaining'
        );

        items[itemId].buyers[msg.sender] = SafeMath.add(
            items[itemId].buyers[msg.sender],
            numItems
        );
        items[itemId].sales = SafeMath.add(numItems, items[itemId].sales);
        emit LogItemBought(msg.sender, itemId, numItems);
    }

    /*
    * @dev Fetch how many of a particular item was bought
    * @param ID of the item
    * @return The amount of item owned by the msg.sender
    */
    function getBuyerNumItems(uint256 itemId)
        public
        view
        returns (uint256 itemsPurchased)
    {
        return items[itemId].buyers[msg.sender];
    }
}
