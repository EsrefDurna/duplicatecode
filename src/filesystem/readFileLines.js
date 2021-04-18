const fs = require('fs');
const EOL = require('os').EOL;
function readFileLines({fileName}) {
	const rawData = fs.readFileSync(fileName, 'utf8');
	//console.log(rawData);
	const lines =  rawData.split(EOL);
	return lines;
}
module.exports = {  readFileLines };