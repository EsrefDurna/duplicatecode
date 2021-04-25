const { findFiles  } = require('./filesystem/findFiles');
const { LineMap } = require('./filesystem/LineMap');
const { readFileLines } = require('./filesystem/readFileLines');
const { zipLines } = require('./filesystem/zipLines');
function getFileHash({mapLines, file, index}) {
	if (mapLines.has(file)) {
		const curMapFile = mapLines.get(file);
		if (curMapFile.has(index)) {
			const hash =  curMapFile.get(index);
			return hash;
		}
	}
	return null;
}
function duplicateLength({ map,duplicate,mapLines,result, cache}) {
	try {
		let arr = map.get(duplicate.hash);
		let curIndex  = duplicate.index;
		let curHash = duplicate.hash;
		let counter = 0;
		const getMemoryKey = (memArr)=> {
			memArr.sort((a,b)=> {
				if (a.file === b.file) {
					if (a.index === b.index) {
						//console.error('shouldnt be happening');
						return 0;
					}
					return a.index-b.index;
				}
				return a.file-b.file;
			});
			const memoryKeyArr =  memArr.map(d=>`${d.file}:${d.index}`);
			const memoryKey = memoryKeyArr.join('#');
			return memoryKey;
		};
		const curCachehArr = map.get(curHash);
		const CurrentMemKey = getMemoryKey(curCachehArr);
		if (cache.has(CurrentMemKey)) {
			return;
		}
		while ( curIndex >=0 ) {
			counter++;
			const previousLineArr = map.get(curHash);
			if (!previousLineArr || previousLineArr.length  < 2) {
				break;
			}
			const nextArr = [];
			for (let i=0;i<previousLineArr.length;i++) {
				const preLine = previousLineArr[i];
				for (let t=0;t<arr.length;t++) {
					const cur = arr[t];
					if (counter === 1 || 
						(cur.file === preLine.file && cur.index=== preLine.index+1)) {
						nextArr.push(preLine);
						break;
					}
				}
			}
			const memKey = getMemoryKey(nextArr);
			if (cache.has(memKey)) {
				const cached = cache.get(memKey);
				curIndex = cached.index;
				counter+=cached.cnt-1;
				break;
			}
			arr = nextArr;
			curIndex--;
			curHash = getFileHash({mapLines,file:duplicate.file,index:curIndex});
		}
		const curResult = { cnt: counter,index: curIndex+1, file: duplicate.file};
		cache.set(CurrentMemKey, curResult);
		result.push(curResult);
	} catch (err) {
		console.error(`duplicateLength:${err.message}`);
	}
}
function findDuplicateCode({folder, extensions='js',
	startsWith= '', 
	MAX_SCAN_SIZE= 10000, TOP_RESULTS= 100}) {
	const cache = new Map();
	const base = process.cwd();
	const res = findFiles({base, folderName: folder, extensionsStr:extensions});
	const map = new Map();
	const mapLines = new Map();
	const duplicates = [];
	for (let i=0;i<res.length&& i < MAX_SCAN_SIZE;i++) {
		LineMap({fileName:res[i],map,duplicates,mapLines});
	}
	const result = [];
	console.log(`found ${duplicates.length} duplicates.`);
	for (let i=0;i<duplicates.length;i++) {
		const duplicate = duplicates[i];
		const percent = (100*i/duplicates.length).toFixed(0);
		if (percent > 0 && percent % 5=== 0) {
			console.log(`Scanned: ${percent}%`);
		}
		duplicateLength({map,duplicate,mapLines,result,cache});
	}
	let printed = 0;
	console.log(`longest top: ${TOP_RESULTS} duplicated.`);
	const sorted = result.filter(d=>d.cnt > 3).sort((a,b)=>b.cnt - a.cnt);
	for (let i=0;printed < TOP_RESULTS&& i<sorted.length;i++) {
		const curResult = sorted[i];
		const lines = readFileLines({fileName: curResult.file});
		const start = curResult.index;
		let end = curResult.index+curResult.cnt+1;
		const firstLine = lines[start];
		if (startsWith && startsWith.length > 0 && firstLine.indexOf(startsWith) < 0) {
			continue;
		}
		console.log('--------------------------------');
		printed++;
		for (let t=start;t<lines.length && t<= end;t++) {
			const line = zipLines({line:lines[i]});
			if (!line || line.length === 0) {
				end++;
			}
			console.log(lines[t]);
		}
	}
	console.log('Finished.');
}
module.exports = {
	findDuplicateCode
};