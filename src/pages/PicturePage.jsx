import React from 'react'

import { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom'; // navigate é um state do react que possibilita ir para outras páginas, como o link, mas
// ao invés de ser um Link, navigate é uma função (também possibilita enviar dados via states

import { useLocation } from 'react-router-dom'; // location é um state do react que possibilita ler os dados que foram passados via navigate

export const PicturePage = () => {
	
	const location = useLocation(); // hook para acessar informações da rota atual, incluindo o 'state'.
	const navigate = useNavigate(); // hook para podermos redirecionar o usuário, se necessário.

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

	// ---

	const [songImgLastFmUrl, setSongImgLastFmUrl] = useState(null);

	useEffect(() => {

		const fetchAlbumArt = async () => {
			const params = new URLSearchParams({
				artist: songData.artist,
				track: songData.track,
			});
			const url = `/api/fetch-lastfm?${params.toString()}`;

			try {
				const response = await fetch(url);
				if (!response.ok) return; // Falha silenciosamente, mantém a imagem do Genius
				const data = await response.json();

				const lastFmArt = data.track.album?.image.find(img => img.size === 'extralarge')['#text'];

				// Se encontramos uma imagem de alta qualidade no Last.fm, atualizamos o estado!
				if (lastFmArt) {
				setSongImgLastFmUrl(lastFmArt);
				}
			} catch (error) {
				console.error("Não foi possível aprimorar a arte do álbum com o Last.fm:", error);
				// Se der erro, não fazemos nada, apenas mantemos a imagem do Genius
			}
		};

		fetchAlbumArt();
	}, [songData, navigate])
	

	// ---

	const [songLyrics, setSongLyrics] = useState(null); // useState para guardar as lyrics que vão ser webscrapped
	const [isLoading, setIsLoading] = useState(null); // useState isLoading enquanto o fetch está sendo feito
	const [songLyricsError, setSongLyricsError] = useState(null); // useState para guardar erro caso o webscrapping tenha falhado


	useEffect(() => { // useEffect inicial que vai 
		
		if (!songData) { // se não houver dados, não faz nada (será redirecionado)
			navigate('/');
			return;
		}

		// Função interna para organizar o código
		const fetchLyrics = async () => {

			setIsLoading(true);
			setSongLyricsError('');

			const params = new URLSearchParams({ // gera uma string com os params à serem enviados para a função server-side get-lyrics
				id: songData.id,
				artist: songData.artist,
				track: songData.track,
				geniusSongUrl: songData.geniusSongUrl,
			});

			const url = `/api/get-lyrics?${params.toString()}`; // gera a url para o fetch

			try {
				const response = await fetch(url);

				if (!response.ok) {
					const err = await response.json();
					throw new Error(err.message || 'Não foi possível carregar a letra.');
				}

				const data = await response.json();
				setSongLyrics(data.lyrics); // caso a resposta esteja ok, seta as lyrics
			} catch (err) {
				setSongLyricsError(err.message);
				console.log(songLyricsError)
			} finally {
				setIsLoading(false);
			}
		};

		// Chamamos a função de busca assim que o efeito é executado
		fetchLyrics();

	}, [songData, navigate]); // O efeito depende dos dados da música para rodar

	// ----

	// se songData ainda não existe, não renderizamos nada (ou um loading) para evitar o erro até que o retorno do useEffect carregue
	if (!songData) {
		return <div>Carregando...</div>;
	}

	// se o código chegou até aqui, é 100% seguro que 'songData' existe.
	return (
		<div className="container mx-auto p-8">
			<h1 className="text-4xl font-bold mb-4">Prévia da Imagem</h1>
			
			<div className="p-8 bg-white rounded-lg shadow-xl max-w-md mx-auto">
				<h2 className="text-3xl font-bold text-center">{songData.track}</h2>
				<p className="text-xl text-center text-gray-600 mb-4">{songData.artist}</p>
				<div className="w-full h-64 bg-gray-300 rounded flex items-center justify-center mb-4">
					<img className="h-full" src={songData.albumArtUrl}/>
				</div>
			
			</div>

			<div>{songLyrics}</div> {/* tá certo as lyrics, estão com \n o problema é que div não lê \n */}

			<div className="text-center mt-8">
				<button onClick={() => navigate('/')} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
					Voltar
				</button>
			</div>

			<img className="h-full" src={songImgLastFmUrl}/>
		</div>
	);
}