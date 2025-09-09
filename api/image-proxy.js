// baixar a imagem no backend para a biblioteca de cores ler

/* a política de segurança (Same-Origin Policy) proibe que um endereço (vercel) pegue e analise o conteúdo de imagens de outros endereços (last.fm), 
a menos que a outra api dê uma permissão explicita

essa "permissão explícita" é um cabeçalho de resposta chamado Access-Control-Allow-Origin. os servidores de imagem como os do Last.fm e Genius não
enviam essa permissão, eles fazem isso para proteger seus dados e evitar que sites maliciosos roubem informações ou abusem de seus servidores.

a solução: criar uma rota image-proxy, que vai ser chamada passando a url da imagem, essa rota vai fazer o fetch da imagem (baixá-la), adicionar
os headers certos no request, e enviá-lo de volta ao frontend como response. 

dessa forma, uma cópia da imagem é enviada, só que agora é enviada do nosso servidor para o nosso servidor (Same-Origin está OK e os dados podem ser acessados)
*/

export default async function handler(req, res) {
	
	const imageUrl = req.query.url; // pega a URL da imagem dos parâmetros da query

	if (!imageUrl || typeof imageUrl !== 'string') { // verifica se a URL foi fornecida
		return res.status(400).json({ error: 'A URL da imagem é obrigatória.' });
	}

	try {
	
		const imageResponse = await fetch(imageUrl); // fazer fetch do url de uma imagem pega os dados brutos (binários da imagem)

		
		if (!imageResponse.ok) { // verifica se a busca foi bem-sucedida
			return res.status(imageResponse.status).json({ error: 'Falha ao buscar a imagem.' });
		}

		const imageBuffer = Buffer.from(await imageResponse.arrayBuffer()); // buffer é um container padrão de node.js para armazenar os dados da imagem da forma correta

		
		const contentType = imageResponse.headers.get('content-type') || 'application/octet-stream'; // pega o tipo do conteúdo original da imagem (ex: 'image/jpeg', 'image/png')

		// configura os headers
		// cache-Control: instrui o navegador e a Vercel a guardarem essa imagem em cache por um ano
		res.setHeader('Cache-Control', 'public, s-maxage=31536000, max-age=31536000, stale-while-revalidate');

		res.setHeader('Content-Type', contentType); // adiciona o header do tipo do conteúdo pego anteriormente

		res.send(imageBuffer); // envia a resposta de volta pro frontend

	} catch (error) {
		console.error('Erro no proxy de imagem:', error);
		res.status(500).json({ error: 'Ocorreu um erro interno no servidor.' });
	}
}