const sha256 = require('sha256');
const { readFileLines } = require('./readFileLines');
const { zipLines } = require('./zipLines');
function LineMap({
	map,
	fileName,
	duplicates,
	mapLines
}) {
	try {
		const rawLines = readFileLines({fileName});
		let preHash = null;
		let cnt = -1;
		const mapLineHash = new Map();
		for (let i=0;i<rawLines.length;i++) {
			const line = zipLines({line:rawLines[i]});
			if (line.length > 0) {
				cnt++;
				const hash = sha256(line);
				const curLine = {
					file: fileName,
					index: cnt,
					line,
					length: line.length,
					hash,
					preHash
				};
				if (map.has(hash)) {
					const cur = map.get(hash);
					cur.push(curLine);
					map.set(hash,cur);
					duplicates.push(curLine);
				} else {
					map.set(hash,[curLine]);
				}
				mapLineHash.set(cnt,hash);
				preHash = hash;
			}
		}
		mapLines.set(fileName,mapLineHash);
		return rawLines;
	} catch (err) {
		console.error(`LineMap:${err.messsage}`);
	}
}
module.exports = { LineMap };
