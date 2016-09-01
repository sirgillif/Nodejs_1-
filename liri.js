//set up the requests for the api calls
var Twitter = require('twitter');
var spotify = require('spotify');
var inquirer = require('inquirer');
var keys = require('./keys.js');
var file = require("fs");



var KeyForTwitter =keys.twitterKeys;
var client = new Twitter(KeyForTwitter)

//get the call (will be phased out with inquirer)
// var request = process.argv[2];
// console.log("Going into response");
	// * `my-tweets`
inquirer.prompt([
	{
		type: "list",
		message: "What would you like to see?",
		choices: ['my-tweets', 'spotify-this-song', 'movie-this',`do-what-it-says`],
		name: "request"
	}
]).then(function (user){
	
	choices(user.request);
});
function choices(user,choice) {
	if(user==`my-tweets`){
		var params={screen_name: "pgallo5"};
		client.get('statuses/user_timeline', params, function(error, tweets, response) {
			//console.log(tweets[tweets.length-i].text);
			for (var i = 0; i < tweets.length; i++) {
				console.log((i+1)+': '+tweets[i].text);
			}
			//console.log(tweets[0].text);
			//console.log(response)
		})
	}
		// * `spotify-this-song`
	else if(user==`spotify-this-song`){
		//console.log(choice)
		if(choice==undefined){
			inquirer.prompt([
				{
					type: "ipnut",
					message: "Please type in the song name you'd like info on.",
					default:'The Sign',
					name: "song"
				}
			]).then(function (user){
				var song=user.song;
				
				spotify.search({ type: 'track', query: song }, function(err, data) {
					if ( err ) {
						return console.log('Error occurred: ' + err);	
					}
					console.log('Artist(s)\n--------')
					for (var i = 0; i < data.tracks.items[0].artists.length; i++) {
						console.log(data.tracks.items[0].artists[i].name)
					}
					console.log('\nSong Name\n--------\n'+data.tracks.items[0].name);
					console.log('\nLink to song\n--------\n'+data.tracks.items[0].external_urls.spotify);
					console.log('\nAlbum\n--------\n'+data.tracks.items[0].album.name);
				});
			});
			//console.log(response)
		}
		else{
			var song=choice;
			spotify.search({ type: 'track', query: song }, function(err, data) {
				if ( err ) {
					return console.log('Error occurred: ' + err);	
				}
				console.log('Artist(s)\n--------')
				for (var i = 0; i < data.tracks.items[0].artists.length; i++) {
					console.log(data.tracks.items[0].artists[i].name)
				}
				console.log('\nSong Name\n--------\n'+data.tracks.items[0].name);
				console.log('\nLink to song\n--------\n'+data.tracks.items[0].external_urls.spotify);
				console.log('\nAlbum\n--------\n'+data.tracks.items[0].album.name);
			});
		}
	}
		// * `movie-this`
	else if(user==`movie-this`){
		//console.log(choice);
		if(choice==undefined){
			inquirer.prompt([
				{
					type: "ipnut",
					message: "Please type in the movie name you'd like info on.",
					default:'Mr. Nobody',
					name: "movie"
				}
			]).then(function (user){
				var movie='';
				//console.log('movie name: '+user.movie);
				movie=user.movie.split(" ").join("+");
				//console.log(movie)
				var request = require('request');

				request("http://www.omdbapi.com/?t="+movie+"&y=&plot=short&r=&tomatoes=true&json", function (error, response, body) {
						//console.log("in request for omdb")
						if (!error && response.statusCode == 200) {
							//console.log(JSON.parse(body));
							console.log("Title: "+JSON.parse(body)["Title"]);
							console.log("Year Released: "+JSON.parse(body)["Year"]);
							console.log("IMDB Rating: "+JSON.parse(body)["imdbRating"]);
							console.log("Country(s) Produced: "+JSON.parse(body)["Country"]);
							console.log("Language(s): "+JSON.parse(body)["Language"]);
							console.log("Plot: "+JSON.parse(body)["Plot"]);
							console.log("Actors: "+JSON.parse(body)["Actors"]);
							console.log("Rotten Tomatoes Rating: "+JSON.parse(body)["tomatoRating"]);
							console.log("Rotten Tomatoes URL(s): "+JSON.parse(body)["tomatoURL"]);
						}
						else{
							console.log("error")
						}
				});
			});		
		}
		else{
			var movie='';
			//console.log('movie name: '+choice);
			movie=choice.split(" ").join("+");
			//console.log(movie)
			var request = require('request');
			request('http://www.omdbapi.com/?t='+movie+'&r=json', function (error, response, body) {
				//console.log("in request for omdb")
				if (!error && response.statusCode == 200) {
					console.log("Title: "+JSON.parse(body)["Title"]);
					console.log("Year Released: "+JSON.parse(body)["Year"]);
					console.log("IMDB Rating: "+JSON.parse(body)["imdbRating"]);
					console.log("Country(s) Produced: "+JSON.parse(body)["Country"]);
					console.log("Language(s): "+JSON.parse(body)["Language"]);
					console.log("Plot: "+JSON.parse(body)["Plot"]);
					console.log("Actors: "+JSON.parse(body)["Actors"]);
					console.log("Rotten Tomatoes Rating: "+JSON.parse(body)["tomatoRating"]);
					console.log("Rotten Tomatoes URL(s): "+JSON.parse(body)["tomatoURL"]);
				}
				else{
					console.log("error")
				}
			});
		}	
	}
		// * `do-what-it-says`
	else if(user== `do-what-it-says`){
		//console.log('doing-what-it-says');
		var fs = require("fs");
		fs.readFile("random.txt", 'utf8', function(error, data) {
			if(error){
				return console.log(error);
			}
			//console.log(data);
			var randomOutput = data.split(",");
			console.log(randomOutput[0]+" : "+randomOutput[1]);
			//reRun Function
			//console.log("ReRun Function");
			choices(randomOutput[0],randomOutput[1]);
		});
	}
}