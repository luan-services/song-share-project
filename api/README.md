Api aqui é uma pasta exclusiva do ambiente vercel, precisamos rodar as funções de fetch server-side por dois motivos:

1. projetos spa com vite e react são 100% client side, fetchs que usam chaves de api, que é o nosso caso, vão expor as chaves
publicamente (mesmo com o uso de .env) pois os fetchs são client-side

2. a api do genius não permite fetch client-side, o CORS dela proíbe isso.

Ao hostear projetos no vercel, ele nos permite usar o ambiente server-side dele para criar chamadas, entre outras coisas, basta
criar uma pasta /api

Fazendo isso não poderemos mais usar 'npm run dev' para testar o código, o vite não 'enxerga' a pasta api, não sabe o que fazer,
precisaremos usar 'vercel dev' que é a ferramenta de build em desenvolvimento própria do vercel.

Passo a passo:

primeiro dê 
    
    npm install -g vercel // uma vez só na máquina

depois suba o projeto do github pro vercel normalmente, não esqueça de adicionar as variáveis env lá

    GENIUS_API_ACCESS_TOKEN e LASTFM_API_ACCESS_TOKEN



dá vercel login

dá vercel link (provavelmente vai achar o projeto e você só precisa dar Y)
    se não achar o projeto:

    Set up “~/caminho/do/seu/projeto”? -> Aperte Y (Sim).

    Which scope should this project be under? -> Escolha seu nome de usuário.

    Link to an existing project? -> Aperte Y (Sim).

    What’s the name of your existing project? -> Comece a digitar o nome do seu projeto (gerador-de-imagens-de-musica) e selecione-o na lista.

dá vercel env pull

    isso vai configurar um arquiv .env.local, que servirá para baixar as variáveis env que estão no server do vercel para testar localmente.

    as variáveis aqui vão sobrescrever qualquer arquivo .env criado, então ao chamar proccess.env.KEY no frontend, KEY vai ser procurado primeiro no arquivo .env.local e caso não exista, procura no .env

    mudar as variáveis em .env.local não muda no site do vercel, só serve para testar novas variaveis em ambiente dev, tem que ir lá e mudar também.


PRONTO TUDO CERTO

Rodar em dev: vercel dev (substitui o npm run dev)
Subir deploy: normalmente com git push