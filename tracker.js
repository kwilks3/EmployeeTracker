const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require("console.table");

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
  var roles = [];
  connection.query("SELECT role.title, role.id FROM role", (err, res) => {
    if (err) throw err;
    res.forEach((titles) => roles.push(titles.title));
  });
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
function viewInfo() {
  var query3 =
    "SELECT * FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id";
  connection.query(query3, function (err, res) {
    if (err) throw err;
    var table = cTable.getTable(res);
    console.log(table);
    runPrompt();
  });
}
function updateInfo() {
  var query4 =
    "SELECT * FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id";
  var table = [];
  connection.query(query4, function (err, res) {
    if (err) throw err;
    res.forEach((name) => table.push(name.first_name + " " + name.last_name));
    // table.push(cTable.getTable(res));
  });
  inquirer.prompt([
    {
      name: "title",
      type: "rawlist",
      message: "Which employee's information would you like to change?",
      choices: table,
    },
  ]);
}
