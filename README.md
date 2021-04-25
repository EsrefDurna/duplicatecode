# Duplicate Code finder!

This is a cli tool. Which you can find longest repeated codes blocks in your source code.
-c Contains with argument is required for the algorithm to work efficiently.

#How to use

* $ npm i -g duplicatecode

* $ duplicatecode -f ./src -s function -c 

* $ duplicatecode -f ./node_modules -s private

 This algorithm is focused on speed, and able to scan even your node_modules folder and find duplicate codes.

The algorithm lists the longest repeated code block.