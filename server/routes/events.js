const { socket_connections } = require('./../service/socket-sender');
module.exports = function (io) {
	var app = require('express');
	var router = app.Router();

	// io.of(`/${process.env.APPNAME}`).on('connection', (socket) => {
	// 	console.log(socket.id, 'namespace connected');
	// });

	// console.log(process.env.APPNAME);

	io.of(`/${process.env.APPNAME}`).on('connection', function (socket) {
		console.log(
			'user COnnection established with namespace',
			process.env.APPNAME
		);
		socket.on('client-connect', ({ adminId }) => {
			socket_connections.push({ adminId: '', socket });
		});

		socket.emit('ready-client', {
			message: 'Wellcome from server',
		});
	});

	return router;
};
