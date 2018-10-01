var dotenv = require("dotenv").config();
var keys = require("./keys");
var Spotify = require("node-spotify-api");
var moment = require('moment');
var request = require('request');
var fs = require("fs");
var spotify = new Spotify({
    id: keys.spotify.id,
    secret: keys.spotify.secret
});
var proc = process.argv[2]; // this takes in the values "do-what-it-says", "movie-this", "spotify-this-song", "concert-this"

var info = '';

// for multiple worded responses
for (var i = 3; i < process.argv.length; i++) {
    if (i > 3) {
        info = info + "+" + process.argv[i];
    } else {
        info = process.argv[3];
    }
};

console.log(info);

if (proc === "movie-this") {
    //does movie function
    if (!info) {
        movie("Mr.Nobody");
    } else {
        movie(info);
    }
}
if (proc === "do-what-it-says") {
    //reads  text from a file and adds it to the console
    things();
}
if (proc === "spotify-this-song") {
    //does the song function
    if (!info) {
        music("The Sign Ace of Base");
    } else {
        music(info);
    }
}
if (proc === "concert-this") {
    //does the concert function
    concert(info);
}

// movie function 
function movie(info) {
    var movie = info;
    request("http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy", function (error, response, body) {
        if (!error && response.statusCode === 200) {
            var result = JSON.parse(body);
            var movieArr = [
                "Title: " + result.Title,
                "Year: " + result.Year,
                "IMDB rating: " + result.imdbRating,
                "ratingTomatoes: " + result.Ratings[1].Value,
                "Country: " + result.Country,
                "Languages: " + result.Language,
                "Plot: " + result.Plot,
                "Actors: " + result.Actors,
            ].join('\n');
            console.log(movieArr);
        } else {
            console.log(error);
        }
    });
};


// spotify function
function music(info){
        var song = info;
        spotify.search({
            type: "track",
            query: song
        }, function (err, data) {
            if(err){
                console.log(err);
            } else {
                var artist = data.tracks.items[0];
                var musicStuff = [
                    "Artist: " + artist.artists[0].name,
                    "The song name: " + artist.name,
                    "A preview link: " + artist.external_urls.spotify,
                    "Album: " + artist.album.name,
                ].join("\n");

                console.log(musicStuff);
            }
        });
    };


// concert function
function concert(info) {
    var concert = info;
    request("https://rest.bandsintown.com/artists/" + concert + "/events?app_id=codingbootcamp", function (error, response, body) {
        if (!error && response.statusCode === 200) {
            var result = JSON.parse(body);
            for (var i = 0; i < 5; i++) {
                var date = result[i].datetime;
                var dateFinal = moment(date).format("MM/DD/YYYY");
                var concertArr = [
                    "Name of the venue: " + result[i].venue.name,
                    "Venue location: " + result[i].venue.country,
                    "Date of the Event: " + dateFinal,
                ].join('\n');
                console.log(concertArr + "\n<><><><><><><><><><><><><>");
            }
        } else {
            console.log(error);
        }

    });
};

// do thing function
function things(){
    fs.readFile("random.txt", "utf8" ,function(err, data){
        if (err) {console.log(err)}
        else {
            var song = data.split(", ");
            music(song[1]);
        }
    });
}
