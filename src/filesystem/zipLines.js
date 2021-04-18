const replaceall = require("replaceall");
function replaceDoubleChars({line,chr}) {
	let temp = '';
	let cnt = 0;
	while (temp !== line) {
		line = replaceall(`${chr}${chr}`,`${chr}`,line);
		temp = line;
		cnt++;
	}
	if (cnt > 1) {
		//console.log(`origina;:${original} newline: ${line}`);
	}
	const validChrResult =  line.trim();
	//console.log(validChrResult);
	return validChrResult;
}
function zipLines({line}) {
	line = replaceDoubleChars({line,chr:' '});
	line = replaceDoubleChars({line,chr:'\t'});
	return line;
}
module.exports = {
	zipLines
};