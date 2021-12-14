export async function getNekos() {
	try {
		const response = await fetch('/nekosAPI', {
			method: 'GET'
		}); 

		const nekos = await response.json();
		return nekos;
	} catch(e) {
		console.log(e);
	}
}