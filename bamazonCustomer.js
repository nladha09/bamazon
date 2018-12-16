var mysql = require('mysql');
var inquirer = require('inquirer');
var keys = require('./keys');
var colors = require('colors');
var columnify = require('columnify');
var connection = mysql.createConnection({
    host: keys.host,
    user: keys.user,
    password: keys.password,
    database: keys.database
});

function showInventory() {
    var product_catalog = [];
    var product_catalog_names = [];
    // only display items in stock
    connection.query('SELECT * FROM products WHERE stock_quantity != 0', function (error, results) {
        if (error) throw error;
        console.log(`------------------------------------------------------------------------------------`.yellow);
        console.log(columnify(results, {
            columns: ['item_id', 'product_name', 'department_name', 'price', 'stock_quantity']
        }))
        console.log(`------------------------------------------------------------------------------------`.yellow);

        // removes RowDataPacket 
        var newResults = JSON.parse(JSON.stringify(results));

        // store data in new arrays for catalog selection
        newResults.forEach((element) => {
            product_catalog_names.push(element.product_name);
        }, this);
        newResults.forEach((element) => {
            product_catalog.push(element);
        }, this);

        purchase(product_catalog, product_catalog_names);
    });
}

function purchase(product_catalog, product_catalog_names) {
    console.log("");
    inquirer.prompt([{
            name: "purchase_id",
            message: "Which product would you like to purchase?",
            type: "list",
            choices: product_catalog_names,

        },
        {
            name: "purchase_amount",
            message: "How many units would you like to purchase?",
            type: "input",
            validate: (value) => {
                var valid = !isNaN(parseFloat(value));
                return valid || 'Please enter a number'
            }
        }
    ]).then(function (answers) {
        // refrences id of chosen product
        var chosen_id = product_catalog_names.indexOf(answers.purchase_id) + 1;

        // stores product selected by user to edit db
        var chosen_product = product_catalog[chosen_id - 1];

        // validate if product is in stock
        if (chosen_product.stock_quantity < answers.purchase_amount) {
            console.log(`\n - - - - -  - - - - - - - - - - - - - - - - - - \n`.red);
            console.log('Insufficient quantity!'.red);
            console.log(`\n - - - - -  - - - - - - - - - - - - - - - - - - \n`.red);

            purchase(product_catalog, product_catalog_names);
        } else {
            // store current stock amount
            var current_quantity = chosen_product.stock_quantity - answers.purchase_amount;
            var totalSale = Math.round(answers.purchase_amount * chosen_product.price);
            var increaseSales = Math.round(chosen_product.product_sales) + totalSale;
            // update db of stock quantity
            connection.query(`UPDATE products SET stock_quantity=${current_quantity}, product_sales=${increaseSales} WHERE item_id = ${chosen_id}`, function (error, results) {
                console.log(`\n - - - - -  - - - - - - - - - - - - - - - - - - \n`.green);
                console.log(`Items Purchased:\n`);
                console.log(`${chosen_product.product_name} = ${chosen_product.price} x ${answers.purchase_amount}`);
                console.log(`Your total will be: $${chosen_product.price * answers.purchase_amount}\n`);
                console.log(`\n - - - - -  - - - - - - - - - - - - - - - - - - \n`.green);

                showInventory();
            })
        }
    });
}

showInventory();