async function subscribeToFollow() {
	try {	
		const response = await fetch("https://api.twitch.tv/helix/eventsub/subscriptions", {
			method: "POST"
		});

		const subscibed = await response.json
		console.log(subscibed);

	} catch (e) {
		console.error(e);
	}
};

function triggerFollow() {
	subscribeToFollow();
}