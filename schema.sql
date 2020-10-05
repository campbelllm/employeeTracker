DROP DATABASE IF EXISTS employeeTracker_db;

CREATE DATABASE employeeTracker_db;

USE employeeTracker_db;

CREATE TABLE department (
  id INT AUTO_INCREMENT,
  name VARCHAR(30),
  PRIMARY KEY (id)
);

CREATE TABLE manager (
  id INT AUTO_INCREMENT,
  manager VARCHAR(30),
  PRIMARY KEY (id)
);

CREATE TABLE employee_role (
  id INT AUTO_INCREMENT,
  title VARCHAR(30),
  salary DECIMAL,
  department_id INT,
  PRIMARY KEY (id),
  FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE employee (
  id INT AUTO_INCREMENT,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  role_id INT,
  manager_id INT, 
  PRIMARY KEY (id),
  FOREIGN KEY (role_id) REFERENCES employee_role(id),
  FOREIGN KEY (manager_id) REFERENCES manager(id)

);

INSERT INTO employee (first_name, last_name)
VALUES ()