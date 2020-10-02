const inquirer = require('inquirer');
const mysql = require('mysql');
const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'password',
    database : 'greatBay_DB'
});
connection.connect(err => {
    if(err) throw err;
    start();
});

const start = () => {
  inquirer.prompt({
    name: "initial",
    message: "What would you like to do?",
    type: "list",
    choices: ["View all employees", "View all employees by department", "View all employees by manager", "Add employee", "Remove employee", "Update employee role", "Update employee manager"]
  }).then(answer => {
    switch(answer.initial){
      case "View all employees":
        allEmployees();
        break;
      case "View all employees by department":
        employeesByDep();
        break;
      case "View all employees by manager":
        employeesByMan();
        break;
      case "Add employee":
        addEmployee();
        break;
      case "Remove employee":
        removeEmployee();
        break;
      case "Update employee role":
        updateEmployeeRole();
        break;
      case "Update employee manager":
        updateEmployeeManager();
        break;
    }
  })
}
