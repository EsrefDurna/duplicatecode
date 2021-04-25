#!/usr/bin/env node
const { Command } = require('commander');
const program = new Command();
//const inquirer = require('inquirer');
const chalk = require('chalk');
const figlet = require('figlet');
const { findDuplicateCode } = require('./findDuplicateCode');
function showWelcome() {
	console.log(
	  chalk.green(
			figlet.textSync('Duplicate Scanner', {
		  horizontalLayout: 'default',
		  verticalLayout: 'default',
			}),
	  ),
	);
}
async function run() {
	try {
	  program
			.version('0.1.0')
			.option('-f, --folder <folder>',' folder to scan')
			.option('-m, --maxscan <integer>', 'maximum number of files to scan', 10000)
			.option('-o, --maxoutput <integer>', 'maximum number of duplicates to display', 100)
			.option('-e, --ext js,ts  <string>', 'file types to scan', 'js')
			.option('-s, --startsWith  <string>', 'result should have starts with in their first line', 'function');
	  program.parse();
	  showWelcome();
	  const options = program.opts();
	  console.log(options);
	  if (options.folder) {
		  console.log(options.folder);
			findDuplicateCode({folder:options.folder, 
				extensions: options.ext,
				MAX_SCAN_SIZE: options.maxscan,
				TOP_RESULTS: options.maxoutput,
				startsWith: options.startsWith});
	  } 
	} catch (err) {
	  console.error(err.message);
	}
}
run();