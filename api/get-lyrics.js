// /api/get-lyrics.js (CÓDIGO TEMPORÁRIO DE DEPURAÇÃO)

export default async function handler(request, response) {
    console.log("--- INICIANDO TESTE DE DEPURAÇÃO DA API DE LETRAS ---");
    const firebaseKeyJSON = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

    if (firebaseKeyJSON) {
        console.log("✅ SUCESSO: A variável de ambiente foi encontrada!");
        // Vamos verificar se o conteúdo parece ser um JSON válido
        console.log("Início da chave:", firebaseKeyJSON.substring(0, 80) + "...");
    } else {
        console.error("❌ FALHA: A variável FIREBASE_SERVICE_ACCOUNT_JSON está UNDEFINED!");
    }

    console.log("--- TESTE DE DEPURAÇÃO CONCLUÍDO ---");

    // Enviamos uma resposta qualquer só para o frontend não dar erro de rede
    return response.status(200).json({ 
        message: "Teste de depuração concluído. Verifique o console do seu terminal (onde o 'vercel dev' está rodando)." 
    });
}