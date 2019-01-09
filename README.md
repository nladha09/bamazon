# bamazon :department_store:
An Amazon-like storefront with MySQL &amp; node.js

[See video walkthrough here (full screen has better view)](https://drive.google.com/open?id=1X1r3DAO4rzxN8VBrtf6sEplXcDTHj-Hr)

## Customer view - bamazonCustomer.js

>Displays all of the items available for sale
>
>ID of the product they would like to buy
> & how many units of the product they would like to buy
> 
>Once the customer has placed the order, the application checks if the store has enough of the product to meet the customer's request. If not, states "**Insufficient quantity**!" and then prevents the order from going through.

## Manager view - bamazonManager.js

>View Products for Sale - lists every available item & quantities
> 
>View Low Inventory - list all items with an inventory count lower than five
> 
>Add to Inventory - lets the manager "add more" of any item currently in the store
> 
>Add New Product - allows the manager to add a completely new product to the store

## Supervisor view - bamazonSupervisor.js

>Displays Departments table
>
>Displays Product Sales column in products table - when a customer purchases something from the store, the price of the product multiplied by the quantity purchased is added to the product's product_sales column & inventory
>
>View Product Sales by Department
>
>Create New Department 
