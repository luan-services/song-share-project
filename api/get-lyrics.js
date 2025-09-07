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

    // --- A MUDANÇA ESTÁ AQUI: ADICIONAMOS MAIS CABEÇALHOS ---
    const headers = {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'pt-BR,pt;q=0.8,en-US;q=0.5,en;q=0.3',
        'DNT': '1', // Do Not Track
        'Upgrade-Insecure-Requests': '1',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    };

    const pageResponse = await fetch(geniusSongUrl, { headers: headers });

    // --- MELHORIA NO LOG DE ERRO ---
    if (!pageResponse.ok) {
        // Tentamos ler o corpo da resposta para ver se é uma página de erro ou CAPTCHA
        const errorBody = await pageResponse.text();
        console.error("Corpo da resposta de erro do Genius:", errorBody.substring(0, 500)); // Loga os primeiros 500 caracteres
        
        // Lançamos um erro mais detalhado
        throw new Error(`Página do Genius retornou um erro. Status: ${pageResponse.status} ${pageResponse.statusText}`);
    }

    const html = await pageResponse.text();
    const $ = cheerio.load(html);

    // Sua nova lógica de scraping é ótima, vamos mantê-la.
    const container = $('div[data-lyrics-container="true"]');
    container.children('div').remove(); // Remove as divs internas (anotações)
    
    container.find('br').replaceWith('\n');
    let lyrics = container.text().trim();

    if (!lyrics) {
        return null;
    }
    
    // Removendo os colchetes (ex: [Verse 1])
    return lyrics.replace(/\[.*?\]\n?/g, '').trim();
}


// função server-side de fetch do backend para realizar o webscrapping e salvar o resultado no firebase
export default async function handler(request, response) {

	// pega os dados do query
	const { id, artist, track, geniusSongUrl, fromLastFm } = request.query;

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

			if(fromLastFm) { // se os dados vieram do lastFm (meta-dados melhores)
				
				// se os dados no bd forem diferente dos metadados que vieram agora provavelmente os dados do bd são do genius
				if (doc.data().artist != artist || doc.data().track != track) { 
					await docRef.update({ // atualiza a tabela com os dados atuais
						artist: artist,
						track: track,
						scrapedAt: new Date(),
						fromLastFm: fromLastFm,
					});
				};
			}

			return response.status(200).json({ lyrics: doc.data().lyrics, source: 'cache' }); // retorna a letra
		} 
		else { // caso 2: a tabela não existe, tenta fazer webscrapping do Genius

			console.log(`id ${docId} não existe, fazendo scrapping no Genius e salvando no firebase`);

			const lyrics = await scrapeLyrics(geniusSongUrl); // tenta fazer o webscrapping

			if (lyrics) { // se funcionou

				await docRef.set({ // salva uma tabela nova no bd
					lyrics: lyrics,
					artist: artist,
					track: track,
					scrapedAt: new Date(),
					fromLastFm: fromLastFm,
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