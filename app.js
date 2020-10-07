const inquirer = require('inquirer');
const mysql = require('mysql');
const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'password',
    database : 'employeeTracker_db'
});
connection.connect(err => {
    if(err) throw err;
    start();
});

const queryJoin = "SELECT id FROM employee"

const allEmployees = () => {
  const query = "SELECT * FROM employee";
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    start();
  })
};


// function to grab roles from table to be used as choices in CLI when creating employee
const employeeRoleChoice = () => {
  const query = "SELECT title FROM employee_role";
  let array= [];
  connection.query(query, (err, res) => {
    if (err) throw err;
    res.forEach(title => array.push(title.title))
  })
  return array;
};

//function for grabbing all employee names 

const employeeList = () => {
  let nameArray = [];
  const query = "SELECT first_name, last_name FROM employee";
  connection.query(query, (err, res) => {
    if (err) throw err;
    res.forEach(name => nameArray.push(name.first_name + " " + name.last_name))
  });
  return nameArray;
};



const employeesByDep = () =>{
  const query = "SELECT"
};

const employeesByMan = () => {

};

const addEmployee = () => {
  inquirer.prompt([
    {
      name: 'firstName',
      type: "input",
      message: "What is the employees first name?"
    },
    {
      name: "lastName",
      type: "input",
      message: "What is the employees last name?"
    },
    {
      name:"employeeRole",
      pageSize: 15,
      type: "list",
      message: "What is the employees role?",
      choices: employeeRoleChoice()
    },
    {
      name: "employeeManager",
      type: "list",
      message: "Who is this employees manager?",
      choices: ["Ron Swanson", "Leslie Knope", "Ben Wyatt", "Ann Perkins", "Chris Traeger" ]
    },
  ]).then(answer => {
    // here we are taking the users selection for role and grabbing the role id
    const getRoleId = `SELECT id FROM employee_role WHERE title = ${JSON.stringify(answer.employeeRole)}`
    // then make a connection to the db and set the id to a variable
    connection.query(getRoleId, (err,res) => {
      if (err) throw err;
      const roleId =res[0].id;
      // then take the answers for all employee choices and insert into employee table
      const createEmployee = `INSERT INTO employee (first_name, last_name, role_id) VALUES (? , ?, ?);`;
      connection.query(createEmployee, [answer.firstName, answer.lastName, roleId],(err,res) => {
        if (err) throw err;
        start();
      });
    })
  })
  
};


const deleteEmployee = () => {
  inquirer.prompt([
    ///NEED TO FIGURE THIS OUT, why do I need a question in order for the second one to work
    {
      name: "confirmDelete",
      type: "list",
      message: "Are you sure you would like to delete an employee?",
      choices: ['y','n']
    },
    {
      type: 'list',
      pageSize: 30,
      message: 'What Employee would youlike to delete:',
      name: "deleteName",
      choices: employeeList()
    },
  ]).then(answer => {
    const query = `DELETE FROM employee WHERE CONCAT(first_name, ' ', last_name) = ${JSON.stringify(answer.deleteName)}`
    connection.query(query, (err,res) => {
      if (err) throw err;
      start();
    })
  });
};

const updateEmployeeRole = () => {

};

const updateEmployeeManager = () => {

};

const start = () => {
  inquirer.prompt({
    name: "initial",
    message: "What would you like to do?",
    type: "list",
    choices: ["View all employees", "View all employees by department", "View all employees by manager", "Add employee", "Delete employee", "Update employee role", "Update employee manager"]
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
      case "Delete employee":
        deleteEmployee();
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
