# :cat: Cat Simulator Bot [![Build Status](https://travis-ci.org/snollygolly/cat-simulator-bot.svg?branch=master)](https://travis-ci.org/snollygolly/cat-simulator-bot)
A hyper realistic cat simulator made to be interacted with via IRC.

## Prerequisites
* [Node.js](https://nodejs.org/en/) (Version 6 and up required)
* A nickname registered on [snoonet](https://snoonet.org/)
* [CouchDB](http://couchdb.apache.org/)

### Installation

* Clone down the repository.
```
git clone https://github.com/snollygolly/cat-simulator-bot.git
```

* Install packages (from inside the cat-simulator-bot folder).
```
npm install
```

* [Install CouchDB](http://docs.couchdb.org/en/2.0.0/install/index.html)

* Create two new databases in couch, cat-games, and cat-players

* Edit your config `data/config.json` to reflect your personal settings

* Start it up.
```
npm start
```

* Enjoy!

### Tests

Simply run the following to run all test and lint:
```
npm test
```
