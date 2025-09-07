export default async function handler(request, response) {

	const searchTerm = request.query.term; // pega o termo de busca que o frontend enviou por query (ex: /api/search-genius?term=queen)

	if (!searchTerm) {
		return response.status(400).json({ error: 'Search query is mandatory.' });
	}

	// pegamos o token secreto que está seguro no ambiente da vercel
	const accessToken = process.env.GENIUS_API_ACCESS_TOKEN;

	/* termos de busca com " " ou "&" são lidos pela api de forma errada, ex: 'Florence + The Machine' o query só vai ler 
	q=Florence, para contornar isso usamos encodeURIComponent(), que transforma a string em Florence%20%2B%20The%20Machine */
	const url = `https://api.genius.com/search?q=${encodeURIComponent(searchTerm)}`;

	try {
		const geniusResponse = await fetch(url, {
			headers: {
				'Authorization': `Bearer ${accessToken}`,
			},
		});

		if (!geniusResponse.ok) { // se o Genius der erro, avisamos nosso frontend
			const errorData = await geniusResponse.json();
			response.status(geniusResponse.status);
			return response.json({ message: 'Genius API Error' });
		}

		const data = await geniusResponse.json();
		
		response.status(200).json(data); // enviamos a resposta do Genius de volta para o nosso frontend

	} catch (error) {
		response.status(500);
		response.json({ message: 'Internal Error calling Genius API' });
	}
}