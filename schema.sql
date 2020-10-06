DROP DATABASE IF EXISTS employeeTracker_db;

CREATE DATABASE employeeTracker_db;

USE employeeTracker_db;

CREATE TABLE department (
  id INT AUTO_INCREMENT,
  name VARCHAR(30),
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
  FOREIGN KEY (manager_id) REFERENCES employee(id)

);

INSERT INTO department(id, name) 
VALUES (1,"Finance"),
       (2, "HR"),
       (3, "Marketing")
       (4, "IT"),
       (5, "Management");
       

INSERT INTO employee_role (id, title, salary, department_id)
VALUES (1, "Accountant", 80000, 1),
       (2, "Financial Analyst", 80000, 1),
       (3, "HR Assistant", 40000, 2),
       (4, "Recruiter", 60000, 2),
       (5, "Social Media", 50000, 3),
       (6, "Marketing Assistant", 45000, 3),
       (7, "Senior Engineer", 90000, 4),
       (8, "Junior Developer", 60000, 4)
       (9, "Manager", 150000, 5);

      