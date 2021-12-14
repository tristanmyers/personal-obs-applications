import { getNekos } from './nekos.js';
/*
WHAT THE PROGRAM DOES INTERNALLY:
1. chatbot sends array with string to server
2. server recieves a buffer
3. server needs to parse buffer with JSON.parse() method and send to browser
4. browser recieves a blob from the server
5. browser converts blob as text and renders it with start()
*/

// DONE: the physics needs create bodies from those urls
// DONE: bodies spawn the top and can be anywhere throughout the x axis
// DONE: continuously pull from the api and spawn more images

// TODO: when to many bodies on screen delete and continue
// TODO: give each emote a timer till deletion
// TODO: Have emotes randomally generate from the emote apis
// DONE: Have emotes dynamically generate from the emote apis and chat api
// DONE: render walls and ground relative to canvas width and height

// ISSUE: can't find out how to clear the view properly with bodyCheck()
// DONE: eveytime the start() gets called converted emotes never resets
// DONE: obs browser source gets "dataFromServer.text is not a function"


function randomNumber(max) {
  let num = Math.floor(Math.random() * max);
  return num;
}

// module aliases
const Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite,
    Composites = Matter.Composites,
    Common = Matter.Common;

// create an engine
const engine = Engine.create();

// create a renderer
const render = Render.create({
    element: document.querySelector('div'),
    engine: engine,
    options: {
    	height: 600,
    	width: 1150,
    	background: '#14151f',
	    wireframes: false,
    }
});



// run the renderer
Render.run(render);
// create runner
const runner = Runner.create();
// run the engine and runner
Runner.run(engine);

export async function startPhysics(convertedEmotes) {
	const chatEmotes = convertedEmotes.flat();

	let fallSpeed = 0.40;
	let numBodies = engine.world.bodies.length;
	const maxBodies = 300;

  const offset = 10;
  const options = { 
    isStatic: true,
    render: {
	    	fillStyle: '#14151f'
      },
  };

	// walls
  Composite.add(engine.world, [
	  	// top
	    Bodies.rectangle(400, 600 + offset, 800.5 + 2 * offset, 50.5, options),
	    // right
	    Bodies.rectangle(render.options.width + offset, 300, 50.5, 600.5 + 2 * offset, options),
	    // left
	    Bodies.rectangle(-offset, 300, 50.5, 600.5 + 2 * offset, options),
	    // bottom
	    Bodies.rectangle(render.options.width, 610, 810, 60, options)
  	]);

	function generateEmotes() {
		for (let emote of chatEmotes) {
			const emoteBody = Bodies.rectangle(randomNumber(1100), 0, 50, 50, {
				render: {
					sprite: {
						texture: `${emote}`,
						xScale: 0.5,
						yScale: 0.5
					}
				},
				frictionAir: fallSpeed
			});
			Composite.add(engine.world, [emoteBody]);
			convertedEmotes.pop();
		}
		// walls and ground count as bodies.
		numBodies = engine.world.bodies.length - 4;
	}

	async function generateNekos() {
		const nekos = await getNekos();

		for (let neko of nekos) {
			const nekoBody = Bodies.rectangle(randomNumber(1300), 0, 50, 50, {
				render: {
					sprite: {
						texture: `${neko}`,
						xScale: 0.06,
						yScale: 0.06
					}
				},
				frictionAir: fallSpeed
			});

			Composite.add(engine.world, [nekoBody]);
		}
		// Common.log('Number of bodies: ' + engine.world.bodies.length);
		numBodies = engine.world.bodies.length;
		// bodyCheck();
		// generateNekos();
	}


	// check how many bodies there are and reset at certain amount
	function bodyCheck() {
		if (numBodies >= 8) {
			Common.log('Number of bodies: ' + numBodies);
			// Common.log('Clearing bodies');
		} else {
			Common.log('Number of bodies: ' + numBodies);
			return;
		}

	}
	// add bodies to the world
	generateEmotes();
	// generateNekos();
	Composite.add(engine.world);
}