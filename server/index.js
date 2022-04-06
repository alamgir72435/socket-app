const express = require('express');
// const config = require('./config');
const cors = require('cors');
const morgan = require('morgan');
const fs = require('fs');
require('dotenv').config();
const app = express();
// config.__db_conect();
app.use(cors());
app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));

const socket = require('socket.io');

// API Prefix Config
const prefix = `/${process.env.APPNAME}`;

app.get(prefix, (req, res) => {
	res.sendFile(__dirname + '/public/index.html');
});

// event Emitter
// const EveEmitter = require('events').EventEmitter;
// const Event = new EveEmitter();

// Include all routes
fs.readdir('./routes', (err, files) => {
	// if (err) throw Error('Error Reading File', err);

	if (files !== undefined) {
		for (let file of files) {
			const filename = String(file).split('.')[0];
			app.use(`${prefix}/${filename}`, require(`./routes/${filename}`));
		}
	}

	// Error Handle under the Route
	app.use((req, res, next) => {
		const error = new Error(`Not Found - ${req.originalUrl}`);
		res.status(404);
		next(error);
	});

	app.use((err, req, res, next) => {
		const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
		res.status(statusCode);
		res.json({
			message: err.message,
			stack: process.env.NODE_ENV === 'production' ? null : err.stack,
		});
	});

	const PORT = process.env.PORT || 5000;

	const server = app.listen(PORT, () =>
		console.log(`server Running on port ${PORT}`)
	);
	//
	// Socket connection
	const io = socket(server, {
		cors: {
			origins: [
				'http://localhost:3000',
				'https://bbshohoz.com',
				'https://bb-dms.vercel.app',
				'https://patwary-traders.vercel.app',
				'https://patwary-traders.vercel.app',
				'https://vision-papers.binarybunon.com',
			],
		},
	});

	app.io = io;
	var routes = require('./routes/events')(io);
	app.use(routes);
});

// Lets Emit Event after Two Seconds
const { EventEmitter } = require('./service/socket-sender');

setInterval(() => {
	EventEmitter.emit('io-event', {
		event: 'pong',
		payload: { message: 'Pong' },
		adminId: 'none',
	});
}, 2000);
