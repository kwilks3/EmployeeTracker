DROP DATABASE IF EXISTS employee_info; 

CREATE DATABASE employee_info; 

USE employee_info; 

CREATE TABLE employee(
    id INT PRIMARY KEY AUTO_INCREMENT, 
    first_name VARCHAR(30) NOT NULL, 
    last_name VARCHAR(30) NOT NULL, 
    role_id INT, 
    manager_id INT NULL 
); 

CREATE TABLE role (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    title VARCHAR(30) NOT NULL, 
    department_id INT
);

CREATE TABLE department( 
    id INT AUTO_INCREMENT PRIMARY KEY, 
    name VARCHAR(30)
)