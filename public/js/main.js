var container = $('.container'),
	player = $('.player'), 
	play = $('#play'),
	pause = $('#pause'),
	_user,
	_currentMood,
	song,
	track;

// firebase refs
var myRef;

// songs hashmap
var tracks = {}, songs = {};
tracks = {
	lights: new Audio(),
	daydreaming: new Audio(),
	one_thing: new Audio(),
	the_children: new Audio(),
	nightcall: new Audio(),
	midnight_city: new Audio(),
	marooned: new Audio(),
	fix_you: new Audio(),
	truly_madly_deeply: new Audio(),
	three_little_birds: new Audio(),
	merry_go_round_of_life: new Audio(),
	faxing_berlin: new Audio(),
	pjanoo: new Audio(),
	lux_aeterna: new Audio(),
	gimme_sympathy: new Audio(),
	mr_brightside: new Audio(),
	party_rock_anthem: new Audio(),
	safe_in_sound: new Audio(),
	numb: new Audio(),
	crazy_in_love: new Audio()
};

songs['lights'] = { 
	artist: 'Ellie Goulding',
	active: 1,
	relaxed: 1,
	focused: 1,
	energetic: 1,
	lastPlayed: "",
	cover: 'http://www.thesnipenews.com/thegutter/wp-content/uploads/2011/04/Ellie-Goulding-Lights-album-cover.jpg'
};
songs['daydreaming'] = {  		
	artist: 'Lupe Fiasco',
	active: 1,
	relaxed: 1,
	focused: 1,
	energetic: 1,
	lastPlayed: "",
	cover: "http://upload.wikimedia.org/wikipedia/en/d/d0/Lupe_Fiasco_-_Daydreamin'.jpg"
};
songs['one_thing'] = { 
	artist: 'One Direction',
    active: 1,
	relaxed: 1,
	focused: 1,
	energetic: 1,
	lastPlayed: "",
	cover: "http://upload.wikimedia.org/wikipedia/en/a/ae/One_Direction_-_One_Thing_Cover.jpg"
};
songs['the_children'] = { 
	artist: 'Ramin Djawadi',
    active: 1,
	relaxed: 1,
	focused: 1,
	energetic: 1,
	lastPlayed: "",
	cover: 'http://alexdang.info/wp-content/uploads/2014/06/Ramin-Djawadi-Game-of-Thrones-Season-4.jpg'
};
songs['nightcall'] = { 
	artist: 'Kavinsky',
    active: 1,
	relaxed: 1,
	focused: 1,
	energetic: 1,
	lastPlayed: "",
	cover: 'http://tempoohlala.files.wordpress.com/2010/09/front-kavinsky-nightcall-1600x1600.jpg'
};
songs['midnight_city'] = {
	artist: 'M83',
    active: 1,
	relaxed: 1,
	focused: 1,
	energetic: 1,
	lastPlayed: "",
	cover: 'http://www.grimygoods.com/wp-content/uploads/2011/10/m83-hurry-up-were-dreaming-album-cover-photos.jpg'
}
songs['marooned'] = {
	artist: 'Pink Floyd',
    active: 1,
	relaxed: 1,
	focused: 1,
	energetic: 1,
	lastPlayed: "",
	cover: 'http://0.tqn.com/d/classicrock/1/S/m/S/pinkfloyd_divisionbell.jpg'
}
songs['crazy_in_love'] = {
	artist: 'Beyonce (feat. Jay-Z)',
    active: 1,
	relaxed: 1,
	focused: 1,
	energetic: 1,
	lastPlayed: "",
	cover: 'http://upload.wikimedia.org/wikipedia/en/2/29/Beyonce_-_Crazy_In_Love_single_cover.jpg'
}
songs['fix_you'] = {
	artist: 'Coldplay',
    active: 1,
	relaxed: 1,
	focused: 1,
	energetic: 1,
	lastPlayed: "",
	cover:'sites.psu.edu/waschenko/wp-content/uploads/sites/432/2012/12/art_fixyou.jpg'
}
songs['truly_madly_deeply'] = {
	artist: 'Savage Garden',
    active: 1,
	relaxed: 1,
	focused: 1,
	energetic: 1,
	lastPlayed: "",
	cover:'http://cfile3.uf.tistory.com/image/15775A4D4F4F7CD521201D'
}
songs['three_little_birds'] = {
	artist: 'Bob Marley',
    active: 1,
	relaxed: 1,
	lastPlayed: "",
	cover:'http://www.justinguitar.com/images/titles/BS-101.jpg'
}
songs['merry_go_round_of_life'] = {
	artist: 'Joe Hisaishi',
    active: 1,
	relaxed: 1,
	focused: 1,
	energetic: 1,
	lastPlayed: "",
	cover:"http://wickedvibesbringthejoy.files.wordpress.com/2014/04/2.jpg"
}
songs['faxing_berlin'] = {
	artist: 'Deadmau5',
    active: 1,
	relaxed: 1,
	focused: 1,
	energetic: 1,
	lastPlayed: "",
	cover:'http://images.junostatic.com/full/CS1358203-02A-BIG.jpg'
}
songs['pjanoo'] = {
	artist: 'Eric Pryde',
    active: 1,
	relaxed: 1,
	lastPlayed: "",
	cover: 'http://images.junostatic.com/full/CS1500700-02A-BIG.jpg'
}
songs['lux_aeterna'] = {
	artist: 'Clint Mansell',
    active: 1,
	relaxed: 1,
	focused: 1,
	energetic: 1,
	lastPlayed: "",
	cover: 'http://www.peteranglea.com/wp-content/uploads/2009/05/pic2.jpg'
}
songs['gimme_sympathy'] = {
	artist: 'Metric',
    active: 1,
	relaxed: 1,
	focused: 1,
	energetic: 1,
	lastPlayed: "",
	cover:'http://musictrajectory.com/wp-content/uploads/2012/04/metric-fantasies-album-cover.jpg'
}
songs['mr_brightside'] = {
	artist: 'The Killers',
    active: 1,
	relaxed: 1,
	focused: 1,
	energetic: 1,
	lastPlayed: "",
	cover: ' http://assets-s3.rollingstone.com/assets/images/list/c3ff6f79b73f01fb013843f7fdad3bb560fcff7d.jpg'
}
songs['party_rock_anthem'] = {
	artist: 'LMFAO',
    active: 1,
	relaxed: 1,
	focused: 1,
	energetic: 1,
	lastPlayed: "",
	cover: 'http://upload.wikimedia.org/wikipedia/en/a/a2/Party_Rock_Anthem_(feat._Lauren_Bennet_%26_GoonRock)_-_Single.jpeg'
}
songs['safe_in_sound'] = {
	artist: 'Sub Focus',
    active: 1,
	relaxed: 1,
	focused: 1,
	energetic: 1,
	lastPlayed: "",
	cover:'http://upload.wikimedia.org/wikipedia/en/e/ea/Torus_sub_focus_album_cover.jpg'
}
songs['numb'] = {
	artist: 'Linkin Park',
    active: 1,
	relaxed: 1,
	focused: 1,
	energetic: 1,
	lastPlayed: "",
	cover: 'http://en.wikipedia.org/wiki/Meteora_(album)#mediaviewer/File:MeteoraLP.jpg'
}


