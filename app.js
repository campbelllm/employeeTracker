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
      pageSize: 10,
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
    // const role = answer.employeeRole
    const getRoleId = `SELECT id FROM employee_role WHERE title = ${JSON.stringify(answer.employeeRole)}`
    
    connection.query(getRoleId, (err,res) => {
      if (err) throw err;
      const roleId =res[0].id;
      const createEmployee = `INSERT INTO employee (first_name, last_name, role_id) VALUES (? , ?, ?);`;
      connection.query(createEmployee, [answer.firstName, answer.lastName, roleId],(err,res) => {
        if (err) throw err;
       
        start();
      });
      
    })
   
   
    // const setRole = "INSERT INTO employee_role (title) VALUES (?);";
    // connection.query(setRole, answer.employeeRole, (err, res) => {
    //   if (err) throw err;
      
    // });
    // const setManager = "INSERT INTO manager (manager) VALUES (?);";
    // connection.query(setManager, answer.employeeManager, (err, res) => {
    //   if (err) throw err;
     
    //   start();
    // })
    
  })
  
};

const removeEmployee = () => {

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
