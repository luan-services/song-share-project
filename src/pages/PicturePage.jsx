import React from 'react'


import { useEffect } from 'react';

import { useNavigate } from 'react-router-dom'; // navigate é um state do react que possibilita ir para outras páginas, como o link, mas
// ao invés de ser um Link, navigate é uma função (também possibilita enviar dados via states

import { useLocation } from 'react-router-dom'; // location é um state do react que possibilita ler os dados que foram passados via navigate

export const PicturePage = () => {
	
	const location = useLocation(); // hook para acessar informações da rota atual, incluindo o 'state'.
	const navigate = useNavigate(); // hook para podermos redirecionar o usuário, se necessário.

	const withLyrics = true;

	// EXTRAINDO OS DADOS DE FORMA SEGURA
	// location.state busca para ver se o navigate que levou até a pagina atual enviou algum state, se sim, ele salva o estado nas duas const
	const songData = location.state.songData ? location.state.songData : undefined;


	// esse useEffect roda assim que a página inicia, ele checac se songData existe antes de carregar os dados, para evitar quebrar a página
	// caso um usuário acesse /location diretamente pelo browser (sem passar pela homepage)
	useEffect(() => {
		if (!songData) {
			console.error("Acesso direto à /picture não permitido ou estado perdido. Redirecionando...");
			// o mandamos de volta para a página inicial.
			navigate('/');
		}
	}, [songData, navigate]); // Dependências: o efeito roda se songData ou navigate mudarem.


	// se songData ainda não existe, não renderizamos nada (ou um loading) para evitar o erro até que o retorno do useEffect carregue
	if (!songData) {
		return <div>Carregando...</div>;
	}

	// se o código chegou até aqui, é 100% seguro que 'songData' existe.
	return (
		<div className="container mx-auto p-8">
		<h1 className="text-4xl font-bold mb-4">Prévia da Imagem</h1>
		
		<div className="p-8 bg-white rounded-lg shadow-xl max-w-md mx-auto">
			<h2 className="text-3xl font-bold text-center">{songData.title}</h2>
			<p className="text-xl text-center text-gray-600 mb-4">{songData.artist}</p>
			<div className="w-full h-64 bg-gray-300 rounded flex items-center justify-center mb-4">
				<img className="h-full" src={songData.albumArtUrl}/>
			</div>
		
			{withLyrics ? (
			<div className="bg-gray-100 p-4 rounded">
				<p className="text-center font-serif">"{songData.artist}"</p>
			</div>
			) : (
			<p className="text-center text-gray-400">(Modo sem letra)</p>
			)}
		</div>

		<div className="text-center mt-8">
			<button onClick={() => navigate('/')} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
			Voltar
			</button>
		</div>
		</div>
	);
}