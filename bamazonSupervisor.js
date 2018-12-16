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
    'View Product Sales by Department': () => { showDeptSales() },
    'Create New Department': () => { createDept() },
    'Exit': () => { connection.end(); }
}

connection.connect();

function menuOptions() {
    console.log("");
    inquirer.prompt([{
        name: "menu",
        message: "Please Select Option:",
        type: "list",
        choices: [
            'View Product Sales by Department',
            'Create New Department',
            'Exit'
        ]
    }]).then(function(answers) {
        // runs the selected function
        options[answers.menu]();
    })
}

function showDeptSales() {

    connection.query(`SELECT departments.department_id AS 'Department ID', 
                        departments.department_name AS 'Department Name', 
                        departments.over_head_cost as 'Overhead Costs', 
                        SUM(products.product_sales) AS 'Product Sales', 
                        (SUM(products.product_sales) - departments.over_head_cost) AS 'Total Profit'  
                        FROM departments
                        LEFT JOIN products on products.department_name=departments.department_name
                        GROUP BY departments.department_name, departments.department_id, departments.over_head_cost
                        ORDER BY departments.department_id ASC`, function(error, results) {
        if (error) throw error;
        console.log(`\n------------------------------------------------------------------------------------\n`.yellow);
        console.log(columnify(results, { columns: ["Department ID", "Department Name", "Overhead Costs", "Product Sales", "Total Profit"] }));
        console.log(`\n------------------------------------------------------------------------------------\n`.yellow);

        menuOptions();
    })
};

function createDept() {
    inquirer.prompt([{
        name: "new_dept",
        message: "What is the Name of the new Department?",
        type: "input",
        validate: (value) => {
            if (value.length < 1) {
                return "Please enter a Product";
            } else {
                return true;
            }
        }
    }, {
        name: "new_overhead",
        message: "What is this departments overhead costs",
        type: "input",
        validate: (value) => {
            var valid = !isNaN(parseFloat(value));
            return valid || 'Please enter a number'
        }
    }]).then(function(answers) {
        connection.query(`INSERT INTO departments (department_name, over_head_cost) VALUES ("${answers.new_dept}", ${answers.new_overhead})`, function(error, results) {})
        console.log(`\n- - - - - - - - -\n`.green);
        console.log(`Department Added Successfully!`);
        console.log(`\n- - - - - - - - -\n`.green);
        menuOptions();
    })
}

menuOptions();