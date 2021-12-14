// check sizes of images 
// potential library https://github.com/lovell/sharp

const dotenv = require('dotenv').config();
const express = require('express');
const path = require('path');
const ws = require('ws');
const client = require('nekos.life');

const {sfw} = new client();
const app = express();

// creating a websocket connection and broadcasting data to the connected clients
const wsServer = new ws.Server({ noServer: true });
wsServer.on('connection', (socket) => {
	// socket.on('message', function incoming(message) {
	// 	console.log('received: %s', message);
	// });
	socket.on('message', function broadcast(message) {
		wsServer.clients.forEach(function each(client) {
			if (client !== wsServer && client.readyState === socket.OPEN) {
				client.send(message);
			}
		})
	})
});

let convertedEmotes;

app.use(express.json());
app.use(express.static(path.join(__dirname, '/')));
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, '/public/*')));


app.get('/', (req, res) => {
	res.sendFile('index.html');
});

app.get('/nekosAPI', async (req, res) => {
	try {
		let nekosArr = [];
		async function createNekos(numberNekos) {
			for (let i = 0; i < numberNekos; i++) {
				let nekoImg = await sfw.neko();
				nekosArr.push(nekoImg.url);
			}
			console.log(nekosArr);
			res.send(nekosArr);
		};

		createNekos(9);
	} catch (e) {
		console.error(e);
	}
});

const server = app.listen(4000, () => {
	console.log('listening at http://localhost:4000')
});
server.on('upgrade', (req, socket, head) => {
	wsServer.handleUpgrade(req, socket, head, socket => {
		wsServer.emit('connection', socket, req)
	})
});