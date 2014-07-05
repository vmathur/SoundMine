var container = $('.container'),
	player = $('.player'), 
	play = $('#play'),
	pause = $('#pause'),
	song = new Audio('../music/lights.mp3');

//firebase references
var appRef = new Firebase('https://shining-fire-9992.firebaseio.com/'),
usersRef = appRef.child('user_list');

var auth = new FirebaseSimpleLogin(appRef, function(error, user) {
	//we have a user, YAY!
	if ( user ) {
		$('h2').text('Welcome ' + user.displayName +'!'); //welcome our user
		
		userRef = playerRef.child(user.id); //setup gloabl db
		userRef.child('displayName').set(user.displayName); //add user to firebase
		_user = user; //for reference in other places
		
		manageConnection(user); //online status
		userRef.on('value', showBoard); //show the board when playing
	}
});

//sets online status to true/false on connect/disconect
function manageConnection(user) {
	onlineRef = userRef.child('online'),
	connectedRef = new Firebase('https://blinding-fire-6122.firebaseio.com/.info/connected');
	connectedRef.on('value', function(snap) {
	  if (snap.val() === true) {
	    var con = onlineRef.set(true);
	    onlineRef.onDisconnect().set(false);
	  }
	});
}


$('#play').click(function(e){
	e.preventDefault();
	id = e.target.id;
	timestamp = e.timestamp;

	//playing song using the id
	playSongById(id);

	//saving the song id and the timestamp to the database
	// saveToRef(timestamp, id);

	// replacing the play button with a 
	$(this).replaceWith('<a class="button gradient" id="pause" href="" title=""></a>');
});


function playSongById(songId){
	song.play();
}

function saveToRef(timestamp, songId) {

}

auth.login('facebook');