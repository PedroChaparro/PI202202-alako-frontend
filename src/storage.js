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
		hist.push(entry.toLowerCase());

		// unique entries
		const newHist = hist.filter((item, index) => hist.indexOf(item) === index);
		const cookie = {
			entries: newHist
		}

		// save cookie
		document.cookie = JSON.stringify(cookie) +
			"; SameSite=Strict; expires=Tue, 19 Jan 2038 03:14:07 UTC";
	}
}
