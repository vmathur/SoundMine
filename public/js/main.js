var container = $('.container'),
	player = $('.player'), 
	play = $('#play'),
	pause = $('#pause'),
	_user,
	_currentMood;

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

$('.play').on('mouseup', function(e){
	e.preventDefault();
	timestamp = e.timestamp;
	songName = $(this).attr('title');
	id = $(this).attr('data-title');
	artist = $(this).attr('data-artist');

	//playing song using the id
	song = new Audio('../music/' + songName + '.mp3');
	playSong(song, id, artist);

	//saving the song id and the timestamp to the database
	saveToRef(timestamp, id);

	$(this).removeClass('play');
	$(this).addClass('pause');

	$('.pause').on('mouseup', function(evt) {
		pauseSong(song);

		$(this).addClass('play');
		$(this).removeClass('pause');
	})
});

function playSong(song, songName, artist){
	song.play();
	// setting the current song in firebase
	usersRef.child(_user.id).child('currentlyListening').set(songName + ' - ' + artist);
}

function pauseSong(song) {
	song.pause();
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