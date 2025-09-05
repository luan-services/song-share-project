export default async function handler(request, response) {
	const { artist, track } = request.query;

	if (!artist || !track) {
		return response.status(400).json({ error: 'Artista e música são obrigatórios.' });
	}

	// pegamos o token secreto que está seguro no ambiente da vercel
	const apiKey = process.env.LASTFM_API_ACCESS_TOKEN;

	/* termos de busca com " " ou "&" são lidos pela api de forma errada, ex: 'Florence + The Machine' o query só vai ler 
	q=Florence, para contornar isso usamos encodeURIComponent(), que transforma a string em Florence%20%2B%20The%20Machine */
	const url = `https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${apiKey}&artist=${encodeURIComponent(artist)}&track=${encodeURIComponent(track)}&format=json`;

	try {
		const lastFmResponse = await fetch(url);
		const data = await lastFmResponse.json();

		if (!lastFmResponse.ok || data.error) { // se o Lastfm der erro, avisamos nosso frontend
			return response.status(lastFmResponse.status).json({ message: data.message || 'Erro no Last.fm' });
		}
		
		response.status(200)
		return response.json(data); // enviamos a resposta do LastFm de volta para o nosso frontend

	} catch (error) {
		response.status(500)
		return response.json({ message: 'Erro interno ao chamar a API do Last.fm.' });
	};
};