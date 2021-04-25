const path = require('path');
const fs = require('fs');
function findFiles({
	base=__dirname, folderName,result=[], extensionsStr='js'
}) {
	try {
		const extensions = extensionsStr.split(',');
		const fullFolderPath = path.join(base,folderName);
		if (fs.existsSync(fullFolderPath) === false) {
			console.error(`folder not found: ${fullFolderPath}`);
		}
		const files =  fs.readdirSync(fullFolderPath);
		if (!files) {
			console.log(`files is undefined`);
		}
		for (let i=0;i<files.length;i++) {
			try {
				const curFile = path.join(fullFolderPath,files[i]);
				if (fs.statSync(curFile).isDirectory()) {
					findFiles({
						base: fullFolderPath,
					    folderName: files[i],
						result,
						extensions
					});
				} else {
					const fileName = files[i];
					const fileExtension = fileName.split('.');
					if (fileExtension.length>0) {
						const ext = fileExtension[fileExtension.length-1];
						if (extensions.includes(ext)) {
							result.push(curFile);
						}
					}
				}
			} catch (err) {
				console.error(`findFiles:${err.messsage}`);
			}
		}
		return result;
	} catch (err) {
		console.error(`findFiles:${err.messsage}`);
	}
}
module.exports = { findFiles };