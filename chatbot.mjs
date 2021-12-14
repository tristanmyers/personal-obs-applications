// bot to watch for emotes in chat
// https://dev.twitch.tv/docs/irc
import dotenv from 'dotenv';
dotenv.config();
import tmi from 'tmi.js';
import WebSocket from 'ws';

const botAuth = process.env.BOT_AUTH

const opts = {
	identity: {
		username: "tottersbot",
		password: `oauth:${botAuth}`
	},
	channels: ["totertats"]
};

const client = new tmi.client(opts);
const socket = new WebSocket('ws://localhost:4000');

function startChatbot() {
	// register our event handlers
	client.on('connected', onConnectedHandler);
	client.on('message', onMessageHandler);

	// connect to twitch
	client.connect().catch(console.error());	
}
startChatbot();

// called every time a message comes in
function onMessageHandler(channel, tags, msg, self) {
	// console.log(channel, tags.emotes);
	// ignore message from the bot
	if (self) return;

	if (tags.emotes != null) {
		console.log('converting emotes...');
		emoteConversion(Object.keys(tags.emotes));
	}

	// check if msg is a command
	if (msg.startsWith('!')) {
		switch (msg.toLowerCase()) {
			case '!':
				client.say(channel, `!`);
				break;
			case '!lurk':
				client.say(channel, `@${tags.username} have a good lurk!`);
				break;
			case '!modpack':
				client.say(channel, `Better Minecraft (forge) with Create mod added.`);
				break;
			case '!pack':
				client.say(channel, `Better Minecraft (forge) with Create mod added.`);
				break;
			default:
				client.say(channel, 'unknown command.'); 
		}

	}
	switch (true) {
		case (msg.toLowerCase().includes('modpack')):
			client.say(channel, `Better Minecraft (forge) with Create mod added.`);
			break;
	}
}

// called every time the bot connects to twitch chat
function onConnectedHandler(addr, port) {
	console.log(`* Connected to ${addr}:${port}`);
}

// id of emotes in chat message is converted to link of the image relative to the emote
// and sent to the server
async function emoteConversion(emoteID, channel, tags, msg, self) {
	let convertedEmotes = [];
	emoteID.forEach((emote) => {
		const emoteImg = `https://static-cdn.jtvnw.net/emoticons/v1/${emote}/3.0`;
		convertedEmotes.push(emoteImg);
	});
	try {
		socket.send(JSON.stringify(convertedEmotes));
		console.log('sent emotes to server');
	} catch(e) {
		console.error(e);
	}
}

// module.exports = {startChatbot}