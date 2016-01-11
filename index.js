//sentence generator using express and mongodb
var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;

//sentence templates array - these make the nonsense text look more like real sentences
var sentenceTemplates = [];
//vocab object for part of speech arrays containing words - these populate the templates at random
var vocab = Object.create(null);

require('./seed.js');//recreate db - just for demo

//connect to database - url in app configs
	MongoClient.connect(process.env.DATABASE_URL, function(err, db) {
		//templates indicate sentence outline using parts of speech, e.g.
		//determiner noun verb determiner adjective noun
		var templateCollection = db.collection('sentences'); console.log("got sentences"+templateCollection.count());
		//get the collection as an array
		templateCollection.find({}).toArray(function(err, templateDocs) {
			if(err) { console.log(err); }//res.send("Oops!"); }
			//loop through and add to array
			templateDocs.forEach(function(doc) {
				sentenceTemplates.push(doc.sentence);
			});
			//get vocab collection
			var vocabCollection = db.collection('words');
			//get word arrays for each part of speech
			vocabCollection.find({}).toArray(function(err, vocabDocs) {
				if(err) { console.log(err); }//res.send("Oops!"); }
				//loop through and add to array
				vocabDocs.forEach(function(doc) {
					vocab[doc.pos] = doc.words;
				});
				//close the database connection
				db.close();
				});
		});
					
});		
app.listen(3000, function() {
    console.log("Listening...");
});

//app home page
app.get('/', function(req, res) { console.log("getting home");
	

				//try out some sentences and paragraphs
				res.send("<html><head><style type='text/css'>" +
					"body, html {width:70%; margin:auto; font-family:sans-serif; background:#000000; color:#ffffff; padding:5%;}" +
					"</style></head><body>" +
					"<h1>Sentence Generator DEMO</h1>" +
					"<p>" + getParagraph(10) + "</p>" +
					"<h2>" + getSentence() + "</h2>" +
					"<p>" + getParagraph(6) + "</p>" +
					"<p>" + getParagraph(8) + "</p>" +
					"<p><em>Built using MongoDB and Node.js via Compose and Heroku.</em></p>" +
					"</body></html>");
				});


//helper function to create sentence from data
function getSentence() {
	//pick a random template
	var template = sentenceTemplates[Math.floor(Math.random() * sentenceTemplates.length)];
	//split the template into parts of speech
	var sentencePOS = template.split(" ");
	//create word array
	var sentenceWords = [];
	//pick a random word in the correct part of speech for each place in the template
	sentencePOS.forEach(function(word) {
		sentenceWords.push(vocab[word][Math.floor(Math.random() * vocab[word].length)]);
	});
	var sentence = sentenceWords.join(" ");
	//make it look more like a normal sentence	
	return sentence.charAt(0).toUpperCase() + sentence.slice(1, sentence.length) + ".";
}

//get a specific number of sentences
function getParagraph(numSentences) {
	var i;
	var paragraph = "";
	for (i = 0; i < numSentences; i++) {
		paragraph += getSentence() + " ";
	}
	return paragraph;
}
