export default async function handler(request, response) {

	const { searchTerms } = request.query;

	if (!searchTerms) {
		response.status(400);
		return response.json({ message: 'Termos de busca são obrigatórios.' });
	}

	/* termos de busca com " " ou "&" são lidos pela api de forma errada, ex: 'Florence + The Machine' o query só vai ler 
	q=Florence, para contornar isso usamos encodeURIComponent(), que transforma a string em Florence%20%2B%20The%20Machine */
	const deezerUrl = `https://api.deezer.com/search?q=${encodeURIComponent(searchTerms)}&limit=15`;

	try {
		const deezerResponse = await fetch(deezerUrl);
		const data = await deezerResponse.json();

		if (!deezerResponse.ok || data.error) { // se o Lastfm der erro, avisamos nosso frontend
			response.status(deezerResponse.status);
			return response.json({ message: data.message || 'Erro no deezer'});
		}

		response.status(200);
		return response.json(data); // enviamos a resposta do LastFm de volta para o nosso frontend

	} catch (error) {
		response.status(500)
		return response.json({ message: 'Erro interno ao chamar a API do deezer.' });
	};
};