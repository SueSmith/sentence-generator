# Sentence Generator

This project is a random sentence generator to populate web pages with text that looks a bit more like real content than lorem ipsum. The app is built using node.js, with a MongoDB database hosted via Compose - you can see it in action on Heroku: [Sentence Generator DEMO](https://give-me-sentences.herokuapp.com/)

* The [seed.js](seed.js) script populates the database with sentence template and vocab data from two JSON files ([sentences.json](sentences.json) and [words.json](words.json)).
* The [index.js](index.js) script runs the generator, writing a demo out to a web page using Express.