$("#pause").hide();

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
		initializeRefs();
	}
});

function initializeRefs() {
	activePlaylistRef = usersRef.child(_user.id).child('active');
	relaxedPlaylistRef = usersRef.child(_user.id).child('relaxed');
	focusedPlaylistRef = usersRef.child(_user.id).child('focused');
	energeticPlaylistRef = usersRef.child(_user.id).child('energetic');

	usersRef.child(_user.id).child('currentMood').on('value', function(snapshot) {
		snapshot = snapshot.val()
		_currentMood = snapshot;
		if (_currentMood != null)	{
			$('.suggestForMood').text(_currentMood );
		} else {
			$('.suggestForMood').text('None Found');
		}
	});

	usersRef.child(_user.id).child('all_songs').on('value', function(snapshot) {
		snapshot = snapshot.val();
		if (typeof snapshot === 'object' && snapshot !== null) {
			songs = snapshot;
		}
	});
	
	activePlaylistRef.once('value', function(snapshot){
		activeSnapshot = snapshot.val();
		if (activeSnapshot) createSuggestions(activeSnapshot, snapshot.name());
	});

	relaxedPlaylistRef.once('value', function(snapshot){
		relaxedSnapshot = snapshot.val();
		if (relaxedSnapshot) createSuggestions(relaxedSnapshot, snapshot.name());
	});

	focusedPlaylistRef.once('value', function(snapshot){
		focusedSnapshot = snapshot.val();
		if (focusedSnapshot) createSuggestions(focusedSnapshot, snapshot.name());
	});

	energeticPlaylistRef.once('value', function(snapshot){
		energeticSnapshot = snapshot.val();
		if (energeticSnapshot) createSuggestions(energeticSnapshot, snapshot.name());
	});

}

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
		    track.setAttribute("onended","initAudio(nextSong())");
		    track.addEventListener('timeupdate', function() {
		    	time = Math.floor(track.currentTime);
		    	mins = Math.floor(time/60);
		    	seconds = time%60;
		    	if (seconds < 10 ) {
		    		seconds = '0' + seconds;
		    	}
		    	formattedTime = (mins + ':' + seconds);
		    	$('.timer').html(formattedTime);
		    	updateDurationBar(track.duration, track.currentTime);
		    });
		    playSong();
		});
	});

}	

function updateDurationBar(duration, currentTime) { 
	percentage = (currentTime/duration)*100;
	percentage = percentage.toString() + '%';
	$('.duration_bar').css('width', percentage);
}

