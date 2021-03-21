import fillingEquipmentList from './Character2e.js'

const papaConfig = {
	delimiter: "",	// auto-detect
	newline: "",	// auto-detect
	quoteChar: '"',
	escapeChar: '"',
	header: true,
	transformHeader: undefined,
	dynamicTyping: false,
	preview: 0,
	encoding: "",
	worker: true,
	comments: false,
	step: undefined,
	complete: undefined,
	error: undefined,
	download: true,
	downloadRequestHeaders: undefined,
	downloadRequestBody: undefined,
	skipEmptyLines: false,
	chunk: undefined,
	chunkSize: undefined,
	fastMode: undefined,
	beforeFirstChunk: undefined,
	withCredentials: undefined,
	transform: undefined,
	delimitersToGuess: [',', '\t', '|', ';', Papa.RECORD_SEP, Papa.UNIT_SEP]
}

Papa.parse('https://docs.google.com/spreadsheets/d/e/2PACX-1vQGecvX3EBMdZq1sgFnUxKxeYzMnVAiaL9prMak-kcoH3UxTaftWAtyI8kMrcqruF4lioRyCzJmIWj2/pubhtml', papaConfig, fillingEquipmentList(armorListJSON))