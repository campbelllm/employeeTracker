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
// function to return employee departments for cli choices
const departmentsChoice = () => {
  const query = "SELECT name FROM department";
  let array= [];
  connection.query(query, (err, res) => {
    if (err) throw err;
    res.forEach(title => array.push(title.name))
  })
  return array;
};

const allDepartments = () =>{
  const query = "SELECT * FROM department";
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    start();
  })
};

const allRoles = () => {
  const query = "SELECT * FROM employee_role";
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    start();
  })
}

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

const addDepartment = () => {
  console.log('hi')
 inquirer.prompt([
   {
    name:"newDepartment",
    type:"input",
    message:"Enter name of new department:",
   },
  ]).then(answer => {
  const createDepartment = "INSERT INTO department (name) VALUES (?);";
  connection.query(createDepartment, answer.newDepartment, (err, res) => {
    if (err) throw err;
    start();
  })
})
};

const addRole = () => {
  inquirer.prompt([
    {
      name: "roleTitle",
      type: "input",
      message: "Enter title of new role:",
    },
    {
      name: "roleSalary",
      type: "input",
      message: "Enter salary for new role:"
    },
    {
      name: "department",
      type: "list",
      message: "Which deparment does this role fit in?",
      choices: departmentsChoice()
    }
  ]).then(answer => {
    const getDepartmentId = `SELECT id FROM department WHERE name = ${JSON.stringify(answer.department)}`
    // then make a connection to the db and set the id to a variable
    connection.query(getDepartmentId, (err,res) => {
      if (err) throw err;
      const departmentId =res[0].id;
      // then take the answers for all employee choices and insert into employee table
      const createRole = "INSERT INTO employee_role (title, salary, department_id) VALUES (?, ?, ?);";
      connection.query(createRole, [answer.roleTitle, answer.roleSalary, departmentId], (err, res) => {
        if (err) throw err;
        start();
      })
      });
  });
};

const deleteEmployee = () => {
  inquirer.prompt([
    ///NEED TO FIGURE THIS OUT, why do I need a question in order for the second one to work
    {
      name: "confirmDelete",
      message: "You will now be deleting an employee."
    },
    {
      type: 'list',
      pageSize: 30,
      message: 'What Employee would youlike to delete:',
      name: "deleteName",
      choices: employeeList()
    },
  ]).then(answer => {
    const deleteQuery = `DELETE FROM employee WHERE CONCAT(first_name, ' ', last_name) = ${JSON.stringify(answer.deleteName)}`
    connection.query(deleteQuery, (err,res) => {
      if (err) throw err;
      start();
    })
  });
};

const updateEmployeeRole = () => {
  inquirer.prompt([
    {
      name: "roleUpdateConfirm",
      message: "You are now updating the role for an employee."
    },
    {
      type: 'list',
      pageSize: 30,
      name: "employeeName",
      message: "Select employee that you will be updating role:",
      choices: employeeList()
    },
    {
      type: "list",
      name: "newRole",
      pageSize: 30,
      message: "Please select new role:",
      choices: employeeRoleChoice(),
    }
  ]).then(answer => {
    // this gets the role id from user selection
    const getRoleId = `SELECT id FROM employee_role WHERE title = ${JSON.stringify(answer.newRole)};`
    connection.query(getRoleId, (err,res) => {
      if (err) throw err;
      const roleId = res[0].id;
      const nameSplit = answer.employeeName.split(' ');
      // const firstName = nameSplit[0];
    
      const newRoleQuery = `UPDATE employee SET role_id = ${roleId}  WHERE first_name = '${nameSplit[0]}' AND last_name = '${nameSplit[1]}'`;
      connection.query(newRoleQuery, (err, res) => {
      if (err) throw err;
      start();
    })
    })
  })
};

const updateEmployeeManager = () => {

};

const start = () => {
  inquirer.prompt({
    name: "initial",
    pageSize: 30,
    message: "What would you like to do?",
    type: "list",
    choices: ["View all employees", "View all departments", "View all roles", "View all employees by manager", "Add employee", "Add department", "Add role", "Delete employee", "Update employee role", "Update employee manager"]
  }).then(answer => {
    switch(answer.initial){
      case "View all employees":
        allEmployees();
        break;
      case "View all departments":
        allDepartments();
        break;
      case "View all roles":
        allRoles();
        break;
      case "View all employees by manager":
        employeesByMan();
        break;
      case "Add employee":
        addEmployee();
        break;
      case "Add department":
        addDepartment();
        break;
      case "Add role":
        addRole()
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
