const inquirer = require("inquirer");
const mysql = require("mysql");

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
    .then(function (response) {
      switch (response.action) {
        case "Add employees":
          addInfo();
          break;

        case "View all departments, roles, employees":
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
        type: "input",
        message: "What is the employee's title?",
      },
      {
        name: "salary",
        type: "input",
        message: "What is the employee's salary?",
      },
    ])
    .then(function (response) {
      var query = "INSERT INTO employee (first_name, last_name) VALUES (?, ?)";
      var query2 = "INSERT INTO role (title, salary) VALUES(?,?)";
      connection.query(query, [response.fName, response.lName], function (
        err,
        res
      ) {
        if (err) {
          throw err;
        }
      });
      connection.query(query2, [response.title, response.salary], function (
        err,
        res
      ) {
        if (err) {
          throw err;
        }
      });
    });
}

function viewInfo() {
  var query2 =
    "SELECT * FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id";
  connection.query(query2, function (err, res) {
    if (err) {
      throw err;
    } else console.table(res);
  });
}
