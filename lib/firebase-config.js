import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// check para ver se o firebase já está inicializado (pode acontecer de mais de uma instância inicializar), se não:
if (!getApps().length) { 
  initializeApp({ // inicializa
    credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON))
  });
}

// gera uma instância do banco de dados
const db = getFirestore(); 

// exporta a instância do DB para ser usada em qualquer outro lugar do nosso backend.
export { db };