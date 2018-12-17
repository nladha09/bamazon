var mysql = require('mysql');
var inquirer = require('inquirer');
var keys = require('./keys');
var colors = require('colors');
var columnify = require('columnify');
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon"
});
var options = {
    'View Products for Sale': () => { showInventory() },
    'View Low Inventory': () => { lowInventory() },
    'Add to Inventory': () => { addInventory() },
    'Add New Product': () => { addProduct() },
    'Exit': () => { connection.end(); }
}

// empty arrays for global storage of current catalog
var product_catalog = [];
var product_catalog_names = [];

connection.connect();

function menuOptions() {
    inquirer.prompt([{
        name: "menu",
        message: "Please Select Option:",
        type: "list",
        choices: [
            'View Products for Sale',
            'View Low Inventory',
            'Add to Inventory',
            'Add New Product',
            'Exit'
        ]
    }]).then(function(answers) {
        // runs the function for option selected
        options[answers.menu]();
    })
}

function showInventory() {

    connection.query('SELECT * FROM products', function(error, results) {
        if (error) throw error;
        console.log(`------------------------------------------------------------------------------------`.yellow);
        console.log(columnify(results, { columns: ['item_id', 'product_name', 'department_name', 'price', 'stock_quantity'] }))
        console.log(`------------------------------------------------------------------------------------`.yellow);

        // removes RowDataPacket Constructor label
        var newResults = JSON.parse(JSON.stringify(results));

        // store data in new arrays for catalog selection
        newResults.forEach((element) => {
            product_catalog_names.push(element.product_name);
        }, this);
        newResults.forEach((element) => {
            product_catalog.push(element);
        }, this);
        menuOptions();
    });
}

function lowInventory() {

    connection.query('SELECT * FROM products WHERE stock_quantity < 5', function(error, results) {
        if (error) throw error;
        console.log(`\n------------------------------------------------------------------------------------\n`.red);
        console.log(columnify(results, { columns: ['item_id', 'product_name', 'department_name', 'price', 'stock_quantity'] }))
        console.log(`\n------------------------------------------------------------------------------------\n`.red);
        menuOptions();
    });
}

function addInventory() {
    connection.query('SELECT * FROM products', function(error, results) {
        if (error) throw error;
        var newResults = JSON.parse(JSON.stringify(results));

        // store data in new arrays for catalog selection
        newResults.forEach((element) => {
            product_catalog_names.push(element.product_name);
        }, this);
        newResults.forEach((element) => {
            product_catalog.push(element);
        }, this);

        inquirer.prompt([{
            name: "chosenProduct",
            message: "Which Product Would You Like to add Inventory?",
            type: "list",
            choices: product_catalog_names
        }, {
            name: "chosenAmount",
            message: "How many units to add?",
            type: "input",
            validate: (value) => {
                var valid = !isNaN(parseFloat(value));
                return valid || 'Please enter a number'
            }
        }]).then(function(answers) {
            var indexOfProduct = product_catalog_names.indexOf(answers.chosenProduct);
            var newQuantity = parseFloat(product_catalog[indexOfProduct].stock_quantity) + parseFloat(answers.chosenAmount);
            connection.query(`UPDATE products SET stock_quantity = ${newQuantity} WHERE item_id = ${indexOfProduct + 1}`, function(error, results) {})
            console.log(`\n- - - - - - - - - -\n`.green);
            console.log(`Inventory Updated!`);
            console.log(`There are now: ${newQuantity} ${answers.chosenProduct}'s in stock`);
            console.log(`\n- - - - - - - - - -\n`.green);
            menuOptions()
        });
    })
}

function addProduct() {
    var product_catalog_dept = [];
    connection.query('SELECT department_name FROM departments GROUP BY department_name', function(error, results) {
        if (error) throw error;

        results.forEach((element) => {
            product_catalog_dept.push(element.department_name);
        }, this);
    });

    connection.query('SELECT * FROM products', function(error, results) {
        if (error) throw error;
        var newResults = JSON.parse(JSON.stringify(results));

        // store data in new arrays for catalog selection
        newResults.forEach((element) => {
            product_catalog.push(element);
        }, this);

        inquirer.prompt([{
            name: "new_name",
            message: "What is the Name of the Product?",
            type: "input",
            validate: (value) => {
                if (value.length < 1) {
                    return "Please enter a Product";
                } else {
                    return true;
                }
            }
        }, {
            name: "department",
            message: "What Department will This Product be in?",
            type: "list",
            choices: ["Games", "Cars", "Instruments"]
        }, {
            name: "new_price",
            message: "What will be the Retail Price?",
            type: "input",
            validate: (value) => {
                var valid = !isNaN(parseFloat(value));
                return valid || 'Please enter a number'
            }
        }, {
            name: "new_stock",
            message: "How Many Units to add?",
            type: "input",
            validate: (value) => {
                var valid = !isNaN(parseFloat(value));
                return valid || 'Please enter a number'
            }
        }]).then(function(answers) {
            connection.query(`INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ("${answers.new_name}", "${answers.department}", ${answers.new_price}, ${answers.new_stock})`, function(error, results) {})
            console.log(`\n- - - - - - - - -\n`.green);
            console.log(`Product Added Successfully!`);
            console.log(`\n- - - - - - - - -\n`.green);
            menuOptions()
        })
    })
}

menuOptions();