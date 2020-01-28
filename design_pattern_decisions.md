I chose to create a Factory contract to deploy each store so that the individual would have to manage and handle the costs of their own store and would not require approval to create a store. An individual would have to deploy and stock their store with items of their choosing. The items are saved as state contract variable because it is important to constantly have up to date information on the number of sales vs the number in the initial inventory to prevent overselling. The factory contract uses an array to store all the addresses of the deployed contracts and a mapping to store all addresses that have deployed at least one store. The store also has a pausable feature to prevent people from buying at the owner's discretion.