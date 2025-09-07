import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// check para ver se o firebase já está inicializado (pode acontecer de mais de uma instância inicializar), se não:
if (!getApps().length) { 
    initializeApp({ // inicializaça
        credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON))
    });
}

// coloca a instância do banco de dados em db
const db = getFirestore(); 

export default async function handler(request, response) {
    // 1. Pega o ID da query string (ex: /api/get-data?id=12345)
    const { id } = request.query;

    // 2. Validação: se não houver ID, retorna erro 400 (Bad Request)
    if (!id) {
        return response.status(400).json({ message: 'O parâmetro "id" é obrigatório.' });
    }

    try {
        const docId = String(id);
        const docRef = db.collection('lyrics').doc(docId);
        
        // 3. Busca o documento
        const doc = await docRef.get();

        // 4. Se o documento existir, retorna os dados com status 200 (OK)
        if (doc.exists) {
            return response.status(200).json(doc.data());
        } 
        // 5. Se não existir, retorna erro 404 (Not Found)
        else {
            return response.status(404).json({ message: `Documento com id ${docId} não encontrado.` });
        }

    } catch (error) {
        console.error(`Erro ao buscar documento ${id}:`, error);
        return response.status(500).json({ message: 'Erro interno do servidor.' });
    }
}