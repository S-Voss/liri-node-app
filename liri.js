//Use the require function to include the Twitter NPM export and the Keys
var Twitter = require('twitter');

//Use the require function to include all exports from 'keys.js'
var keysList = require("./keys.js");

var client = new Twitter({
    consumer_key: keysList.twitterKeys.consumer_key,
    consumer_secret: keysList.twitterKeys.consumer_secret,
    access_token_key: keysList.twitterKeys.access_token_key,
    access_token_secret: keysList.twitterKeys.access_token_secret
});

//Use the require function to include the Spotify NPM export and the Keys
var Spotify = require('node-spotify-api');

var spotify = new Spotify({
  id: '289acbe6bc5a45a99ae718c441c35f74',
  secret: '78e613083d8e433fa10113a47c587d3c'
});

//Use the require function to include the request NPM export
var request = require('request');

//Use the require function to include the fs
var fs = require("fs");

//Declare variables to take in user commands
var userCommands = process.argv[2];
var searchQuery = process.argv[3];

//Logic running the various NPM packages running the function related to the command given
function appLogic(userCommands, searchQuery) {  

    switch (userCommands) {
        case "my-tweets":
        myTweets(searchQuery);
        break;

        case "spotify-this-song":
        spotifyThisSong(searchQuery);
        break;

        case "movie-this":
        movieThis(searchQuery);
        break;

        case "do-what-it-says":
        doWhatItSays();
        break;
    };
};

appLogic(userCommands, searchQuery);

//The my-tweets function
function myTweets() {
    client.get('statuses/user_timeline', {screen_name: 'mcstephee24'}, function(error, tweets, response) {
        if(error) throw error;

        for (var i = 0; i < tweets.length; i++){
            console.log(tweets[i].created_at, tweets[i].text);
        };
    });
};

//The spotify-this-song function
function spotifyThisSong() {
    spotify.search({ type: 'track', query: searchQuery }).then(function(response) {
        //Log out the API calls returned data
        console.log("-------------------------");
        console.log("Artist: " + response.tracks.items[1].artists[0].name);
        console.log("-------------------------");
        console.log("Song Name: " + response.tracks.items[1].name);
        console.log("-------------------------");
        console.log("A preview link of the song from Spotify: " + response.tracks.items[3].preview_url);
        console.log("-------------------------");          
        console.log(response.tracks.items[0].album.name);
    }).catch(function(err){
        return console.log('Error occurred: ' + err);
    });
};

//The movie-this function
function movieThis(searchQuery) {
    var queryURL = "http://www.omdbapi.com/?t=" + searchQuery + "&y=&plot=short&apikey=40e9cece";
    console.log(queryURL);

    request(queryURL, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log("Title: " + JSON.parse(body).Title);
            console.log("-------------------------");
            console.log("Release Year: " + JSON.parse(body).Year);
            console.log("-------------------------");
            console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
            console.log("-------------------------");
            console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1]);
            console.log("-------------------------");
            console.log("Country Where Movie was Produced: " + JSON.parse(body).Country);
            console.log("-------------------------");
            console.log("Language: " + JSON.parse(body).Language);
            console.log("-------------------------");
            console.log("Plot: " + JSON.parse(body).Plot);
            console.log("-------------------------");
            console.log("Actors: " + JSON.parse(body).Actors);
        };
    });
};

//The do-what-it-says function
function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function(error, data) {
        // If the code experiences any errors it will log the error to the console.
        if (error) {
            return console.log(error);
        }
        //If no error...split the data returned into an array
        var dataArr = data.split(",");

        console.log(dataArr);

        userCommands = dataArr[0];
        searchQuery = dataArr[1];
        appLogic(userCommands, searchQuery);
    });
};