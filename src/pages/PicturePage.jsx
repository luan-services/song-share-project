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

	// esse useEffect roda assim que a página inicia, ele checa se songData existe antes de carregar os dados, para evitar quebrar a página
	// caso um usuário acesse /location diretamente pelo browser (sem passar pela homepage)
	useEffect(() => {
		if (!songData) {
			console.error("Acesso direto à /picture não permitido ou estado perdido. Redirecionando...");
			// o mandamos de volta para a página inicial.
			navigate('/');
		}
	}, [songData, navigate]); // Dependências: o efeito roda se songData ou navigate mudarem.

	// ---

	const [lastFmSongData, setLastFmSongData] = useState(null);  // useState para armazenar metadados do lastfm
	const [lastFmIsLoading, setLastFmIsLoading] = useState(true); // useState para impedir que o fetch das lyrics rode enquanto o lastfm não terminar o dele
	const [lastFmError, setLastFmError] = useState(null);

	useEffect(() => { // use Effect para pegar meta-dados melhores do lastfm

		if (!songData) { // se não houver dados, não faz nada (será redirecionado)
			navigate('/');
			return;
		}

		const fetchFromLastFm = async () => {
			const params = new URLSearchParams({
				artist: songData.artist,
				track: songData.track,
			});

			const url = `/api/fetch-lastfm?${params.toString()}`;

			try {
				const response = await fetch(url);

				if (!response.ok) {
					return; // Falha silenciosamente, mantém a imagem do Genius
				}

				const data = await response.json();

				console.log(data)
				// se encontrarmos os dados no lastFm, atualizamos:
				if (data.track) {
					
					const lastFmArt = data.track.album.image.find(img => img.size === 'extralarge')['#text'];
					const lastFmTrack = data.track.name;
					const lastFmArtistName = data.track.artist.name;

					setLastFmSongData({
						artUrl: lastFmArt, 
						track: lastFmTrack, 
						artist: lastFmArtistName,
					})

					console.log(lastFmSongData);
				};

				setLastFmError('Nenhum metadado encontrado para combinação de artista/música');
			} 
			catch (err) {
				console.error("Não foi possível aprimorar metadados com LastFm", err);
				setLastFmError("Não foi possível aprimorar metadados com LastFm, motivo desconhecido");
			}
			finally {
				setLastFmIsLoading(false);
			}
		};

		fetchFromLastFm();

	}, [songData, navigate]);

	// ---

	const [songLyrics, setSongLyrics] = useState(null); // useState para guardar as lyrics que vão ser webscrapped
	const [lyricsIsLoading, setLyricsIsLoading] = useState(null); // useState isLoading enquanto o fetch está sendo feito
	const [songLyricsError, setSongLyricsError] = useState(null); // useState para guardar erro caso o webscrapping tenha falhado

	useEffect(() => { // useEffect para buscar as letras, só roda após o state lastFmIsLoading ser false

		// vai rodar uma primeira vez ao renderizar a página e vai cair aqui, depois só renderiza de novo se lastFmIsLoading mudar
		if (lastFmIsLoading) {
            return;
        };

		// função para fetch de lyrics
		const fetchLyrics = async () => {

			setLyricsIsLoading(true);
			setSongLyricsError('');

			const params = new URLSearchParams({ // gera uma string com os params à serem enviados para a função server-side get-lyrics
				id: songData.id,
				artist: lastFmSongData?.artist? lastFmSongData.artist : songData.artist, // se existe artista do lastfm envia ele
				track: lastFmSongData?.track? lastFmSongData.track : songData.track, // se existe titulo do last fm envia ele
				geniusSongUrl: songData.geniusSongUrl,
				fromLastFm: lastFmSongData? true : false, // variável para dizer se os params estão vindo do LastFm (para atualizar bd)
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
				setLyricsIsLoading(false);
			}
		};

		// Chamamos a função de busca assim que o efeito é executado
		fetchLyrics();

	}, [songData, navigate, lastFmIsLoading, lastFmSongData]); // O efeito depende dos dados da música para rodar

	// ----

	// se songData ainda não existe, não renderizamos nada (ou um loading) para evitar o erro até que o retorno do useEffect carregue
	// se lastFmIsLoading, ainda não terminamos de puxar os dados do lastFm, não renderizamos nada para impedir o código de fazer um 'blink',
	// mudar os dados mostrados do genius e pros do lastFm.	(dessa forma só vai mostrar dados quando tiver certeza que vai ser ou do genius ou do lastfm)
	if (!songData || lastFmIsLoading) {
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

			<img className="h-full" src={lastFmSongData?.artUrl}/>
			<span>{lastFmSongData?.artist} - {lastFmSongData?.track}</span>
		</div>
	);
}