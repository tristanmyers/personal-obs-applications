import { startPhysics } from './fallingGamePhysics.js';

// receiving emotes sent over websocket connection and rendering them into canvas
function startFallingGame() {
	let convertedEmotes = [];

	const socket = new WebSocket('ws://localhost:4000');
	socket.addEventListener('open', (event) => {
		console.log('connected to websocket');
	});

	socket.addEventListener('message', (event) => {
		const reader = new FileReader();
		try {
			reader.readAsText(event.data);
			reader.addEventListener('loadend', () => {
			  const text = reader.result;
			  console.log(text);
				convertedEmotes.push(JSON.parse(text));
				startPhysics(convertedEmotes);
			});
		} catch(e) {
			console.error(e);
		}
	});
}

window.onload = startFallingGame();