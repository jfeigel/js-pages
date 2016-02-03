"use strict";

const inquirer = require("inquirer");
const co       = require("co");
const execSync = require("child_process").execSync;
const fs       = require("fs");
const chalk    = require("chalk");

const seperatorLine = "==============================";
const seperator = `\n${seperatorLine}\n`

let packageJSONExists = null;

console.log(`\n${seperatorLine}`);
console.log(chalk.gray.bgCyan('           JS-PAGES           '));
console.log(`${seperatorLine}\n`);

inquirer.prompt([
	{
	    "type": "list",
	    "name": "grunt_gulp",
	    "message": "Which task runner will you use?",
	    "choices": ["Grunt", "Gulp", "other"]
	},
	{
	    "type": "list",
	    "name": "js_ng",
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
    console.log(chalk.gray(`Setting up selected task runner: ${chalk.reset(answers.grunt_gulp)}`));

    try {
        fs.statSync(`./package.json`);
        console.log(chalk.green('package.json exists'));
        packageJSONExists = true;
        console.log(chalk.gray('Running npm install...'));
        execSync('npm install > /dev/null 2>&1');
    } catch (err) {
        packageJSONExists = false;
        console.log(chalk.yellow('package.json does not exist'));
        console.log(chalk.gray('Creating package.json with default options...'));
        execSync('npm init --force');
    }

    switch (answers.grunt_gulp) {
    case 'Grunt':
        grunt(answers);
        break;
    case 'Gulp':
        break;
    default:
        break;
    }

    console.log(chalk.gray(`Setting up selected documentation generator: ${chalk.reset(answers.js_ng)}`));
});

function checkInstall(packageToInstall, isGlobal) {
    let command = 'npm list';

    if (isGlobal === true) {
        command = `${command} -g`;
    }

    command = `${command} --depth 0 ${packageToInstall} > /dev/null 2>&1`

    try {
        execSync(command);
        console.log(chalk.green(`${packageToInstall} is installed.`));
        return true;
    } catch (err) {
        console.log(chalk.yellow(`${packageToInstall} is not installed.`));
        return false;
    }
}

function installPackage(packageToInstall, isGlobal, isSudo) {
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

    execSync(command);
    return true;
}

function grunt(answers) {
    console.log(chalk.gray("Verifying 'grunt-cli' is installed globally..."));
    let isGruntCLIInstalled = checkInstall('grunt-cli', true);

    if (isGruntCLIInstalled === false) {
        console.log(chalk.gray("Installing 'grunt-cli' globally..."));
        installPackage('grunt-cli', true, answers.sudo);
    }
}