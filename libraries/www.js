let RECENT_RESULT = {};

// 		+---------------------+
// 		|    World Wide Web   |
// 		|       Library       |
// 		+---------------------+
//               |
//                \_ by EthanThatOneKid

class WWW {
	static redirect(url, fn) {
		if (fn) {
			fn();
		}
		window.location.href = url;
	}
	static reload(url) {
		location.reload();
	}
	static randomString(len) {
		let result = "";
		let possible = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
		for (let i = 0; i < len; i++) {
			let rndIndex = Math.floor(Math.random() * possible.length);
			result += possible[rndIndex];
		}
		return result;
	}
	static uniqueID(len_ = new Date().valueOf().toString().length) {
		let len = (len_ > new Date().valueOf().toString().length) ? new Date().valueOf().toString().length : len_;
		let d = new Date().valueOf().toString();
		let i = d.length - len;
		d = d.substring(i);
		return d;
	}
	static cls() {
		let curr = window.location.href;
		curr = curr.split("?")[0];
		window.location.href = curr;
	}
	static objectToQuery(obj) {
		let entries = Object.entries(obj);
		let query = "?";
		for (let i = 0; i < entries.length; i++) {
			query += entries[i][0] + "=" + entries[i][1];
			query += (i == entries.length - 1) ? "" : "&";
		}
		return query;
	}
	static reloadWithInputs(obj) {
		let query = WWW.objectToQuery(obj);
		let a = window.location.toString() + query;
		window.location.href = a;
	}
	static getUrlVariables() {
		let query = window.location.search.substring(1);
		let vars = query.split('&');
		let result = {}, pair;
		for (let i = 0; i < vars.length; i++) {
			pair = vars[i].split('=');
			result[pair[0]] = pair[1];
		}
		return result;
	}
	static hasUrlVariables() {
		return JSON.stringify(WWW.getUrlVariables()) !== "{}";
	}
	static readCookie() {
		let cookieArr = document.cookie.split(';');
		let cookie = {};
		for (var i = 0; i < cookieArr.length; i++) {
			let gimmeCookie = cookieArr[i].trim();
			gimmeCookie = gimmeCookie.split('=');
			cookie[gimmeCookie[0]] = gimmeCookie[1];
		}
		return cookie;
	}
	static writeCookie(obj) {
		var entries = Object.entries(obj);
		var cookie = '';
		for (var i = 0; i < entries.length - 1; i++) {
			var gimmeString =  entries[i][0] + '=' + entries[i][1] + ';';
			cookie += gimmeString;
		}
		document.cookie = cookie;
	}
	static copyObject(obj) {
		return JSON.parse(JSON.stringify(obj));
	}
	static waitTillRecentUpdate(fn) {
		return new Promise((resolve, reject) => {
			let prev = JSON.stringify(RECENT_RESULT), next;
			for (let i = 0; i < 1e7; i++) {
				next = JSON.stringify(RECENT_RESULT);
				if (next === prev) {
					fn();
					resolve(RECENT_RESULT);
				}
			}
		});
	}
	static sleep(millis) {
		let start = new Date().getTime();
		for (let i = 0; i < 1e7; i++) {
			if ((new Date().getTime() - start) > millis) {
				break;
			}
		}
	}
	static pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
	}
	static wait(millis, callback) {
		setTimeout(callback, millis);
	}
	static allowEditability(id) {
		if (id) {
			document.getElementById(id).contentEditable = true;
			return;
		}
		document.body.contentEditable = true;
	}
	static p5Exists() {
		try {
			if (p5) {return true;} else {return false;}
		} catch(err) {
				return false;
		}
	}
	static RiTaExists() {
		try {
			if (RiTa) {return true;} else {return false;}
		} catch(err) {
				return false;
		}
	}
}

// 		+---------------------+
// 		|      Database       |
// 		|        Class        |
// 		+---------------------+
//               |
//                \_ by EthanThatOneKid
//                 \_ for firebase databases

