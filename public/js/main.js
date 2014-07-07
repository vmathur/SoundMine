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
                	artist: 'Ellie Goulding',
                	active: false,
                	relaxed: false,
                	lastPlayed: ""
};
songs['daydreaming'] = { track: new Audio('../music/daydreaming.mp3'),
						 artist: 'Lupe Fiasco',
                		 active: false,
                		 relaxed: false,
                		 lastPlayed: ""
};
songs['hurricane'] = { track: new Audio('../music/hurricane.wav'),
						 artist: 'MsMr',
                		 active: false,
                		 relaxed: false,
                		 lastPlayed: ""
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
	song = $(elem).attr('title')
	track = songs[song].track;
}

// function for when you click on play button or on a song url in the playlist
$('.play').on('click', function(evt){
	evt.preventDefault();
	var _this = this;

	// initialize the song into a global song variable
	initAudio($(this));

	// now that we have a song, let's play it
	playSong();

	$(this).addClass('playing');
});

$('.playButton').on('click', function(evt) {
	evt.preventDefault();

	// play the track we want to play
	playSong();

	//TODO: change hardcoded "active" to actual current mood
	// save song to current mood's list
    saveToRef(evt.timestamp, "active", song);
})

$('.pause').on('click', function(evt) {
	evt.preventDefault();

	pauseSong();

});

$('.fwd').on('click', function(evt) {
    evt.preventDefault();

    // pause whatever is playing right now
    pauseSong();

    var next = nextSong();
    // initialize the next song so we can go forward
    initAudio(next);

    // now that we have a new track initialized, play it
	playSong();

	//TODO: change hardcoded "active" to actual current mood
    // save song to current mood's list
    saveToRef(evt.timestamp, "active", song);

});


$('.back').on('click', function(evt) {
    evt.preventDefault();

    // pause whatever is playing right now
    pauseSong();

    // get the previous song
    var prev = prevSong();

    // initialize the previous song so we can go back
    initAudio(prev);

    // play the previous song
	playSong();

	//TODO: change hardcoded "active" to actual current mood
    // save song to current mood's list
    saveToRef(evt.timestamp, "active", song);
});

$('.dislike').on('click', function(evt) {
    evt.preventDefault();

    // pause whatever is playing right now
    pauseSong();

	//TODO: change hardcoded "active" to actual current mood
    // remove song from mood's setlist

    removeFromRef("active", song);

    var next = nextSong();
    // initialize the next song so we can go forward
    initAudio(next);

    // now that we have a new track initialized, play it
	playSong();
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

	return prev;
}

function nextSong() {
	var next = $('.song_list a.playing').next();
	if (next.length == 0) {
	    next = $('.song_list a:first-child');
	}

	$('.song_list a.playing').removeClass('playing');
	next.addClass('playing');

	return next;
}

function saveToRef(timestamp, currentMood, song) {
	activePlaylist = [],
		relaxedPlaylist = [];
	// adding song to the right playlist based on user's current mood
	
	songs[song].lastPlayed = timestamp;

	if (currentMood == "active") {
		songs[song].active = true;
	} else if (currentMood == "relaxed") {
		songs[song].relaxed = true;
	}

	updatePlaylistRef();
}

function removeFromRef(currentMood, song) {
	// removing song from the right playlist based on user's current mood

	if (currentMood == "active") {
		songs[song].active = false;
	} else if (currentMood == "relaxed") {
		songs[song].relaxed = false;
	}

	updatePlaylistRef();
}

function updatePlaylistRef() {
	activePlaylist = {}, relaxedPlaylist = {};
	for ( var songRef in songs ) {
		if ( songs[songRef].active ) activePlaylist[songRef] = true;
		else if ( !songs[songRef].active ) activePlaylist[songRef] = null;
		
		if ( songs[songRef].relaxed ) relaxedPlaylist[songRef] = true;
		else if ( !songs[songRef].relaxed ) relaxedPlaylist[songRef] = null;
	}

	usersRef.child(_user.id).child('active').set(activePlaylist)
	usersRef.child(_user.id).child('relaxed').set(relaxedPlaylist);
}
// triggering facebook login
auth.login('facebook');
initAudio($('.song_list a:first-child'));