var StoreFactory = artifacts.require('StoreFactory');
var Store = artifacts.require('Store');
let catchRevert = require('./exceptionsHelpers.js').catchRevert;
const BN = web3.utils.BN;

contract('Store', function(accounts) {
  const deployAccount = accounts[0];
  const firstAccount = accounts[3];
  const secondAccount = accounts[4];

  const item1 = {
    name: 'item1',
    imageURL: 'URL 1',
    description: 'item1 description',
    inventory: 100,
    price: 100,
  };

  const item2 = {
    name: 'item2',
    imageURL: 'URL 2',
    description: 'item2 description',
    inventory: 200,
    price: 200,
  };

  const item3 = {
    name: 'item3',
    imageURL: 'URL 3',
    description: 'item3 description',
    inventory: 300,
    price: 300,
  };

  let address0;
  let storeInstance;
  beforeEach(async () => {
    sfInstance = await StoreFactory.new();
    await sfInstance.createStore({ from: deployAccount });
    address0 = await sfInstance.deployedStores(deployAccount, 0);

    storeInstance = await Store.at(address0);
  });

  describe('Setup', async () => {
    it('Checks if getDeployedStores function is fetching the same addresses in the mapping', async () => {
      await sfInstance.createStore({ from: deployAccount });
      await sfInstance.createStore({ from: deployAccount });

      const address1 = await sfInstance.deployedStores(deployAccount, 1);
      const address2 = await sfInstance.deployedStores(deployAccount, 2);
      const deployedStores = await sfInstance.getDeployedStores({
        from: deployAccount,
      });

      assert.equal(
        address0,
        deployedStores[0],
        'the deployed 0th address should match'
      );
      assert.equal(
        address1,
        deployedStores[1],
        'the deployed 1st address should match'
      );
      assert.equal(
        address2,
        deployedStores[2],
        'the deployed 2nd address should match'
      );
    });
    it('Owner should be set to the deploying user address', async () => {
      const storeOwner = await storeInstance.owner();

      assert.equal(
        storeOwner,
        deployAccount,
        'the deploying address should be the user address instead of the contract address'
      );
    });
  });

  describe('Functions', () => {
    describe('addItem()', async () => {
      it('only the owner should be able to add an item', async () => {
        await storeInstance.addItem(
          item1.name,
          item1.imageURL,
          item1.description,
          item1.inventory,
          item1.price,
          { from: deployAccount }
        );

        await catchRevert(
          storeInstance.addItem(
            item1.name,
            item1.imageURL,
            item1.description,
            item1.inventory,
            item1.price,
            {
              from: firstAccount,
            }
          )
        );
      });

      it('adding an item should emit an event with the provided item details', async () => {
        const tx = await storeInstance.addItem(
          item2.name,
          item2.imageURL,
          item2.description,
          item2.inventory,
          item2.price,
          { from: deployAccount }
        );
        const itemData = tx.logs[0].args;
        assert.equal(
          itemData.name,
          item2.name,
          'the added item names should match'
        );
        assert.equal(
          itemData.imageURL,
          item2.imageURL,
          'the added item imageUrls should match'
        );
        assert.equal(
          itemData.description,
          item2.description,
          'the added item descriptions should match'
        );
        assert.equal(
          BN(itemData.inventory),
          item2.inventory,
          'the added item inventory amounts should match'
        );
        assert.equal(
          BN(itemData.price),
          item2.price,
          'the added item inventory prices should match'
        );
      });
    });

    describe('itemInfo()', async () => {
      it('providing the item Id should return the correct item details', async () => {
        await storeInstance.addItem(
          item3.name,
          item3.imageURL,
          item3.description,
          item3.inventory,
          item3.price,
          { from: deployAccount }
        );
        const itemDetails = await storeInstance.itemInfo(0);
        assert.equal(
          itemDetails.name,
          item3.name,
          'the added item names should match'
        );
        assert.equal(
          itemDetails.imageURL,
          item3.imageURL,
          'the added item imageUrls should match'
        );
        assert.equal(
          itemDetails.description,
          item3.description,
          'the added item descriptions should match'
        );
        assert.equal(
          BN(itemDetails.inventory),
          item3.inventory,
          'the added item inventory amounts should match'
        );
        assert.equal(
          BN(itemDetails.price),
          item3.price,
          'the added item inventory prices should match'
        );

        assert.equal(BN(itemDetails.sales), 0, 'the item sales should be 0');
      });
    });

    describe('buyItems()', async () => {
      it('items should only be able to be purchased when the item exists', async () => {
        const numberOfItems = 1;
        const itemCost = item1.price * numberOfItems;

        // item with id 1 does not exist yet
        await catchRevert(
          storeInstance.buyItems(1, numberOfItems, {
            from: firstAccount,
            value: itemCost,
          })
        );

        await storeInstance.addItem(
          item1.name,
          item1.imageURL,
          item1.description,
          item1.inventory,
          item1.price,
          { from: deployAccount }
        );
        await storeInstance.buyItems(0, numberOfItems, {
          from: firstAccount,
          value: itemCost,
        });

        const itemDetails = await storeInstance.itemInfo(0);

        assert.equal(
          BN(itemDetails.sales),
          numberOfItems,
          `the item's sales should be ${numberOfItems}`
        );
      });

      it('items should only be able to be purchased when enough value is sent with the transaction', async () => {
        const numberOfItems = 1;
        const itemCost = item1.price * numberOfItems;

        await storeInstance.addItem(
          item1.name,
          item1.imageURL,
          item1.description,
          item1.inventory,
          item1.price,
          { from: deployAccount }
        );
        await catchRevert(
          storeInstance.buyItems(0, numberOfItems, {
            from: firstAccount,
            value: itemCost - 1,
          })
        );
      });

      it('items should only be able to be purchased when there are enough items remaining', async () => {
        const numberOfItems = item1.inventory;
        const itemCost = item1.price * numberOfItems;

        await storeInstance.addItem(
          item1.name,
          item1.imageURL,
          item1.description,
          item1.inventory,
          item1.price,
          { from: deployAccount }
        );
        await storeInstance.buyItems(0, numberOfItems, {
          from: firstAccount,
          value: itemCost,
        });
        await catchRevert(
          storeInstance.buyItems(0, numberOfItems, {
            from: secondAccount,
            value: itemCost,
          })
        );
      });

      it('a LogBuyItems() event with the correct details should be emitted when items are purchased', async () => {
        const numberOfItems = 1;
        const itemCost = item1.price * numberOfItems;

        await storeInstance.addItem(
          item1.name,
          item1.imageURL,
          item1.description,
          item1.inventory,
          item1.price,
          { from: deployAccount }
        );
        const tx = await storeInstance.buyItems(0, numberOfItems, {
          from: firstAccount,
          value: itemCost,
        });
        const eventData = tx.logs[0].args;

        assert.equal(
          eventData.buyer,
          firstAccount,
          'the buyer account should be the msg.sender'
        );

        assert.equal(
          BN(eventData.itemID),
          0,
          'the event should have the correct itemId'
        );
        assert.equal(
          eventData.numItems,
          numberOfItems,
          'the event should have the correct number of items purchased'
        );
      });
    });

    describe('getBuyerNumItems()', async () => {
      it('providing an item id to getBuyerNumItems() should tell an account how many of that item was purchased', async () => {
        const numberToPurchase = 3;

        await storeInstance.addItem(
          item2.name,
          item2.imageURL,
          item2.description,
          item2.inventory,
          item2.price,
          { from: deployAccount }
        );
        await storeInstance.buyItems(0, numberToPurchase, {
          from: secondAccount,
          value: item2.price * numberToPurchase,
        });
        let result = await storeInstance.getBuyerNumItems(0, {
          from: secondAccount,
        });

        assert.equal(
          result,
          numberToPurchase,
          'getBuyerNumItems() should return the number of items the msg.sender has purchased.'
        );
      });
    });
  });
});