class Database {
	constructor(id = WWW.randomString(10)) {
		this.test_element_id = id;
		this.recentResult = RECENT_RESULT;
		let elt = document.createElement("div");
		elt.id = this.test_element_id;
		elt.style.display = "none";
		try {
			document.getElementsByTagName("body")[0].appendChild(elt);
		} catch (err) {
			console.log("Cannot place elt there; " + err);
		}
	}
	updateRecentResult() {
		this.recentResult = RECENT_RESULT;
	}
	set(path, obj) {
		return firebase.database().ref(path).set(obj);
	}
	getFirebaseData(path, fn = {}) {
		let id = this.test_element_id;
		return Database.getFirebaseData(path, id, fn).then(function() {
			let str = document.getElementById(id).innerHTML;
			try {
				RECENT_RESULT = JSON.parse(str);
			} catch(err) {
				console.error("Firebase Data !> RECENT_RESULT");
			}
		});
	}
	getMultipleFirebaseDatas(paths) {
		let result = [];
		return new Promise((resolve, reject) => {
			for (let i = 0; i < paths.length; i++) {
				this.getFirebaseData(paths[i], {
					"exists": function(x) {
						result.push(x);
					},
					"absent": function() {
						result.push(undefined);
					}
				}).then(function() {
					if (result.length >= paths.length) {
						resolve(result);
					}
				});
			}
		});
	}
	static getFirebaseData(path, id, fn) {
		return firebase.database().ref(path).once("value").then(function(data) {
			if (!data.exists()) {
				console.log("Data does not exist for this directory.");
				if (fn.absent) {fn.absent();}
				return;
			}
			let result = JSON.stringify(data.val());
			document.getElementById(id).innerHTML = result;
			if (fn.exists) {fn.exists(data.val());}
			console.log("Firebase data => RECENT_RESULT");
		});
	}
}

// 		+---------------------+
// 		|      Wikipedia      |
// 		|        Class        |
// 		+---------------------+
//               |
//                \_ by EthanThatOneKid
//                 \_ for Wikipedia API

class Wiki {
	constructor() {
		this.url = "https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=";
		this.recent = "";
		this.response = "";
		this.loader = new Loader();
	}
	ask(q) {
		return this.query(q).then(function() {
      let data = Object.values(RECENT_RESULT);
			let questions = Wiki.allFormsOfWord("is");
			let d = data[2];
			for (let i = 0; i < d.length; i++) {
				for (let j = 0; j < questions.length; j++) {
					let index = d[i].indexOf(questions[j]);
					if (index > -1) {
						let clause = d[i].slice(index).split(".")[0];
						let result = RiTa.untokenize([q, clause, "."]);
						return result;
					}
				}
			}
			return "I have no clue what that is..";
		});
	}
	query(q) {
		if (!WWW.p5Exists()) {console.log("Wiki class requires p5.js!");return;}
		let url = this.url + q;
		return this.loader.loadJSON(url);
	}
	static allFormsOfWord(word) {
		if (!WWW.RiTaExists()) {console.log("Wiki class requires RiTa.js!");return;}
  	let result = [];
  	for (let i = 6; i >= 3; i--) {
    	for (let j = 9; j >= 7; j--) {
      	for (let k = 3; k >= 1; k--) {
        	let gimme = RiTa.conjugate(word, {"tense": i,"number": j,"person": k});
        	if (!result.includes(gimme)) {
          	result.push(gimme);
        	}
      	}
    	}
  	}
  	return result;
	}
}

// 		+---------------------+
// 		|     JSON Loader     |
// 		|        Class        |
// 		+---------------------+
//               |
//                \_ by EthanThatOneKid
//                 \_ for p5.js

class Loader {
	constructor() {
		this.p = (WWW.p5Exists()) ? new p5() : null;
		this.data = {};
	}
	loadJSON(url) {
		return new Promise((resolve, reject) => {
			try {
			let data = this.p.loadJSON(url, function() {
				RECENT_RESULT = data;
				console.log(url + " Data => RECENT_RESULT");
				resolve(data);
			}); //, "jsonp");
		} catch(err) {
			console.error(url + " Data !> RECENT_RESULT");
		}
		});
	}
	saveJS(str, name) {
		this.p.saveStrings(str, name + ".js", "js");
	}
	saveTXT(arr, name) {
		this.p.save(arr, name + ".txt");
	}
}

