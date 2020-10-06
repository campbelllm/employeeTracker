USE employeeTracker_db;

INSERT INTO department(id, name) 
VALUES (1,"Finance"),
       (2, "HR"),
       (3, "Marketing");

INSERT INTO employee_role (id, title, salary, department_id)
VALUES (1, "Accountant", 60000, 1);