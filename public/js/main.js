var container = $('.container'),
	player = $('.player'), 
	play = $('#play'),
	pause = $('#pause'),
	song = new Audio('../music/lights.mp3'),
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


$('.song').click(function(e){
	e.preventDefault();
	id = e.target.id;
	timestamp = e.timestamp;

	//playing song using the id
	playSongById(id);

	//saving the song id and the timestamp to the database
	saveToRef(timestamp, id);

	// replacing the play button with a 
	$(this).replaceWith('<a class="button gradient" id="pause" href="" title="">Pause</a>');
});

// ('#pause').click(function(e) {
// 	e.preventDefault();
// 	id = e.target.id;
// 	timestamp = e.timestamp;

// 	pauseSong();
// 	$(this).replaceWith('<a class="button gradient" id="pause" href="" title="">Pause</a>');
// });

function playSongById(songId){
	song.play();
	usersRef.child(_user.id).child('currentlyListening').set(songId);
}

function pauseSong() {
	song.pause();
	usersRef.child(_user.id).child('currentlyListening').set(null);
}

function saveToRef(timestamp, songId) {
	if ( _currentMood === 'active' ) {
		activeRef.push(songId);
	} else if ( _currentMood === 'relaxed' ) {
		relaxedRef.push(songId);
	}
}

function manageListens() {
	console.log('managing what i listen to');
}

function manageMood() {

}

auth.login('facebook');