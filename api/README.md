Api aqui é uma pasta exclusiva do ambiente vercel, precisamos rodar as funções de fetch server-side por dois motivos:

1. projetos spa com vite e react são 100% client side, fetchs que usam chaves de api, que é o nosso caso, vão expor as chaves
publicamente (mesmo com o uso de .env) pois os fetchs são client-side

2. a api do genius não permite fetch client-side, o CORS dela proíbe isso.

Ao hostear projetos no vercel, ele nos permite usar o ambiente server-side dele para criar chamadas, entre outras coisas, basta
criar uma pasta /api

Fazendo isso não poderemos mais usar 'npm run dev' para testar o código, o vite não 'enxerga' a pasta api, não sabe o que fazer,
precisaremos usar 'vercel dev' que é a ferramenta de build em desenvolvimento própria do vercel.

