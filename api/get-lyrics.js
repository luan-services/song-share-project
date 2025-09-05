import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as cheerio from 'cheerio'; // biblioteca de web-scrapping

// check para ver se o firebase já está inicializado (pode acontecer de mais de uma instância inicializar), se não:
if (!getApps().length) { 
	initializeApp({ // inicializaça
		credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON))
	});
}

// coloca a instância do banco de dados em db
const db = getFirestore(); 

// função auxiliar do cheerio, para fazer o scrapping da letra
async function scrapeLyrics(geniusSongUrl) { 
    
	console.log(`Iniciando scrape para: ${geniusSongUrl}`);

    const pageResponse = await fetch(geniusSongUrl);

    if (!pageResponse.ok) throw new Error('Página do Genius não encontrada durante o scrape.');

    const html = await pageResponse.text(); // pega o html inteiroi da página
    const $ = cheerio.load(html); // carrega com cheerio

	// usa o cheerio para criar um container da div das letras
    const container = $('div[data-lyrics-container="true"]');

	// remove todo texto que filho (parte que não é letra)
    container.children('div').remove();
    

    // agora, com o container mais limpo, processamos o que sobrou.

    container.find('br').replaceWith('\n'); // troca <br> por \n para quebrar linha nas letras
    let lyrics = container.text().trim(); // remove espaços desnecessários

    if (!lyrics) { // se não há letra, retorna
		return null;
	}
    
    
    return lyrics.replace(/\[.*?\]\n/g, '').trim(); // remove tudo que está de entre colchetes e retorna.
};


// função server-side de fetch do backend para realizar o webscrapping e salvar o resultado no firebase
export default async function handler(request, response) {

	// pega os dados do query
	const { id, artist, track, geniusSongUrl } = request.query;

	// caso algo esteja faltando retorna erro.
	if (!id || !artist || !track || !geniusSongUrl) {
		response.status(400)
		return response.json({ message: 'ID, Artista, Música e URL são obrigatórios.' });
	}

	const docId = String(id); // pega o id à ser buscado
	const docRef = db.collection('lyrics').doc(docId); // cria uma referência de tabela com o id

	try {

		const doc = await docRef.get(); // tenta buscar a tabela pelo id

		if (doc.exists) { // caso 1: a tabela existe, retorna a letra que está nela

			console.log(`Id ${docId} existe, retornando lyrics do firebase`);

			return response.status(200).json({ lyrics: doc.data().lyrics, source: 'cache' });
		} 
		else { // caso 2: a tabela não existe, tenta fazer webscrapping do Genius

			console.log(`id ${docId} não existe, fazendo scrapping no Genius e salvando no firebase`);

			const lyrics = await scrapeLyrics(geniusSongUrl); // tenta fazer o webscrapping

			if (lyrics) { // se funcionou

				await docRef.set({ // salva uma tabela nova no bd
					lyrics: lyrics,
					artist: artist,
					track: track,
					scrapedAt: new Date()
				});

				response.status(200);
				return response.json({ lyrics: lyrics, source: 'genius_scrape' });
			} 
			else { // caso contrário, retorna erro
				response.status(404)
				return response.json({ message: 'Letra não encontrada no Genius.' });
			}
		}
	} 
	catch (error) {
		console.error(`Erro para o Id ${docId}:`, error);
		response.status(500);
		return response.json({ message: 'Erro interno ao processar a letra.' });
	}
}