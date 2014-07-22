var container = $('.container'),
	player = $('.player'), 
	play = $('#play'),
	pause = $('#pause'),
	_user,
	_currentMood,
	song,
	track;

// songs hashmap
var tracks = {}, songs = {};
tracks = {
	lights: new Audio(),
	daydreaming: new Audio(),
	one_thing: new Audio()
};

songs['lights'] = { 
	artist: 'Ellie Goulding',
	active: 1,
	relaxed: 1,
	lastPlayed: ""
};
songs['daydreaming'] = { 
	artist: 'Lupe Fiasco',
	active: 1,
	relaxed: 1,
	lastPlayed: ""
};
songs['one_thing'] = { 
	artist: 'One Direction',
    active: 1,
	relaxed: 1,
	lastPlayed: ""
};

// binary client 
var client = new BinaryClient('ws://localhost:9000');

//firebase references
var appRef = new Firebase('https://shining-fire-9992.firebaseio.com/'),
	usersRef = appRef.child('user_list');

// firebased authentication using facebook
var auth = new FirebaseSimpleLogin(appRef, function(error, user) {
	//we have a user, YAY!
	if ( user ) {
		myRef = usersRef.child(user.id); //setup global db
		myRef.child('displayName').set(user.displayName); //add user to firebase
		_user = user; //for reference in other places

		manageConnection(user); //online status
		activePlaylistRef = usersRef.child(_user.id).child('active');
		relaxedPlaylistRef = usersRef.child(_user.id).child('relaxed');
	}
});

//sets online status to true/false on connect/disconect
function manageConnection(user) {
	onlineRef = myRef.child('online'),
	connectedRef = new Firebase('https://shining-fire-9992.firebaseio.com/.info/connected');
	connectedRef.on('value', function(snap) {
	  if (snap.val() === true) {
	    var con = onlineRef.set(true);
	    onlineRef.onDisconnect().set(false);
	  }
	});
}

function initAudio(elem) {
	song = $(elem).attr('title');
	client.send('stream', song);

	client.on('stream', function(stream, meta) {
		console.log('recieve file');
		var parts = [];
		stream.on('data', function(data) {
	    	parts.push(data);
		});
		stream.on('end', function() {
		    var music = document.createElement("audio");
		    music.src=(window.URL || window.webkitURL).createObjectURL(new Blob(parts));
		    //music.addEventListener('ended', function(){initAudio(nextSong());}, true);
		    track = tracks[song];
		    track.src = music.src;
		    playSong();
		});
	});

}


var songList = $('.song_list');
for (songRef in songs) {
	songTitle = capitalize(songRef);
	linkEl = document.createElement('a');
	linkEl.className = 'play title';
	linkEl.title =  songRef; 
	linkEl.href = "";
	text = document.createTextNode(songTitle + '-' + songs[songRef].artist);
	linkEl.appendChild(text);
	
	songList.append(linkEl);
}

// function for when you click on play button or on a song url in the playlist
$('.play').on('click', function(evt){
	evt.preventDefault();
	var _this = this;

	// pause whatever is playing right now
    pauseSong();

	// initialize the song into a global song variable
	initAudio($(this));

	// remove previous song's 'playing' class
	$('.song_list a.playing').removeClass('playing');
	
	// now that we have a song, let's play it
	$(this).addClass('playing');

	//TODO: change hardcoded "active" to actual current mood
	// save song to current mood's list
    changeScore('play');
    
});

$('.playButton').on('click', function(evt) {
	evt.preventDefault();

	if (!(track)) {
		initAudio($('.song_list a:first-child'));
		$('.song_list a:first-child').addClass('playing');
	} else {
		playSong();
	}

	//TODO: change hardcoded "active" to actual current mood
	// save song to current mood's list
    changeScore('playButton');

})

$('.pause').on('click', function(evt) {
	evt.preventDefault();

	pauseSong();

});

$('.fwd').on('click', function(evt) {
    evt.preventDefault();

    // pause whatever is playing right now
    pauseSong();

    // decrease song's score
    changeScore('skip');

    var next = nextSong();
    // initialize the next song so we can go forward
    initAudio(next);
});


$('.back').on('click', function(evt) {
    evt.preventDefault();

    // pause whatever is playing right now
    pauseSong();

    // get the previous song
    var prev = prevSong();

    // initialize the previous song so we can go back
    initAudio(prev);
});

