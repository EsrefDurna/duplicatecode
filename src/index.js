#!/usr/bin/env node
const program = require('commander');
const inquirer = require('inquirer');
const chalk = require('chalk');
const figlet = require('figlet');
const { findDuplicateCode }= require('./findDuplicateCode');
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
			.option('-f, --folder ./src', 'folder input', './src')
			.option('-m, --maxscan 10000', 'maximum number of files to scan', 10000)
			.option('-o, --maxoutput 100', 'maximum number of duplicates to display', 100)
			.option('-e, --ext js,ts', 'file types to scan', 'js')
			.option('-s, --startsWith function', 'result should have starts with in their first line', 'function')
			.parse(process.argv);
	  showWelcome();
	  if (program.folder) {
			findDuplicateCode({folder:program.folder, 
				extensions: program.ext,
				MAX_SCAN_SIZE: program.maxscan,
				TOP_RESULTS: program.maxoutput,
				startsWith: program.startsWith});
	  } 
	} catch (err) {
	  console.error(err.message);
	}
}
run();