var songList = $('.song_list');
for (songRef in songs) {
	songTitle = capitalize(songRef);
	songLink = '<a class="play ' + songRef + '" href="" title=' + songRef + '>' + songTitle + '<br><i>' +  songs[songRef].artist + '</i></a>';
	// linkEl = document.createElement('a');
	// linkEl.className = 'play title';
	// linkEl.title =  songRef; 
	// linkEl.href = "";
	// text = document.createTextNode(songTitle + ' - ' + songs[songRef].artist);
	// linkEl.appendChild(text);
	
	songList.append(songLink);
}

// function for when you click on play button or on a song url in the playlist
$(document.body).on('click', '.play', function(evt){
	evt.preventDefault();
	var _this = this;

	// pause whatever is playing right now
    pauseSong();

	// initialize the song into a global song variable
	initAudio($(this));

	// remove previous song's 'playing' class
	$('.song_list a.playing').removeClass('playing');

	selector = '.' + evt.target.title;
	
	// now that we have a song, let's play it
	$(selector).addClass('playing');

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

$('#pause').on('click', function(evt) {
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
    $('.songname').text(capitalize(song) + ' - ' + songs[song].artist);
	$(".playButton").hide();
	$(".pause").show();

	//Reset like button colour
	if ($('.like').hasClass('green')) {
		$('.like').toggleClass("green");
	}

}

function pauseSong() {

	// if there is a track initialized that is possibly playing, pause it
	if (track) track.pause();

	// removing the current song in firebase
	usersRef.child(_user.id).child('currentlyListening').set(null);

	$("#pause").hide();
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
	activePlaylist = {}, relaxedPlaylist = {}, focusedPlaylist = {}, energeticPlaylist = {};
	for ( var songRef in songs ) {
		if ( songs[songRef].active > 2) activePlaylist[songRef] = true;
		else activePlaylist[songRef] = null;
		
		if ( songs[songRef].relaxed > 2) relaxedPlaylist[songRef] = true;
		else relaxedPlaylist[songRef] = null;

		if ( songs[songRef].focused > 2) focusedPlaylist[songRef] = true;
		else focusedPlaylist[songRef] = null;

		if ( songs[songRef].energetic > 2) energeticPlaylist[songRef] = true;
		else energeticPlaylist[songRef] = null;
	}

	usersRef.child(_user.id).child('active').set(activePlaylist);
	usersRef.child(_user.id).child('relaxed').set(relaxedPlaylist);
	usersRef.child(_user.id).child('focused').set(focusedPlaylist);
	usersRef.child(_user.id).child('energetic').set(energeticPlaylist);
	usersRef.child(_user.id).child('all_songs').set(songs);
}

function changeScore(actionType) {

	//TODO: have a working currentMood
	var curMood = _currentMood;

	if (curMood && (curMood == 'active' || curMood == 'relaxed' || curMood == 'focused' || curMood == 'energetic')) {
		if (actionType == 'likeOn') {
			songs[song][curMood] = songs[song][curMood] + 5;
		}
		if (actionType == 'likeOff') {
			songs[song][curMood] = songs[song][curMood] - 5;
		}
		else if (actionType == 'dislike') {
			songs[song][curMood] = songs[song][curMood] - 5;
		}
		else if (actionType == 'play') {
			songs[song][curMood] = songs[song][curMood] + 1;
		}
		else if (actionType == 'playButton') {
			songs[song][curMood] = songs[song][curMood] + 1;
		}
		else if (actionType == 'skip') {
			songs[song][curMood] = songs[song][curMood] - 1;
		}
	}

	//usersRef.child(_user.id).child('activell_songs').set(songs);

	updatePlaylistRef();

	usersRef.child(_user.id).child('active').set(activePlaylist);
	usersRef.child(_user.id).child('relaxed').set(relaxedPlaylist);
	usersRef.child(_user.id).child('focused').set(focusedPlaylist);
	usersRef.child(_user.id).child('energetic').set(energeticPlaylist);
}

function createSuggestions(moodSnapshot, name){

	var userMood = _currentMood;

	keys = Object.keys(moodSnapshot)

	if (_currentMood == name) {
		console.log("Suggestions: " + keys);
		displaySuggestions(keys);
	}

}

function displaySuggestions(suggestionsArray) {
	var recommendationList = $('.recommendation_box'), newDivs = [];

	for (i = 0; (i < suggestionsArray.length) && (i < 4); i++ ) {
		title =  suggestionsArray[i];
		recoDiv = '<div><img class="album_cover" src="' + songs[title].cover + '"></img><a class="play ' + title + '" href="" title=' + title + '>' + capitalize(title) + '<br><i title=' + title + '>' +  songs[title].artist + '</i></a></div>';
		newDivs.push(recoDiv);
	}
	recommendationList.html(newDivs);
}

// Helper Functions
function capitalize(str){
	str = str == null ? '' : String(str);
	strings = str.split('_');
	$(strings).each(function(i) {
		strings[i] = strings[i].charAt(0).toUpperCase() + strings[i].slice(1);
	});
	return 	strings.join(' ');
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
