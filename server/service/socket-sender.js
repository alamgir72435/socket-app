const socket_connections = [];

// Event emitter for sending and receving custom events
const EveEmitter = require('events').EventEmitter;
const EventEmitter = new EveEmitter();

EventEmitter.on('io-event', function (eventOption) {
	// do something here like broadcasting data to everyone
	// or you can check the connection with some logic and
	// only send to relevant user
	const { event, payload, adminId } = eventOption;
	if (!adminId) {
		// send only those destination where data to send
		return false;
	}

	// send each Event ***********************************
	socket_connections.forEach(function (connection) {
		const { socket, adminId } = connection;
		socket.emit(event, payload);
	});

	console.log('Event Emited to ' + socket_connections.length, event);
});

module.exports = { EventEmitter, socket_connections };
