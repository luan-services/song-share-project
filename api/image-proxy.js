// pages/api/image-proxy.js - baixar a imagem no backend para a biblioteca de cores ler

export default async function handler(req, res) {
  // 1. Pega a URL da imagem dos parâmetros da query
  const imageUrl = req.query.url;

  // 2. Validação de segurança básica: verifica se a URL foi fornecida
  if (!imageUrl || typeof imageUrl !== 'string') {
    return res.status(400).json({ error: 'A URL da imagem é obrigatória.' });
  }

  try {
    // 3. Usa o 'fetch' para buscar a imagem do URL externo
    const imageResponse = await fetch(imageUrl);

    // 4. Verifica se a busca foi bem-sucedida
    if (!imageResponse.ok) {
      // Retorna o mesmo erro que a API externa retornou
      return res.status(imageResponse.status).json({ error: 'Falha ao buscar a imagem.' });
    }

    // 5. Pega a imagem como um Buffer (dados binários)
    const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());

    // 6. Pega o tipo de conteúdo original (ex: 'image/jpeg', 'image/png')
    const contentType = imageResponse.headers.get('content-type') || 'application/octet-stream';

    // 7. Configura os cabeçalhos da resposta para o navegador
    //    Cache-Control: Instruímos o navegador e a Vercel a guardarem essa imagem em cache por um ano.
    //    Isso melhora MUITO a performance e evita buscar a mesma imagem várias vezes.
    res.setHeader('Cache-Control', 'public, s-maxage=31536000, max-age=31536000, stale-while-revalidate');
    res.setHeader('Content-Type', contentType);

    // 8. Envia a imagem de volta para o seu frontend
    res.send(imageBuffer);

  } catch (error) {
    console.error('Erro no proxy de imagem:', error);
    res.status(500).json({ error: 'Ocorreu um erro interno no servidor.' });
  }
}