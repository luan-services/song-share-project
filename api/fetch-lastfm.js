export default async function handler(request, response) {

	const { artist, track } = request.query; // pega o termo de busca que o frontend enviou por query (ex: /api/search-genius?term=queen)

	if (!artist || !track) {
		return response.status(400).json({ error: 'Artista e título da música são obrigatórios.' });
	}

	// pegamos o token secreto que está seguro no ambiente da vercel
	const apiKey = process.env.LASTFM_API_ACCESS_TOKEN;

	
	/* termos de busca com " " ou "&" são lidos pela api de forma errada, ex: 'Florence + The Machine' o query só vai ler 
	q=Florence, para contornar isso usamos encodeURIComponent(), que transforma a string em Florence%20%2B%20The%20Machine */
	const url = `https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${apiKey}&artist=${encodeURIComponent(artist)}&track=${encodeURIComponent(track)}&format=json`;

	try {
		const lastFmResponse = await fetch(url);

		if (!lastFmResponse.ok) {
			const errorData = await lastFmResponse.json();
			response.status(lastFmResponse.status);
			return response.json({ message: 'Genius API Error' });
		};

		const data = await lastFmResponse.json();
		response.status(200).json(data);

	} catch (error) {
		response.status(500)
		response.json({ message: 'Internal Error calling LastFM API' });
  }
}