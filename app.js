/**
 * @overview
 * @author James Feigel {@link https://github.com/jfeigel|@jfeigel}
 * @description
 *  Custom Git script to compile JSDoc / ngdoc and deploy to gh-pages
 *
 * @requires {@link https://github.com/petkaantonov/bluebird|bluebird}
 * @requires {@link https://github.com/chalk/chalk|chalk}
 * @requires {@link https://github.com/SBoudrias/Inquirer.js|Inquirer}
 */

"use strict";

const Promise  = require("bluebird");
const chalk    = require("chalk");
const inquirer = require("inquirer");

const execSync = require("child_process").execSync;
const fs       = require("fs");

const config   = require("./config")();

const seperatorLine = "==============================";
const seperator     = `\n${seperatorLine}\n`

const squelch = "> /dev/null 2>&1";

let packageJSONExists = null;

// Object to easily access the runner setup functions
let runnerSetup = {
  "grunt": {
    "install": installGrunt,
    "configure": configureGrunt
  },
  "gulp": {
    "install": installGulp,
    "configure": configureGulp
  }
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
    "choices": ["ngdocs", "jsdoc"]
  },
  {
    "type": "input",
    "name": "command_name",
    "message": "Name of custom Git command",
    "default": "pushdoc",
    "validate": function(value) {
      var pass = value.match(/^[A-Z]{1}([A-Z0-9-]+)?$/i);
      if (pass) {
        try {
          execSync(`git config -l --local | grep 'alias.${value}'`);

          if (overwriteAliasCommand === null || overwriteAliasCommand !== value) {
            overwriteAliasCommand = value;
            return "Alias already exists. Enter the same alias again to overwrite the current alias.";
          } else {
            execSync(`git config --local --unset-all alias.${answers.command_name}`);
            return true;
          }
        } catch (err) {
          return true;
        }
      } else {
        return "Please enter a valid command name";
      }
    }
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
], init);

/**
 * @function
 * @name init
 * @description
 *  Start setup after questions have been answered
 *
 * @param {Object} answers - Answer values from the setup questions
 */
function init(answers) {
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
  runnerSetup[answers.runner].install(answers);

  // Configure the custom git script
  configureGitAlias(answers, 'gh-pages');
  
  // Compile the runner's template files
  runnerSetup[answers.runner].configure(answers.docs, 'gh-pages');
}

////////////

/**
 * @function
 * @name checkInstall
 * @description
 *  Check whether or not the given package is installed
 *
 * @param {String} packageToCheck - Name of the package to check
 * @param {boolean} isGlobal - Is the package supposed to be installed globally?
 *
 * @returns {boolean} Whether or not the package is installed
 */
function checkInstall(packageToCheck, isGlobal) {
  let command = 'npm list';

  if (isGlobal === true) {
    command = `${command} -g`;
  }

  command = `${command} --depth 0 ${packageToCheck} ${squelch}`

  try {
    execSync(command);
    
    console.log(chalk.green(`${packageToCheck} is installed.`));
    
    return true;
  } catch (err) {
    console.log(chalk.yellow(`${packageToCheck} is not installed.`));
    
    return false;
  }
}

/**
 * @function
 * @name installPackage
 * @description
 *  Install the given package
 * 
 * @param {String} packageToInstall - Name of the package to install
 * @param {boolean} isGlobal - Should the package be installed globally?
 * @param {boolean} isSudo - Should the package be installed using `sudo`?
 * @param {String} doSave - Should the package be saved in `package.json`? ```['save', 'save-dev']```
 */
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

/**
 * @function
 * @name installGrunt
 * @description
 *  Install grunt as the task-runner
 *
 * @param {Object} answers - Answer values from the setup questions
 */
