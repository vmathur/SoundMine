var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');

var app = express();

var previousMoodMap = {};
var Firebase = require('firebase');
var appRef = new Firebase("https://shining-fire-9992.firebaseio.com");
var usersRef = appRef.child("user_list"),
user = 10152128449356744,
mood,
myRef = usersRef.child(user);

var songMap = {
    'daydreaming':'/music/daydreaming.mp3',
    'one_thing'  :'/music/one_thing.mp3',
    'lights'     :'/music/lights.mp3'
};


var BinaryServer = require('binaryjs').BinaryServer;

var bs = new BinaryServer({ port: 9000 });

bs.on('connection', function (client) {

    client.on('stream', function (stream, songTitle) {
        console.log('requesting song: '+songTitle);
        var file = fs.createReadStream(__dirname + songMap[songTitle]);
        client.send(file);
    });
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));




app.get('/', function(req, res) {
  res.render('/index.html');
});

app.post('/sensor',function(req,res){
    data = req.body;
    mood = data.mood;
    timeStamp = data.time;
    user = data.user;

    console.log(user+' is '+mood+' at '+ timeStamp);
    res.send();
    myRef.child('currentMood').set(mood);
});

setPreviousMood(user,mood);

myRef.on('value', function(snapshot){
    snapshot = snapshot.val();
    previousMood = mood;
    mood = snapshot.currentMood;
    currentSong = snapshot.currentlyListening;
    //setPreviousMood(mood);
});

function getPreviousMood(user){
    //some hashmap of user to previous mood
    //return null if there is nothing
    //var mood = previousMoodMap[user]

    return mood;
}

function setPreviousMood(user,mood){
    myRef.child('currentMood').set('relaxed');
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

setPreviousMood(user,mood);

module.exports = app;
