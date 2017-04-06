// required modules and files
var Twitter = require('twitter');
var twitterKeys = require('./keys');
var spotify = require('spotify');
var request = require("request");
var fs = require("fs");
var cmd = require('node-cmd');
// creates an instance of Twitter to make our Twitter call
var client = new Twitter(twitterKeys.twitterKeys);
// variables hold the process.argv array and creates a searchValue for selected function
var nodeArgs = process.argv;
var searchValue = "";

for (var i = 3; i < nodeArgs.length; i++) {
    if (i > 3 && i < nodeArgs.length) {
        searchValue += "+" + nodeArgs[i];
    } else {
        searchValue += nodeArgs[i];
    }
}

// switch statement selects function based on user input
switch (process.argv[2]) {
    case "my-tweets":
        myTweets();
        break;
    case "spotify-this-song":
        spotifyThisSong(searchValue);
        break;
    case "movie-this":
        movieThis(searchValue)
        break;
    case "do-what-it-says":
        doWhatItSays();
        break;
    default:
        console.log("Enter an argument to execute a function:\nmy-tweets, spotify-this-song, movie-this or do-what-it-says");
}

// myTweets function makes call to Twitter
function myTweets() {
    // twitter parameter to make get request
    var params = {
        screen_name: 'mz1387'
    };
    // get request. console log response properties
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            for (var i = 0; i < tweets.length; i++) {
                console.log("---------------------");
                console.log("Location: " + tweets[i].user.location);
                console.log("Created: " + tweets[i].created_at);
                console.log("Message: " + tweets[i].text);
                console.log("---------------------");
            }
        }
    });
}

// spotifyThisSong function makes call to spotify. Takes in song parameter
function spotifyThisSong(song) {

    // if no song is input default to 'The Sign' by Ace of Base
    if (song === '') {
        spotify.search({
            type: 'track',
            query: 'The Sign'
        }, function(err, data) {
            if (err) {
                console.log('Error occurred: ' + err);
                return;
            } else {
                var spotifyObject = data.tracks.items

                console.log("---------------------");
                console.log("Artist: " + spotifyObject[2].album.artists[0].name);
                console.log("Song Name: " + spotifyObject[2].name);
                console.log("Preview Link: " + spotifyObject[2].external_urls.spotify);
                console.log("Album: " + spotifyObject[2].album.name);
                console.log("---------------------");
            }
        });
    } else {
        // spotify method makes search request and console logs data properties
        spotify.search({
            type: 'track',
            query: song
        }, function(err, data) {
            if (err) {
                console.log('Error occurred: ' + err);
                return;
            } else {
                var spotifyObject = data.tracks.items
                for (var i = 0; i < spotifyObject.length; i++) {
                    console.log("---------------------");
                    console.log("Artist: " + spotifyObject[i].album.artists[0].name);
                    console.log("Song Name: " + spotifyObject[i].name);
                    console.log("Preview Link: " + spotifyObject[i].external_urls.spotify);
                    console.log("Album: " + spotifyObject[i].album.name);
                    console.log("---------------------");
                }
            }
        });
    }
}

// movieThis function makes call to omdb. Takes in movie parameter
function movieThis(movie) {
    // if no movie is input default to 'Mr. Nobody.'
    if (movie === '') {
        movie = 'Mr. Nobody.';
    }
    // request parameter to make omdb request
    var queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&r=json";

    // request method makes request and console logs response properties
    request(queryUrl, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log("--------------------------------");
            console.log("Title: " + JSON.parse(body).Title);
            console.log("Released: " + JSON.parse(body).Year);
            console.log("Rating: " + JSON.parse(body).imdbRating);
            console.log("Produced In: " + JSON.parse(body).Country);
            console.log("Language(s): " + JSON.parse(body).Language);
            console.log("Actors: " + JSON.parse(body).Actors);
            console.log("Plot: " + JSON.parse(body).Plot);
            console.log("--------------------------------");
        }
    });
}

// doWhatItSays function reads random.txt and executes a function
function doWhatItSays() {
    // readFile method reads random.txt and returns back the file's data
    fs.readFile("random.txt", "utf8", function(error, data) {
        // variables take in string from random.txt and create an array with the function and search property
        var dataArr = data.split(",");
        var search = dataArr[1];

        switch (dataArr[0]) {
            case "my-tweets":
                myTweets();
                break;
            case "spotify-this-song":
                spotifyThisSong(search);
                break;
            case "movie-this":
                movieThis(search);
        }
    });
}
