# CAFP

Consensys Academy Final Project
This is an online marketplace that operates on the blockchain. Any user can create a store and a created store address is searchable through homepage. An individual can create any number of stores and can add items to his/her own stores and visit each store through their manage stores tab. A User can purchase items from a store if there are enough items in stock and the user has enough currency to purchase it. The balance is transferred directly to the store owner and the owned and inventory count will update accordingly. Live demo can be viewed here: (https://youtu.be/ftT832okwsY)

# More Information

- [Deployed Addresses](https://github.com/MistuhMok/CAFP/blob/master/deployed_addresses.txt 'Deployed and Verified Contract Addresses on Rinkeby')
- [Design Pattern Decisions](https://github.com/MistuhMok/CAFP/blob/master/design_pattern_decisions.md 'Design Pattern Decisions')
- [Avoiding Common Attacks](https://github.com/MistuhMok/CAFP/blob/master/avoiding_common_attacks.md 'Avoiding Common Attacks')

# Installation instructions

1. Navigate to the root directory

2. `npm i` in root directory if you do not have truffle installed globally

3. Navigate to the app directory

4. `npm i` in the app directory

5. Download/open up Ganache (https://www.trufflesuite.com/ganache). This is our local test Ethereum network that we will be deploying our smart contract on.

6. In Ganache:

   - create a new workspace
   - under the server tab, change the port number to 8545 (this is our local testnet port)
   - under the accounts & keys tab, copy the mnemonic key (this is how we generate our ethereum address)
   - save

7. In the root directory, compile and migrate the contracts using command `truffle migrate` (If you do not have truffle installed globally use "./node_modules/.bin/truffle migrate") to deploy the contracts to the local network.

8. Download Metamask extension for your browser and log in to Metamask (https://metamask.io/) dThis is an Ethereum address management tool and our interface with the Ethereum blockchain

9. Enter the Ganache seed account (12 word mnemonic from step 7) into metamask.

10. Change metamask network to localhost 8545. Our test network is deployed to port 8545.

11. Navigate to the app directory and `npm start` to run the front end to interact with the blockchain

# Tests

Tests can be run from the root directory with 'truffle test'
There are 10 tests and they take ~7s

# Checklist

- [x] Record your screen as you demo the application, showing and explaining how you included the required components. (https://youtu.be/ftT832okwsY)

✔️ 1. Project includes a README.md that explains the project

✔️ 2. The project is a Truffle project that allows you to easily compile, migrate and test the provided Solidity contracts

✔️ 3. Project is commented as outline in the documentation

✔️ 4. At least one contract uses a library or inherits from another contract

- Uses SafeMath library and inherits Pausable contract

✔️ 5. I can run the app on a development server locally for testing/grading (or connecting to Rinkeby/Ropsten if required)

✔️ 6. The app displays the current ethereum account

✔️ 7. I can sign transactions using Metamask (or another web3 provider)

✔️ 8. The app interface reflects updates to the contract state

✔️ 9. 5 tests written in Javascript

- [x] Tests are properly structured
- [x] All tests pass

✔️ 10. At least one of the contracts implements a circuit breaker / emergency stop pattern.

- Purchasing items is pausable by the store owner

✔️ 11. Project includes a file called design_pattern_decisions.md that adequately describes the design patterns implemented in the project

✔️ 12. Project includes a file called avoiding_common_attacks.md that explains at least 2 common attacks and how the app mitigates user risk.

✔️ 13. Project includes a file called deployed_addresses.txt that describes where the deployed testnet contracts live (which testnet and address)