function installGrunt(answers) {
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

/**
 * @function
 * @name configureGrunt
 * @description
 *  Configure grunt templates
 *
 * @param {String} runner - Selected task-runner
 * @param {String} docs - Selected documentation generator
 * @param {String} ghpages - Selected gh-pages script
 */
function configureGrunt(docs, ghpages) {
  console.log(chalk.gray("Compiling the grunt template file..."));

  let templateFilePath = '"node_modules/js-pages/templates/grunt';
  
  let gruntfileName = 'Gruntfile.js';
  let gruntfileFiles = [
    `${templateFilePath}/Gruntfile_header.js"`,
    `${templateFilePath}/Gruntfile_${ghpages}.js"`,
    `${templateFilePath}/Gruntfile_${docs}.js"`,
    `${templateFilePath}/Gruntfile_middle.js"`,
    `${templateFilePath}/Gruntfile_${ghpages}_npm.js"`,
    `${templateFilePath}/Gruntfile_${docs}_npm.js"`,
    `${templateFilePath}/Gruntfile_footer.js"`
  ];

  let gruntfileExists = fs.readdirSync('./').some((file, index, array) => {
    return file.toLowerCase() == gruntfileName.toLowerCase();
  });

  if (gruntfileExists === true) {
    console.log(chalk.yellow("Gruntfile.js already exists. Creating a temporary file instead..."));
    gruntfileName = `${gruntfileName}.tmp`;
  }

  execSync(`cat ${gruntfileFiles.join(' ')} > ${gruntfileName}`);
}

/**
 * @function
 * @name installGulp
 * @description
 *  Install gulp as the task-runner
 *
 * @param {Object} answers - Answer values from the setup questions
 */
function installGulp(answers) {
  console.log(chalk.gray("Verifying 'gulp' is installed locally..."));

  // Ensure gulp is installed locally
  if (checkInstall('gulp', false) === false) {
    console.log(chalk.gray("Installing 'gulp'..."));
    
    installPackage('gulp', false, answers.sudo, 'save-dev');
  }
}

/**
 * @function
 * @name configureGulp
 * @description
 *  Configure gulp templates
 *
 * @param {String} runner - Selected task-runner
 * @param {String} docs - Selected documentation generator
 * @param {String} ghpages - Selected gh-pages script
 */
function configureGulp(docs, ghpages) {
  console.log(chalk.gray("Compiling the gulp template files..."));

  let templateFilePath = '"node_modules/js-pages/templates/gulp';
  
  // gulp.config.js set up
  let gulpconfigName = 'gulp.config.js';
  let gulpconfigFiles = [
    `${templateFilePath}/gulp.config_header.js"`,
    `${templateFilePath}/gulp.config_${ghpages}.js"`,
    `${templateFilePath}/gulp.config_${docs}.js"`,
    `${templateFilePath}/gulp.config_footer.js"`
  ];

  let gulpconfigExists = fs.readdirSync('./').some((file, index, array) => {
    return file.toLowerCase() == gulpconfigName.toLowerCase();
  });

  if (gulpconfigExists === true) {
    console.log(chalk.yellow("gulp.config.js already exists. Creating a temporary file instead..."));
    gulpconfigName = `${gulpconfigName}.tmp`;
  }

  execSync(`cat ${gulpconfigFiles.join(' ')} > ${gulpconfigName}`);

  // gulpfile.js set up
  let gulpfileName = 'gulpfile.js';
  let gulpfileFiles = [
    `${templateFilePath}/gulpfile_header.js"`,
    `${templateFilePath}/gulpfile_${ghpages}.js"`,
    `${templateFilePath}/gulpfile_${docs}.js"`,
    `${templateFilePath}/gulpfile_footer.js"`
  ];

  let gulpfileExists = fs.readdirSync('./').some((file, index, array) => {
    return file.toLowerCase() == gulpfileName.toLowerCase();
  });

  if (gulpfileExists === true) {
    console.log(chalk.yellow("gulpfile.js already exists. Creating a temporary file instead..."));
    gulpfileName = `${gulpfileName}.tmp`;
  }

  execSync(`cat ${gulpfileFiles.join(' ')} > ${gulpfileName}`);
}

/**
 * @function
 * @name configureGitAlias
 * @description
 *  Configure the custom git script
 *
 * @param {String} runner - Selected task-runner
 * @param {String} docs - Selected documentation generator
 * @param {String} ghpages - Selected gh-pages script
 *
 * @returns {Promise} Promise object that is resolved after Inquirer
 *                    and custom script creation completes
 */
function configureGitAlias(answers, ghpages) {
  try {
    console.log(chalk.gray('Verifying git has been initialized...'));
    execSync(`git status ${squelch}`);
  } catch (e) {
    console.log(chalk.yellow('Git has not been initialized'));
    console.log(chalk.gray('Initializing git...'));
    execSync(`git init ${squelch}`);
  }

  // Create the custom git script
  let gitFilePath = `./git-${answers.command_name}`;
  let stream = fs.createWriteStream(gitFilePath);
  
  stream.once('open', function(fd) {
    stream.write("#!/bin/sh\n\n");
    stream.write("git push \"$@\"\n");
    stream.write(`test $? -eq 0 && ${answers.runner} ${answers.docs} && ${answers.runner} ${ghpages}`)
    stream.end();
  });

  // Make the script executable
  fs.chmodSync(gitFilePath, "0755");
  execSync(`git config --local --add alias.${answers.command_name} '!sh -c "./git-${answers.command_name}"'`);
}