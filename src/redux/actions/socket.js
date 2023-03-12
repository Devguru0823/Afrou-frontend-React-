// jshint esversion:9
import { io } from 'socket.io-client';

let connectionString = '';

if (process.env.NODE_ENV === 'production') {
	connectionString = 'https://manager.afrocamgist.com';
} else {
	// connectionString = 'https://manager.staging.afrocamgist.com';
	connectionString = 'http://localhost:3000';
}

const socket = io(connectionString, {
	secure: true,
});

const loggedInUser = JSON.parse(localStorage.getItem('user'));

socket.on('connect', () => {
	if (loggedInUser) {
		// update user's socket id
		socket.emit('getsocketid', { user_id: loggedInUser.user_id }, function(
			err,
			data
		) {
			if (err) {
				console.log(err);
				return;
			}
			console.log('socket id updated: ', data);
		});
	}
});

socket.on('disconnect', (reason) => {
	if (reason === 'io server disconnect') {
		// the disconnection was initiated by the server
		socket.connect();
	}
});

export { socket };
