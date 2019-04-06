function search(){
	const keyword = document.getElementById("keyword").value;
	 console.log(keyword);
	 
	 console.log(goodreadsAPIKey);
	 //const url = 
	 //get results from API using fetch
	 const endpoint = 'https://www.goodreads.com/search/index.xml';
	 const corsanywhere = 'https://cors-anywhere.herokuapp.com/'
	 const url = corsanywhere + endpoint + '?key=' + goodreadsAPIKey + "&q=" + keyword;
	 fetch(url)
	 .then(function(response){
	 	console.log(response)
	 	return response.text();
	 }).then(function(data){
	 		const parser = new DOMParser();
	 		const parsedRes = parser.parseFromString(data, "text/xml");
	 		const parsedJson = xmlToJson(parsedRes);
	 		console.log(parsedJson);
	 		
	 		//callback function because only if the mother function does something
	 		displayResults(parsedJson)
	 });
	 ////Display results on page as a list (<li></li>)
	 ////document.getElementById("results").innerHTML = "<li> item1 </li><li> item2 </li>"
	 //const myList = document.createElement("li");
	 ////can now call it like an html element this is why you can call li.innerHTML
	 //myList.innerHTML = "item 1";
	 //document.getElementById("results").appendChild(myList);
}

//display results on page as a list
function displayResults(responseObj) {
	// console.log("calling inside displayResults", responseObj);
	//get properties inside an object use . notation
	const works = responseObj.GoodreadsResponse.search.results.work;
	//when searching for books a second time it clears the 
	document.getElementById("results").innerHTML = ""
	works.forEach(function(work){
		// console.log(work);
		const author = work.best_book.author.name["#text"];
		const title = work.best_book.title["#text"];
		const imgUrl = work.best_book.image_url["#text"];
		console.log("title:", title + ", Author:", author + ", Bookcover", imgUrl);
		
		const myListItem = document.createElement("li");
		const image = document.createElement("img");
		image.setAttribute("src", imgUrl);
		
		myListItem.innerHTML = title + " by " + author;
		myListItem.appendChild(image);
		document.getElementById("results").appendChild(myListItem);
	
	});
}
// Changes XML to JSON
// https://davidwalsh.name/convert-xml-json
function xmlToJson(xml) {
	
	// Create the return object
	var obj = {};

	if (xml.nodeType == 1) { // element
		// do attributes
		if (xml.attributes.length > 0) {
		obj["@attributes"] = {};
			for (var j = 0; j < xml.attributes.length; j++) {
				var attribute = xml.attributes.item(j);
				obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
			}
		}
	} else if (xml.nodeType == 3) { // text
		obj = xml.nodeValue;
	}

	// do children
	if (xml.hasChildNodes()) {
		for(var i = 0; i < xml.childNodes.length; i++) {
			var item = xml.childNodes.item(i);
			var nodeName = item.nodeName;
			if (typeof(obj[nodeName]) == "undefined") {
				obj[nodeName] = xmlToJson(item);
			} else {
				if (typeof(obj[nodeName].push) == "undefined") {
					var old = obj[nodeName];
					obj[nodeName] = [];
					obj[nodeName].push(old);
				}
				obj[nodeName].push(xmlToJson(item));
			}
		}
	}
	return obj;
};