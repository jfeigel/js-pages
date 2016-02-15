"use strict";

const inquirer = require("inquirer");
const Promise  = require("bluebird");
const execSync = require("child_process").execSync;
const fs       = require("fs");
const chalk    = require("chalk");

const seperatorLine = "==============================";
const seperator     = `\n${seperatorLine}\n`

const squelch = "> /dev/null 2>&1";

let packageJSONExists = null;

// Object to easily access the runner setup functions
let runnerSetup = {
  "grunt": grunt,
  "gulp": gulp
};

console.log(`\n${seperatorLine}`);
console.log(chalk.gray.bgCyan('           JS-PAGES           '));
console.log(`${seperatorLine}\n`);

// Initial question set and kick-off point
inquirer.prompt([
  {
    "type": "list",
    "name": "runner",
    "message": "Which task runner will you use?",
    "choices": [
      {
        "name": "Grunt",
        "value": "grunt",
        "short": "Grunt"
      },
      {
        "name": "Gulp",
        "value": "gulp",
        "short": "Gulp"
      }
    ]
  },
  {
    "type": "list",
    "name": "docs",
    "message": "Which documentation generator will you use?",
    "choices": ["ngdoc", "JSDoc"]
  },
  {
    "type": "list",
    "name": "sudo",
    "message": "Are your npm packages installed with 'sudo'?",
    "choices": [
      {
        "name": "No",
        "value": false,
        "short": "No"
      },
      {
        "name": "Yes",
        "value": true,
        "short": "Yes"
      }
    ]
  }
], (answers) => {
  console.log(seperator);
  console.log(chalk.gray(`Setting up selected task runner: ${chalk.reset(answers.runner)}`));

  // Check if package.json exists
  try {
    fs.statSync(`./package.json`);
    packageJSONExists = true;

    console.log(chalk.green('package.json exists'));
    console.log(chalk.gray('Running npm install...'));
    
    // If package.json exists make sure all listed packages are installed
    execSync(`npm install ${squelch}`);
  } catch (err) {
    packageJSONExists = false;
    
    console.log(chalk.yellow('package.json does not exist'));
    console.log(chalk.gray('Creating package.json with default options...'));
    
    // If package.json does not exist then create a new, default one
    execSync(`npm init --force ${squelch}`);
  }

  // Initialize the selected task runner
  runnerSetup[answers.runner]();

  // Configure the custom git script
  //   This function returns a promise since it asks another question
  //   which happens asynchronously
  configureGitAlias(answers.runner, answers.docs, 'gh-pages').then((value) => {
    
  });
});

// Check if the given package is installed
function checkInstall(packageToInstall, isGlobal) {
  let command = 'npm list';

  if (isGlobal === true) {
    command = `${command} -g`;
  }

  command = `${command} --depth 0 ${packageToInstall} ${squelch}`

  try {
    execSync(command);
    
    console.log(chalk.green(`${packageToInstall} is installed.`));
    
    return true;
  } catch (err) {
    console.log(chalk.yellow(`${packageToInstall} is not installed.`));
    
    return false;
  }
}

// Install the given package
function installPackage(packageToInstall, isGlobal, isSudo, doSave) {
  let command = 'npm install';

  if (isSudo === true) {
    command = `sudo ${command}`;
  }

  if (isGlobal === true) {
    command = `${command} -g`;
  }

  if (packageToInstall !== null) {
    command = `${command} ${packageToInstall}`;
  }

  if (doSave) {
    command = `${command} --${doSave}`;
  }

  execSync(command);
  return true;
}

// Configure grunt as the task-runner
function grunt(answers) {
  console.log(chalk.gray("Verifying 'grunt-cli' is installed globally..."));
  
  // Ensure grunt-cli is installed globally
  if (checkInstall('grunt-cli', true) === false) {
    console.log(chalk.gray("Installing 'grunt-cli' globally..."));
    
    installPackage('grunt-cli', true, answers.sudo);
  }

  console.log(chalk.gray("Verifying 'grunt' is installed locally..."));

  // Ensure grunt is installed locally
  if (checkInstall('grunt', false) === false) {
    console.log(chalk.gray("Installing 'grunt' locally..."));
    
    installPackage('grunt', false, answers.sudo, 'save-dev');
  }
}

// Configure gulp as the task-runner
function gulp(answers) {
  console.log(chalk.gray("Verifying 'gulp' is installed locally..."));

  // Ensure gulp is installed locally
  if (checkInstall('gulp', false) === false) {
    console.log(chalk.gray("Installing 'gulp'..."));
    
    installPackage('gulp', false, answers.sudo, 'save-dev');
  }
}

// Configure the custom git script
function configureGitAlias(runner, docs, ghpages) {
  return new Promise((resolve, reject) => {
    // Ask the user the name the custom git script
    inquirer.prompt([
        {
          "type": "input",
          "name": "command_name",
          "message": "Name of custom Git command",
          "default": "pushdoc",
          "validate": function(value) {
            var pass = value.match(/^[A-Z]{1}([A-Z0-9-]+)?$/i);
            if (pass) {
              return true;
            } else {
              return "Please enter a valid command name";
            }
          }
        }
      ], (answers) => {
      // Create the custom git script
      let gitFilePath = `/usr/local/bin/git-${answers.command_name}`;
      let stream = fs.createWriteStream(gitFilePath);
      
      stream.once('open', function(fd) {
        stream.write("#!/bin/sh\n\n");
        stream.write("shift")
        stream.write("git push \"$@\"\n");
        stream.write(`test $? -eq 0 && ${runner} ${docs} && ${runner} ${ghpages}`)
        stream.end();
      });

      // Make the script executable
      fs.chmodSync(gitFilePath, "0755");
      resolve();
    });
  });
}