const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require("console.table");
var table = [];

// setting up connection to database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password123",
  database: "employee_info",
});

connection.connect(function (err) {
  if (err) throw err;
  runPrompt();
});
// query to pull all information to be used to view and update employee info
// create an array of employees
var query3 =
  "SELECT * FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id";
connection.query(query3, function (err, res) {
  if (err) throw err;
  res.forEach((name) => table.push(name.first_name + " " + name.last_name));
});
// create an array of roles
var roles = [];
connection.query("SELECT role.title, role.id FROM role", (err, res) => {
  if (err) throw err;
  res.forEach((titles) => roles.push(titles.title));
});
// beginning of prompt to ask what they would like to do
function runPrompt() {
  inquirer
    .prompt({
      name: "action",
      type: "rawlist",
      message: "What would you like to do?",
      choices: [
        "Add employees",
        "View departments, roles, employees",
        "Update employee roles",
      ],
    })
    // based on the action different functions will run
    .then(function (response) {
      switch (response.action) {
        case "Add employees":
          addInfo();
          break;

        case "View departments, roles, employees":
          viewInfo();
          break;

        case "Update employee roles":
          updateInfo();
          break;
      }
    });
}

function addInfo() {
  inquirer
    .prompt([
      {
        name: "fName",
        type: "input",
        message: "What is the employee's first name?",
      },
      {
        name: "lName",
        type: "input",
        message: "What is the employee's last name?",
      },
      {
        name: "title",
        type: "rawlist",
        message: "What is the employee's title?",
        choices: roles,
      },
    ])
    // find the role id of the employees title then add that and the employee's name to a table
    .then(function (response) {
      var id = roles.findIndex((e) => e === response.title) + 1;
      var query =
        "INSERT INTO employee (first_name, last_name, role_id) VALUES (?, ?, ?)";
      connection.query(query, [response.fName, response.lName, id], function (
        err,
        res
      ) {
        if (err) throw err;
        console.log("Added!");
        runPrompt();
      });
    });
}
// pull employee information then use console.table to make the output look better
function viewInfo() {
  connection.query(query3, function (err, res) {
    if (err) throw err;
    var table = cTable.getTable(res);
    console.log(table);
    runPrompt();
  });
}
// allow user to update information using the array of employees
function updateInfo() {
  inquirer
    .prompt([
      {
        name: "change",
        type: "rawlist",
        message: "Which employee's role would you like to change?",
        choices: table,
      },
      {
        name: "newRole",
        type: "rawlist",
        message: "What should their new role be?",
        choices: roles,
      },
    ])
    .then((response) => {
      var newId = roles.findIndex((e) => e === response.newRole) + 1;
      var first = response.change.split(" ", 1);
      var query4 = `UPDATE employee  SET role_id = ? WHERE employee.first_name = ?;`;
      connection.query(query4, [newId, first], function (err, res) {
        if (err) throw err;
        console.log("Updated!");
        runPrompt();
      });
    });
}
