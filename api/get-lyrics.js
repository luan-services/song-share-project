// /api/get-lyrics.js

// ... (seus imports e a inicialização do Firebase)

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

// ... (o resto do seu arquivo 'handler' continua o mesmo)