var container = $('.container'),
	player = $('.player'), 
	play = $('#play'),
	pause = $('#pause'),
	_user,
	_currentMood,
	song,
	track;

// songs hashmap
var songs = {};
songs['lights'] = { track: new Audio('../music/lights.mp3'),
                	artist: 'Ellie Goulding'    
};
songs['daydreaming'] = { track: new Audio('../music/daydreaming.mp3'),
						 artist: 'Lupe Fiasco' 
};
songs['hurricane'] = { track: new Audio('../music/hurricane.wav'),
						 artist: 'MsMr' 
};

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
	songName = $(elem).attr('title');
	id = $(elem).attr('data-title');
	song = songs[songName];
	track = song.track;
}

// function for when you click on play button or on a song url in the playlist
$('.play').on('click', function(e){
	e.preventDefault();
	var _this = this;
	
	// initialize the song into a global song variable
	initAudio($(this));

	// now that we have a song, let's play it
	playSong();

	$(this).addClass('playing');
	$(this).removeClass('play');
	$(this).addClass('pause');

});

$('.playButton').on('click', function(evt) {
	evt.preventDefault();

	// play the track we want to play
	playSong();
})

$('.pause').on('click', function(evt) {
	evt.preventDefault();

	$(this).addClass('play');
	$(this).removeClass('pause');

	pauseSong();

});

$('.fwd').on('click', function(e) {
    e.preventDefault();

    // pause whatever is playing right now
    pauseSong();

    var next = nextSong();
    // initialize the next song so we can go forward
    initAudio(next);

    // now that we have a new track initialized, play it
	playSong();

    // saveToRef(timestamp, id);

});


$('.back').on('click', function(e) {
    e.preventDefault();

    // pause whatever is playing right now
    pauseSong();

    // get the previous song
    var prev = prevSong();

    // initialize the previous song so we can go back
    initAudio(prev);

    // play the previous song
	playSong(songName, id, artist);

    // saveToRef(timestamp, id);
});

function playSong(songName){
	// if we have initialized a track, play it
    if (track) track.play();

    // set the current song in firebase
    usersRef.child(_user.id).child('currentlyListening').set(songName + ' - ' + song.artist);
}

function pauseSong(songName) {
	// if there is a track initialized that is possibly playing, pause it
	if (track) track.pause();

	// removing the current song in firebase
	usersRef.child(_user.id).child('currentlyListening').set(null);
}

function prevSong() {
	var prev = $('.song_list a.playing').prev();
	if (prev.length == 0) {
	    prev = $('.playlist a:last-child');
	}
	$('.song_list a.playing').removeClass('playing');
	prev.addClass('playing');

	return prev;
}

function nextSong(song, songName) {
	var next = $('.song_list a.playing').next();
	if (next.length == 0) {
	    next = $('.song_list a:first-child');
	}

	$('.song_list a.playing').removeClass('playing');
	next.addClass('playing');

	return next;
}


function saveToRef(timestamp, songId) {
	// adding song to the right playlist based on user's current mood
	if ( _currentMood === 'active' ) {
		activeRef.push(songId);
	} else if ( _currentMood === 'relaxed' ) {
		relaxedRef.push(songId);
	}
}

// triggering facebook login
auth.login('facebook');
initAudio($('.song_list a:first-child'));