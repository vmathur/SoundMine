var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

var previousMoodMap = {};

var Firebase = require('firebase');
var appRef = new Firebase("https://shining-fire-9992.firebaseio.com");
var usersRef = appRef.child("user_list"),
user = 10154295291765322,
mood,
myRef = usersRef.child(user);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

app.post('/sensor',function(req,res){
    data = req.body;
    mood = data.mood;
    timeStamp = data.time;
    user = data.user;

    console.log(user+' is '+mood+' at '+timeStamp);


    //query recently played song db
    //query for user previous mood
    //check if mood timestamp is between song time interval, or after song start

    //if true
        //if the previous mood is the same, then do B
        //if the previous mood is is different or non existant, then do A
    //if false
        //Do A


    // if(currentSong){
    //     if(mood===previousMood){
    //         storeSongMood(user,mood,currentSong);
    //     }else{
    //         suggestSong(user,mood);
    //     }
    // }else{
    //     suggestSong(user,mood);
    // }
    setPreviousMood(user,mood)
});

myRef.on('value', function(snapshot){
    snapshot = snapshot.val();
    previousMood = mood;
    mood = snapshot.currentMood;
    currentSong = snapshot.currentlyListening;
    // setPreviousMood(mood);
});

function getPreviousMood(user){
    //some hashmap of user to previous mood
    //return null if there is nothing
    //var mood = previousMoodMap[user]

    return mood;
}

function setPreviousMood(user,mood){
    myRef.child('currentMood').set('active');
}

function getRecentSong(timeStamp, user){

    //return the song id for a song that started playing 
    //before the time stamp and ended after the time stamp(if no end time, then just base off of start time)

    //if there is none, return null
}

function getCurrentSong(user){ 

}

//A) suggest song to user
function suggestSong(user,mood){
    //querydb for songs that match the mood
    //send to client
    //client should call play song by id
}

//B) match mood to song
function storeSongMood(user,mood,song){
    //-store song mood combo in db
}

//DBs needed
//db for recent user mood
//db of recently played songs with time intervals
//db of songs and moods



/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


/// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

var http = require('http');

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}).listen(1337, '127.0.0.1');

console.log('Server running at http://127.0.0.1:1337/');

setPreviousMood(user,mood);

module.exports = app;