// 		+---------------------+
// 		|      Dictionary     |
// 		|        Class        |
// 		+---------------------+
//               |
//                \_ by EthanThatOneKid
//                 \_ for Wordnik Api

class Dictionary {
	constructor(apiKey) {
		this.url = "http://api.wordnik.com:80/v4/words.json/";
		this.key = apiKey || "a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5";
		this.loader = new Loader();
		this.data = {};
	}
	randomWord(part = "noun") {
		let url = this.url + "randomWord?includePartOfSpeech=" + part;
		url += "&minCorpusCount=100000&maxCorpusCount=-1&minLength=1&maxLength=-1&api_key=" + this.key;
		return this.loader.loadJSON(url);
	}
}

// 		+---------------------+
// 		|      Radio Form     |
// 		|        Class        |
// 		+---------------------+
//               |
//                \_ by EthanThatOneKid
//                 \_ for HTML

class Radio {
	constructor(list, id) {
		this.id = id || "radio-container";
		this.list = list;
		this.html = "";
		this.init();
	}
	init() {
		this.html = "<ul style=\"list-style-type:none;\">";
		for (let i = 0; i < this.list.length; i++) {
			this.html += "<li style=\"display:inline;\">";
			this.html += "<input type=\"radio\" value=\"" + this.list[i] + "\" onchange=\"Radio.updateList(" + this.list.length + "," + i + ")\" id=\"radio" + i + "\">";
			this.html += "<label>" + this.list[i] + "</label>";
			this.html += "</li>";
		}
		this.html += "</ul>";
		document.getElementById(this.id).innerHTML = this.html;
	}
	selected() {
		let results = [];
		for (let i = 0; i < this.list.length; i++) {
			let r = document.getElementById("radio"+i);
			if (r.checked) {
				results.push(r.value);
			}
		}
		return results;
	}
	somethingIsSelected() {
		for (let i = 0; i < this.list.length; i++) {
			let r = document.getElementById("radio"+i);
			if (r.checked) {
				return true;
			}
		}
		return false;
	}
	static updateList(len, selectedIndex) {
		for (let i = 0; i < len; i++) {
			if (selectedIndex == i) {
				document.getElementById("radio"+i).checked = true;
			} else {
				document.getElementById("radio"+i).checked = false;
			}
		}
	}
}

// 		+---------------------+
// 		|       Helmsman      |
// 		|        Class        |
// 		+---------------------+
//               |
//                \_ by EthanThatOneKid
//                 \_ for Dbip API

class Helmsman {
	constructor(apiKey) {
		this.url = "http://api.db-ip.com/";
		this.key = apiKey || "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
		this.loader = new Loader();
		this.data = {};
	}
	self() {
		let url = this.url + "v2/free/self";
		return this.loader.loadJSON(url);
	}
}

// 		+---------------------+
// 		|        Voice        |
// 		|        Class        |
// 		+---------------------+
//               |
//                \_ by EthanThatOneKid
//                 \_ for p5.speech.js

class Voice {
	constructor() {
		this.voice = (WWW.p5Exists()) ? new p5.Speech() : null;
	}
	speak(phrase) {
		this.voice.speak(phrase);
	}
}

// 		+---------------------+
// 		|    Weather Master   |
// 		|        Class        |
// 		+---------------------+
//               |
//                \_ by EthanThatOneKid
//                 \_ for OpenWeatherMap API

class WeatherMaster {
	constructor(apiKey) {
		this.url = "http://api.openweathermap.org/data/2.5/weather";
		this.key = apiKey || "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
	}
	weatherHere() {
		let root = this.url, apiKey = this.key;
		navigator.geolocation.getCurrentPosition(function(pos) {
			let loader = new Loader();
			let url = root + "?lat=" + pos.coords.latitude + "&lon=" + pos.coords.longitude + "&apiKey=" + apiKey;
			return loader.loadJSON(url);
		});

	}
	weather(location) {
		return "location: " + location;
	}
}