$('.dislike').on('click', function(evt) {
    evt.preventDefault();

    // pause whatever is playing right now
    pauseSong();

	//TODO: change hardcoded "active" to actual current mood
    // decrease song's score
    changeScore('dislike');

    var next = nextSong();
    // initialize the next song so we can go forward
    initAudio(next);

});

$('.like').on('click', function(evt) {
    evt.preventDefault();

	//increase 'weighting' of song in mood playlist
	changeScore('likeOn');

	//Toggle colour of thumbs up button
   	$(this).toggleClass("green");

});

function playSong(){
	// if we have initialized a track, play it
    if (track) track.play();

    // set the current song in firebase
    usersRef.child(_user.id).child('currentlyListening').set(song + ' - ' + songs[song].artist);

	$(".playButton").hide();
	$(".pause").show();

}

function pauseSong() {

	// if there is a track initialized that is possibly playing, pause it
	if (track) track.pause();

	// removing the current song in firebase
	usersRef.child(_user.id).child('currentlyListening').set(null);

	$(".pause").hide();
	$(".playButton").show();
}

function prevSong() {
	var prev = $('.song_list a.playing').prev();
	if (prev.length == 0) {
	    prev = $('.song_list a:last-child');
	}
	$('.song_list a.playing').removeClass('playing');
	prev.addClass('playing');

	//Reset like button colour
	if ($('.like').hasClass('green')) {
		$('.like').toggleClass("green");
	}

	return prev;
}

function nextSong() {
	var next = $('.song_list a.playing').next();
	if (next.length == 0) {
	    next = $('.song_list a:first-child');
	}

	$('.song_list a.playing').removeClass('playing');
	next.addClass('playing');

	//Reset like button colour
	if ($('.like').hasClass('green')) {
		$('.like').toggleClass("green");
	}

	return next;
}

function updatePlaylistRef() {
	activePlaylist = {}, relaxedPlaylist = {};
	for ( var songRef in songs ) {
		if ( songs[songRef].active > 2) activePlaylist[songRef] = true;
		else activePlaylist[songRef] = null;
		
		if ( songs[songRef].relaxed > 2) relaxedPlaylist[songRef] = true;
		else relaxedPlaylist[songRef] = null;
	}

	usersRef.child(_user.id).child('active').set(activePlaylist);
	usersRef.child(_user.id).child('relaxed').set(relaxedPlaylist);
	//usersRef.child(_user.id).child('all_songs').set(songs);
}

function changeScore(actionType) {

	//TODO: have a working currentMood
	var curMood = _currentMood;

	if (actionType == 'likeOn') {
		songs[song].active = songs[song].active + 5;
	}
	if (actionType == 'likeOff') {
		songs[song].active = songs[song].active - 5;
	}
	else if (actionType == 'dislike') {
		songs[song].active = songs[song].active - 5;
	}
	else if (actionType == 'play') {
		songs[song].active = songs[song].active + 1;
	}
	else if (actionType == 'playButton') {
		songs[song].active = songs[song].active + 1;
	}
	else if (actionType == 'skip') {
		songs[song].active = songs[song].active - 1;
	}

	//usersRef.child(_user.id).child('activell_songs').set(songs);

	updatePlaylistRef();

	usersRef.child(_user.id).child('active').set(activePlaylist);
	usersRef.child(_user.id).child('relaxed').set(relaxedPlaylist);

	activePlaylistRef.on('value', function(snapshot){
		snapshot = snapshot.val();
		createSuggestions(snapshot);
	});

	relaxedPlaylistRef.on('value', function(snapshot){
		snapshot = snapshot.val();
		createSuggestions(snapshot);
	});

}

function createSuggestions(moodPlaylist){
	//grab random 3 songs to display on change
	//TODO: change userMood to be _currentMood
	var userMood = 'active';
	console.log(moodPlaylist);
}

// Helper Functions
function capitalize(str){
	str = str == null ? '' : String(str);
	return str.charAt(0).toUpperCase() + str.slice(1);
}

function onKeyDown(event){
	switch (event.keyCode){
		case 32: //spacebar                 
            if (!$(track)[0].paused) {
                pauseSong();
            } else {
                playSong();
            }
            break;
        case 37: //leftarrow - back        
    		pauseSong();
    		initAudio(prevSong());
            break;
        case 39: //spacebar - fwd           
            pauseSong();
    		initAudio(nextSong());
            break;
     }
  return false;
}

window.addEventListener("keydown", onKeyDown, false);
auth.login('facebook');
