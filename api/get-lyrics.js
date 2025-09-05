// /api/get-lyrics.js

import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as cheerio from 'cheerio';

// verifica se já existe uma instância do app para evitar inicializações múltiplas, o que é comum em ambientes serverless.
if (!getApps().length) {
	initializeApp({ // inicializa o firebase
		credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON))
	});
}

const db = getFirestore(); // pega a instância do bd.
// ------------------------------------

async function scrapeLyrics(songUrl) { // função de webscrapping
    console.log(`Iniciando scrape para: ${songUrl}`);

    const pageResponse = await fetch(songUrl);

    if (!pageResponse.ok) throw new Error('Página do Genius não encontrada durante o scrape.');

    const html = await pageResponse.text();
    const $ = cheerio.load(html);

    let lyrics = '';

    $('div[data-lyrics-container="true"]').each((i, elem) => {
        $(elem).find('br').replaceWith('\n');
        lyrics += $(elem).text().trim() + '\n\n';
    });

    if (!lyrics) return null;
    return lyrics.replace(/\[.*?\]\n/g, '').trim();
}
// ------------------------------------

export default async function handler(request, response) {
	// O frontend precisa enviar artist, track (para o ID) e a url (para o scrape)
	const { id, artist, title: track, url: songUrl } = request.query;

	if (!artist || !track || !songUrl) {
		response.status(400)
		return  response.json({ message: 'Artista, música e URL são obrigatórios.' });
	};

	// Cria um ID único e limpo para o documento no Firestore
	const docId = String(id)
	const docRef = db.collection('lyrics').doc(docId);

	try {
		// 1. Tenta buscar do cache (Firestore) primeiro
		const doc = await docRef.get();

		if (doc.exists) {
		// CACHE HIT: Encontramos a letra no banco!
		console.log(`Cache HIT para: ${docId}`);
		return response.status(200).json({ lyrics: doc.data().lyrics, source: 'cache' });
		} else {
		// CACHE MISS: Não encontramos, vamos buscar no Genius
		console.log(`Cache MISS para: ${docId}`);
		const lyrics = await scrapeLyrics(songUrl);

		if (lyrics) {
			// Se encontramos a letra, salvamos no Firestore para a próxima vez
			await docRef.set({
				lyrics: lyrics,
				artist: artist,
				track: track,
				scrapedAt: new Date()
			});
			// E retornamos para o usuário
			return response.status(200).json({ lyrics: lyrics, source: 'genius_scrape' });
		} else {
			return response.status(404).json({ message: 'Letra não encontrada no Genius.' });
		}
		}
	} catch (error) {
		console.error(`Erro para ${docId}:`, error);
		return response.status(500).json({ message: 'Erro interno ao processar a letra.' });
	}
}