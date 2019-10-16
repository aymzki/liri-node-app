require("dotenv").config();

//all variables
var keys = require("./keys.js");
var fs = require("fs");
var request = require("request");
var Spotify = require('node-spotify-api');
var axios = require("axios");
//make log.txt file
var filename = './log.txt';
//NPM module used to write output to console and log.txt simulatneously
var log = require('simple-node-logger').createSimpleFileLogger(filename);
log.setLevel('all');


//fetch Spotify keys
var spotify = new Spotify(keys.spotify);

//argv[2] is the command, argv[3] is input parameter ie. song 
var command = process.argv[2];
var searchFor = process.argv[3];

//concatenate multiple words in input parameter
for (var i = 4; i < process.argv.length; i++) {
    searchFor += '+' + process.argv[i];
}

//switch command
function mySwitch(command) {

    //choose which command to switch to and execute
    switch (command) {

        case "concert-this":
            concertThis();
            break;

        case "spotify-this-song":
            spotifyThis();
            break;

        case "movie-this":
            movieThis();
            break;

        case "do-what-it-says":
            doWhat();
            break;

        default:
            console.log("{Please enter any of the following commands: concert-this, spotify-this-song, movie-this, do-what-it-says}");
            break;
    }
}

function concertThis() {
    //concert-this
    //use BandsInTown API to get name of venue, venue location, date of event
    var artist = searchFor;
    var bandsUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
    console.log(bandsUrl);
    //run request with axios to BandsInTown API
    axios.get(bandsUrl).then(
        function (response) {
            // If the request is successful = 200
            if (!error && response.statusCode === 200) {
                var body = JSON.parse(body);

                //Simultaneously output to console and log.txt via NPM simple-node-logger
                log('================ Movie Info ================');
                logO("Title: " + body.Title);
                logOutput("Release Year: " + body.Year);
                logOutput("IMdB Rating: " + body.imdbRating);
                logOutput("Rotten Tomatoes Rating: " + body.Ratings[2].Value);
                logOutput("Country: " + body.Country);
                logOutput("Language: " + body.Language);
                logOutput("Plot: " + body.Plot);
                logOutput("Actors: " + body.Actors);
                logOutput('==================END Movie Info=================');

            } else {
                console.log("There has been an error", error.message);
            }
        }
    );
}

//spotify-this-song
function spotifyThis(song) {
    if (!song) {
        song = "The Sign";
    }

    spotify.search(
        {
            type: "track",
            query: song
        },
        function (err, data) {
            if (err) {
                console.log("Error occurred: " + err);
                return;
            }

            var songData = data.tracks.items;
            //console.log(songData);
            //console.log(songData[0]);
            for (var i = 0; i < songData.length; i++) {
                console.log("Artist: " + songData[i].artists[0]);
                console.log("Song: " + songData[i].name);
                console.log("Preview URL: " + songData[i].preview_url);
                console.log("Album: " + songData[i].album.name);
                console.log("----------------------------");

                //adds text to log.txt
                // fs.appendFile('log.txt', songData.artists[0].name);
                // fs.appendFile('log.txt', songData.name);
                // fs.appendFile('log.txt', songData.preview_url);
                // fs.appendFile('log.txt', songData.album.name);
                // fs.appendFile('log.txt', "-----------------------");
            }
        });
}

//OMDB Movie command: movie-this
//include the axios npm package (Don't forget to run "npm install axios" in this folder first!)
function movieThis() {
    var movieName = searchFor;
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&apikey=trilogy";

    // test queryUrl
    console.log(queryUrl);

    //if no input
    if (!movieName) {
        movieName = "Mr. Nobody"
        console.log("-----------------------");
        console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
        console.log("It's on Netflix!");
    }


    //run a request with axios to OMDB API 
    axios.get(queryUrl).then(

        function (response) {
            var body = (response.data);

            //Simultaneously output to console and log.txt via NPM simple-node-logger
            console.log('================ Movie Info ================');
            console.log("Title: " + body.Title);
            console.log("Release Year: " + body.Year);
            console.log("IMdB Rating: " + body.imdbRating);
            console.log("Rotten Tomatoes Rating: " + body.Ratings[0].Value);
            console.log("Country: " + body.Country);
            console.log("Language: " + body.Language);
            console.log("Plot: " + body.Plot);
            console.log("Actors: " + body.Actors);
            console.log('==================END Movie Info=================');
        })
        .catch(function (error) { console.log(error) })

}


// For command: do-what-it-says
// takes text inside of random.txt then use it to call one of LIRI's commands

function doWhat() {
    // Read random.txt file
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error);
        console.log(data.toString());
        //split text with comma 
        var cmds = data.toString().split(',');
    });
}

//call command at the end
mySwitch(command);
