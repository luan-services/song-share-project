import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';


import { z } from 'zod'; // biblioteca de validação de inputs



// check para ver se o firebase já está inicializado (pode acontecer de mais de uma instância inicializar), se não:
if (!getApps().length) { 
	initializeApp({ // inicializaça
		credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON))
	});
}

// coloca a instância do banco de dados em db
const db = getFirestore(); 

const containsNoScripts = (text) => { // função auxiliar para checar se o texto não contém código malicioso
    return !/<script|onerror|onload|onclick|onmouseover/i.test(text);
}

// Define a "forma" que o request.body deve ter
const songSchema = z.object({
    id: z.string().min(1, { message: "O ID não pode ser vazio." }).max(20, { message: "O ID não pode ultrapassar 15 caracteres."}),
    artist: z.string().trim().min(1).max(100, { message: "Nome do artista muito longo." }).refine(containsNoScripts, { message: "O nome do artista contém conteúdo inválido." }),
    track: z.string().trim().min(1).max(100, { message: "Nome da música muito longo." }).refine(containsNoScripts, { message: "O nome da música contém conteúdo inválido." }),
    lyrics: z.string().trim().min(1).max(15000, { message: "Letra da música muito longa." }).refine(containsNoScripts, { message: "A letra da música contém conteúdo inválido ou scripts." }),
});


// função server-side de fetch do backend para realizar o webscrapping e salvar o resultado no firebase
export default async function handler(request, response) {

    if (request.method !== 'POST') { // aceita apenas requests post
        response.setHeader('Allow', ['POST']);
        return response.status(405).end(`Method ${request.method} Not Allowed`);
    }

    try {
        songSchema.parse(request.body); // tenta validar com zod, se falhar, ele joga um erro
    } catch (err) {
        return response.status(400).json({ message: err.message});
    }

    // validação de dados de entrada
    const { id, artist, track, lyrics } = request.body;

    if (!id || !artist || !track || !lyrics ) {
        return response.status(400).json({ message: 'Parâmetros id, artist e track são obrigatórios.' });
    }

    const docId = String(id); // pega o id do genius e faz ser o id do documento
    const docRef = db.collection('lyrics').doc(docId);

    // Objeto com os dados a serem salvos/atualizados, para evitar repetição
    const songPayload = {
        artist: artist,
        track: track,
        scrapedAt: new Date(),
        lyrics: lyrics,
    };
    
    
    try {
        const doc = await docRef.get();

        // caso 1: documento não existe
        if (!doc.exists) {
            await docRef.set(songPayload);
			
            return response.status(201).json({ message: `Documento ${docId} criado com sucesso.` });
        }

        // caso 2: documento existe
        return response.status(200).json({ message: `Documento ${docId} já existe e não necessita de atualização.` });

    } catch (error) {
        console.error(`Erro ao processar o documento ${docId}:`, error);
        return response.status(500).json({ message: 'Erro interno do servidor ao acessar o banco de dados.' });
    }
}