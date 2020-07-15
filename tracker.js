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
        "Add departments, roles, employees",
        "View departments, roles, employees",
        "Update employee roles",
      ],
    })
    .then(function (response) {
      switch (response.action) {
        case "Add departments, roles, employees":
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

function addInfo(){
    inquirer.prompt({
        name: "add", 
        type: "rawlist", 
        message: "What would you like to add?",
        choices: [
            "departmemnt", 
            "role", 
            "employee"
        ]
    }).then(function(response){
        var query = INSERT INTO ? 
    })
}
