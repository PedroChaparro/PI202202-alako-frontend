export default class SearchHistory{
	constructor(){
	}

	// returns history if found, empty history otherwise
	static getAll(){
		let history;
		const savedCookies = document.cookie;

		if (!savedCookies){
			history = {
				entries: []
			};
		}
		else{
			history = JSON.parse(savedCookies);
		}

		return history;
	}

	// saves a new history
	static saveEntry(entry){
		const hist = SearchHistory.getAll().entries;
		hist.push(entry);

		// unique entries
		let newHist = hist.filter((item, index) => hist.indexOf(item) === index);

		// max length 10 in cookie
		if (newHist.length > 10) {
			newHist = newHist.slice(1,11)
		}

		const cookie = {
			entries: newHist
		}

		// save cookie
		document.cookie = JSON.stringify(cookie);
	}
}
