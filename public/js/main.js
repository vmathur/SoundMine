var container = $('.container'),
	player = $('.player'), 
	play = $('#play'),
	pause = $('#pause'),
	_user,
	_currentMood,
	song;

//song variables
var lights = new Audio('../music/lights.mp3');
var daydreaming = new Audio('../music/daydreaming.mp3');

//firebase references
var appRef = new Firebase('https://shining-fire-9992.firebaseio.com/'),
	usersRef = appRef.child('user_list');

var auth = new FirebaseSimpleLogin(appRef, function(error, user) {
	//we have a user, YAY!
	if ( user ) {
		$('h2').text('Welcome ' + user.displayName +'!'); //welcome our user

		myRef = usersRef.child(user.id); //setup gloabl db
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

$('.play').on('click', function(e){
	e.preventDefault();
	var _this = this;
	timestamp = e.timestamp;
	songName = $(this).attr('title');
	id = $(this).attr('data-title');
	artist = $(this).attr('data-artist');

	playSong(songName, id, artist);
	$(this).addClass('playing');
	//playing song using the id
	//song = new Audio('../music/' + songName + '.mp3');
	//song.play();
	// setting the current song in firebase
	//usersRef.child(_user.id).child('currentlyListening').set(songName + ' - ' + artist);

	saveToRef(timestamp, id);

	$(this).removeClass('play');
	$(this).addClass('pause');


	$('.pause').on('click', function(evt) {
		song.pause();
		usersRef.child(_user.id).child('currentlyListening').set(null);

		$(this).addClass('play');
		$(this).removeClass('pause');

	})
});

$('playButton').on('click', function(e){
	e.preventDefault();
	timestamp = e.timestamp;
	var currentSong = $('.song_list a.playing');

	songName = currentSong.attr('title');
	id = currentSong.attr('data-title');
	artist = currentSong.attr('data-artist');

	playSong(songName, id, artist);


});

$('.fwd').on('click', function(e) {
    e.preventDefault();
    timestamp = e.timestamp;
    pauseSong(song);

    var next = $('.song_list a.playing').next();
    if (next.length == 0) {
        next = $('.playlist a:first-child');
    }

    $('.song_list a.playing').removeClass('playing');
    next.addClass('playing');
    
    songName = next.attr('title');
	id = next.attr('data-title');
	artist = next.attr('data-artist');
    song = new Audio('../music/' + songName + '.mp3');
    song.play();
    usersRef.child(_user.id).child('currentlyListening').set(songName + ' - ' + artist);
    //playSong(song, id, artist);

    saveToRef(timestamp, id);

});


$('.back').on('click', function(e) {
    e.preventDefault();
    pauseSong(song);

    var prev = $('.song_list a.playing').prev();
    if (prev.length == 0) {
        prev = $('.playlist a:last-child');
    }
    $('.song_list a.playing').removeClass('playing');
    prev.addClass('playing');

    songName = prev.attr('title');
	id = prev.attr('data-title');
	artist = prev.attr('data-artist');
    song = new Audio('../music/' + songName + '.mp3');
    song.play();
    usersRef.child(_user.id).child('currentlyListening').set(songName + ' - ' + artist);
    //playSong(song, id, artist);

    saveToRef(timestamp, id);
});

function playSong(songName, id, artist){
	song = new Audio('../music/' + songName + '.mp3');
    song.play();

    // setting current song in firebase
    usersRef.child(_user.id).child('currentlyListening').set(songName + ' - ' + artist);
}

function pauseSong(song, songName, artist) {
	song.pause();
	// removing the current song in firebase
	usersRef.child(_user.id).child('currentlyListening').set(null);
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