import { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom'; // navigate é um state do react que possibilita ir para outras páginas, como o link, mas
// ao invés de ser um Link, navigate é uma função (também possibilita enviar dados via states

import { useLocation } from 'react-router-dom'; // location é um state do react que possibilita ler os dados que foram passados via navigate
import { TermsFooter } from '../../components/TermsFooter';
import { PictureContainer } from '../../components/picture_page/PictureContainer';
import { LoadingPage } from "../../src/layout/LoadingPage"
import { ReturnButton } from "../../components/ReturnButton"

export const PicturePage = () => {
	
	const location = useLocation(); // hook para acessar informações da rota atual, incluindo o 'state'.
	const navigate = useNavigate(); // hook para podermos redirecionar o usuário, se necessário.

	// EXTRAINDO OS DADOS DE FORMA SEGURA
	// location.state busca para ver se o navigate que levou até a pagina atual enviou algum state, se sim, ele salva o estado nas duas const
	const songData = location.state?.songData ? location.state.songData : undefined;

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

	useEffect(() => { // useEffect para salvar os dados escolhidos no firebase

		const storeData = async () => {

			const songPayload = {
				id: String(songData.id),
				artist: songData.artist, 
				track: songData.track,
				lyrics: '.'
			};

			try {
				const response = await fetch('/api/store-data', { 
					method: 'POST',
					headers: {
						'Content-Type': 'application/json', 
					},
					body: JSON.stringify(songPayload),
				});

				if (!response.ok) {
					const err = await response.json();
					throw new Error(err.message || 'Não foi possível salvar dados.');
				}

				const data = await response.json();
				
				console.log('Resposta do store-data:', data.message);
				
			} catch (err) {
				console.error(err);
			}
		};

		// chama a função de busca assim que o efeito é executado
		storeData();

	}, [songData, navigate]); // o efeito depende dos dados da música para rodar


	// se songData ainda não existe, não renderizamos nada (ou um loading) para evitar o erro até que o retorno do useEffect carregue
	if (!songData) {
		return (
			<LoadingPage/>
		)
	}

	// se o código chegou até aqui, é 100% seguro que 'songData' existe.
	return (
		<div className="min-h-screen px-2 md:px-12 py-4 md:py-8 flex flex-col items-center justify-between">
			
			<nav className="text-center w-full">
				<ReturnButton onClick={() => navigate('/')}/>
			</nav>

			<main className="flex flex-col items-center justify-center w-full">	

				<section className="flex flex-col w-full gap-2 pb-8 tems-center justify-center max-w-180">
                    <span className="text-3xl font-bold py-4 text-center">Costumize sua música do seu jeito</span>
                    <span className='text-center text-sm sm:text-[16px]'>Selecione o background, selecione o formato da imagem, ou adicione texto e em seguida faça o download ou compartilhe o resultado com seus amigos!</span>
                </section>
			
				<section className='container flex- flex-col items-center justify-center'>
					<PictureContainer songData={songData} selectedLyrics={null}/>
				</section>


			</main>
			<TermsFooter/>
		</div>
	);
}