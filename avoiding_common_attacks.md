#Common attacks

DoS with Block Gas Limit
Looping over an array of undetermined size opens the possibility of a DoS attack and this was mitigated in the Store contract by using a mapping with a uint pointer to create new itemId's in a store. The mapping allows constant lookup time and removes the usage of any loops.

Integer Overflow
An integer overlow could happen when an mathematical operation reaches the maximum size of that type therefore the SafeMath library is utilized as an additional precaution to ensure that the number that is returned is greater than or equal to the input.
