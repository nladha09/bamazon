DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

DROP TABLE IF EXISTS products; 

CREATE TABLE products (
item_id INTEGER(10) AUTO_INCREMENT NOT NULL PRIMARY KEY UNIQUE,
product_name VARCHAR(100) NOT NULL,
department_name VARCHAR(100) NOT NULL,
price DECIMAL(10,2) NOT NULL,
stock_quantity INTEGER(5) NOT NULL
);

SELECT * FROM products;

INSERT INTO products (product_name, department_name, price, stock_quantity)
	VALUES ("Red Dead Redemption II", "Games", 69.99, 50),
  ("Destiny 2", "Games", 38.99, 40),
  ("The Witcher 3", "Games", 99.99, 10),
  ("Lexus", "Cars", 2999.00, 30),
  ("Toyota", "Cars", 1999.00, 10),
  ("BMW", "Cars", 3999.00, 20),
  ("Guitar", "Instruments", 123.45, 20),
  ("Flute", "Instruments", 678.90, 20),
  ("Mandolin", "Instruments", .25, 20);

  SELECT * FROM products;

ALTER TABLE products ADD product_sales DECIMAL(10,2) NOT NULL;

DROP TABLE IF EXISTS departments; 

CREATE TABLE departments (
department_id INTEGER(10) AUTO_INCREMENT NOT NULL PRIMARY KEY UNIQUE,
department_name VARCHAR(100) NOT NULL,
over_head_cost DECIMAL(10,2) NOT NULL
); 

SELECT * FROM departments;

INSERT INTO departments (department_name, over_head_cost)
	VALUES ("Games", 2000), ("Cars", 1000), ("Instruments", 800);

SELECT departments.department_name, departments.over_head_cost, products.product_sales
FROM departments
INNER JOIN products
ON departments.department_name = products.department_name;

SELECT department_name AS 'Department', SUM(departments.over_head_cost) AS 'Overhead Cost', SUM(products.product_sales) AS 'Total Sales' 
FROM departments
INNER JOIN `departments` on products.department_name=departments.department_name
GROUP BY departments.department_name;

SELECT department_name AS 'Department', SUM(departments.over_head_cost) AS 'Overhead Cost' FROM departments GROUP BY departments.department_name;	

SELECT department_name AS 'Department', SUM(products.product_sales) AS 'Total Sales' FROM products GROUP BY products.department_name;