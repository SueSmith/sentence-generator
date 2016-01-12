//database client
var MongoClient = require('mongodb').MongoClient;
//file reader
var fs = require('fs');

//seed sentence generator database with data from json files

/*
Data:

	Sentence templates - these indicate common sentence structures using lists of parts of speech,
	e.g. The monkey types the lovely code.
	- structure: determiner noun determiner adjective noun
	
	Vocab - lists of words for each part of speech in the sentence templates,
	e.g. noun: monkey, man, woman, chair, wall
	- these will be populated into the template structures at random, creating nonsense sentences
	
*/

//connect to database
MongoClient.connect(process.env.DATABASE_URL, function(err, db) {
    if(err) console.log(err);
    else {
			db.collection('sentences').drop(); db.collection('words').drop(); //drop collections - just for demo
			//insert sentence templates
			insertData(db, 'sentences', function(sentenceResult){
				console.log("sentence result: %j"+sentenceResult);
				//insert vocab words
				insertData(db, 'words', function(wordResult){
					console.log("words result: %j"+wordResult);
					db.close();
				});
			});
		}
});

//helper function for data insertion
function insertData(db, name, callback){
	//create collection
	var newCollection = db.collection(name); 
	//read from json file
	fs.readFile(''+name+'.json', 'utf8', function(readErr, data) {
		if(readErr) console.log(readErr);
		else{
			//parse as json
			var json = JSON.parse(data);
			//insert as array
			newCollection.insertMany(json, function(insertErr, docs) {
				if(insertErr) console.log(insertErr);
				else callback(docs);
			});
		}
	});
}
