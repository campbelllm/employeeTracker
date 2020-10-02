const mysql = require('mysql');
const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'password',
    database : 'employeeTracker_DB'
});
connection.connect(err => {
    if(err) throw err;
    start();
});