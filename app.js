"use strict";

const inquirer = require('inquirer');
const co       = require('co');
const execSync = require('child_process').execSync;

const seperator = '\n=============================\n';

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
		"choices": ["JSDoc", "ngdoc"]
	},
	{
		"type": "list",
		"name": "sudo",
		"message": "Are your npm packages installed with 'sudo'?",
		"choices": [
			{
				"name": "Yes",
				"value": true,
				"short": "Yes"
			},
			{
				"name": "No",
				"value": false,
				"short": "No"
			}
		]
	}
], function(answers) {
	co(function * () {
		console.log(seperator);
	    console.log(`Setting up selected task runner: ${answers.grunt_gulp}`);

	    switch (answers.grunt_gulp) {
	    	case 'Grunt':
	    		yield grunt(answers);
	    		break;
	    	case 'Gulp':
	    		break;
	    	default:
	    		break;
	    }

	    console.log(`Setting up selected documentation generator: ${answers.js_ng}`);
	}).then(function(success) {
		console.log('Success!', success);
	}, function(err) {
		console.error('Error!', err);
	});
});

function checkInstall(packageToInstall, isGlobal) {
	let command = 'npm list';

	if (isGlobal === true) {
		command = `${command} -g`;
	}

	command = `${command} --depth 1 ${packageToInstall} > /dev/null 2>&1`

	try {
		execSync(command);
		console.log(`${packageToInstall} is installed.`);
		return true;
	} catch (err) {
		console.log(`${packageToInstall} is not installed.`);
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

	command = `${command} ${packageToInstall}`;

	execSync(command);
	return true;
}

function * grunt(answers) {
	console.log("Verifying 'grunt-cli' is installed globally...");
	let isGruntCLIInstalled = checkInstall('grunt-cli', true);

	if (isGruntCLIInstalled === false) {
		console.log("Installing 'grunt-cli' globally...");
		installPackage('grunt-cli', true, answers.sudo);
	}

	// let isGruntInstalled = yield checkInstall('grunt', false);
}