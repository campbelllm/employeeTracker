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

//INPUT VALIDATIONS

//input validation for numbers
//number input validation
const numValidation = (input) => {
  if (isNaN(input)) 
  {
    return "Must input numbers";
  }
  return true
}

//text validation
const textValidation = (input) => {
  function textIsValid (input) {
    return /^([a-zA-Z]+\s)*[a-zA-Z]+$/.test(input)
  }
  const textCheck = textIsValid(input)
if(!textCheck){
  return 'You must enter text. Please make sure there are no extra spaces.'
}
return true
};


const allEmployees = () => {
  const allEmployeeQuery = "SELECT first_name,last_name,title,salary,name,manager FROM employee, employee_role, department WHERE employee.role_id = employee_role.id AND employee_role.department_id = department.id;";
  connection.query(allEmployeeQuery, (err, res) => {
    if (err) throw err;
    console.table(res);
    start();
  })
};


// function to grab roles from table to be used as choices in CLI when creating employee
const employeeRoleChoice = () => {
  const roleQuery = "SELECT title FROM employee_role";
  let array= [];
  connection.query(roleQuery, (err, res) => {
    if (err) throw err;
    res.forEach(title => array.push(title.title))
  })
  return array;
};

//function for grabbing all employee names 

const employeeList = () => {
  let nameArray = [];
  const employeeListQuery = "SELECT first_name, last_name FROM employee";
  connection.query(employeeListQuery, (err, res) => {
    if (err) throw err;
    res.forEach(name => nameArray.push(name.first_name + " " + name.last_name))
  });
  return nameArray;
};
// function to return employee departments for cli choices
const departmentsChoice = () => {
  const departmentQuery = "SELECT name FROM department";
  let array= [];
  connection.query(departmentQuery, (err, res) => {
    if (err) throw err;
    res.forEach(title => array.push(title.name))
  })
  return array;
};

const managerChoice = () => {
  const managerQuery = "SELECT first_name, last_name FROM employee WHERE manager_id = 1;";
  let array = [];
  connection.query(managerQuery, (err,res) => {
    if (err) throw err;
    res.forEach(name => array.push(name.first_name + " " + name.last_name))
  })
  return array;
}

const allDepartments = () =>{
  const query = "SELECT name FROM department";
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    start();
  })
};

const allRoles = () => {
  const query = "SELECT title, salary FROM employee_role";
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    start();
  })
}

const addEmployee = () => {
  inquirer.prompt([
    {
      name: 'firstName',
      type: "input",
      message: "What is the employees first name?",
      validate: textValidation
    },
    {
      name: "lastName",
      type: "input",
      message: "What is the employees last name?",
      validate: textValidation
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
      choices: managerChoice()
    },
  ]).then(answer => {
    // here we are taking the users selection for role and grabbing the role id
    const getRoleId = `SELECT id FROM employee_role WHERE title = ${JSON.stringify(answer.employeeRole)}`
    // then make a connection to the db and set the id to a variable
    connection.query(getRoleId, (err,res) => {
      if (err) throw err;
      const roleId =res[0].id;
      let managerId = 0;
      if(roleId === 9){
       managerId = 1;
      };
      // then take the answers for all employee choices and insert into employee table
      const createEmployee = `INSERT INTO employee (first_name, last_name, manager, role_id, manager_id) VALUES (? , ?, ?, ?, ?);`;
      connection.query(createEmployee, [answer.firstName, answer.lastName, answer.employeeManager, roleId, managerId],(err,res) => {
        if (err) throw err;
        start();
      });
    })
  })
  
};

const addDepartment = () => {
 inquirer.prompt([
   {
    name:"newDepartment",
    type:"input",
    message:"Enter name of new department:",
    validate: textValidation
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
      validate: textValidation
    },
    {
      name: "roleSalary",
      type: "input",
      message: "Enter salary for new role:",
      validate: numValidation
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
      message: "You will now be deleting an employee.",
      type:'list',
      choices: ["Continue"]
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
      message: "You are now updating the role for an employee.",
      type:'list',
      choices: ["Continue"]
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
      let managerId = 0;
      if (roleId === 9){
        managerId = 1;
      }
      const nameSplit = answer.employeeName.split(' '); 
      const newRoleQuery = `UPDATE employee SET role_id = ${roleId}, manager_id = ${managerId}  WHERE first_name = '${nameSplit[0]}' AND last_name = '${nameSplit[1]}';`;
      connection.query(newRoleQuery, (err, res) => {
      if (err) throw err;
      start();
    })
    })
  })
};

const start = () => {
  inquirer.prompt({
    name: "initial",
    pageSize: 30,
    message: "What would you like to do?",
    type: "list",
    choices: ["View all employees", "View all departments", "View all roles",  "Add employee", "Add department", "Add role", "Delete employee", "Update employee role"]
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
    }
  })
}
