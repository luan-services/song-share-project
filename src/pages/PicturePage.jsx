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

    // ---xxx useState e Effect para fazer o fetch do texto da música e salvar.

    const [songDataText, setSongDataText] = useState(null);
	const [songDataTextIsLoading, setSongDataTextIsLoading] = useState(true);

    useEffect(() => { 

        if (!songData) { // sem dado de música, retorna
            return;
        }

        const fetchText = async (artist, track) => {

            if (!artist.trim() || !track.trim()) {
                return;
            }
            
            setSongDataText(null);
			setSongDataTextIsLoading(true);

            try {
                const query = `https://lrclib.net/api/search?q=${artist} ${track}`;
            
                const response = await fetch(query);

                if (!response.ok) {
                    throw new Error(`Não foi possível fazer o fetch dos dados. (status: ${response.status})`);
                }

                const data = await response.json();

                if (!data || data.length === 0) {
                    throw new Error('Nenhum resultado para essa música');
                }
                const filteredData = data.filter((data) => {
                    return data.trackName.toLowerCase().trim() === track.toLowerCase().trim()
                });

                setSongDataText(filteredData[0] ?? data[0] ?? null);

            } catch (err) {
                console.error("Não foi possível fazer o fetch dos dados.", err.message);
            } finally {
				setSongDataTextIsLoading(false);
            }
        };

        fetchText(songData.artist, songData.track);


    }, [songData])

	// se songData ainda não existe, não renderizamos nada (ou um loading) para evitar o erro até que o retorno do useEffect carregue
	if (!songData || songDataTextIsLoading) {
		return (
			<LoadingPage/>
		)
	}

	// se o código chegou até aqui, é 100% seguro que 'songData' existe.
	return (
		<div className="min-h-screen px-2 md:px-12 py-4 sm:py-8 flex flex-col items-center justify-between">
			
			<nav className="text-center w-full">
				<ReturnButton onClick={() => navigate('/')}/>
			</nav>

			<main className="flex flex-col items-center justify-center w-full pb-8">	

				<section className="flex flex-col w-full gap-2 pb-8 tems-center justify-center max-w-180">
                    <span className="text-4xl font-bold py-2 pb-4 text-center">Costumize seu sticker do seu jeito</span>
                    <span className='text-center text-sm sm:text-[16px]'>Selecione o tipo e a cor do background, decida entre adicionar texto ou não, e em seguida faça o download ou compartilhe o resultado com seus amigos!</span>
                </section>

				<span className="text-sm self-center">
					*Considere adicionar um link para nosso site no seu story. =)
				</span>	
				
				<section className='container flex-col items-center justify-center'>

					<PictureContainer songData={songData} songDataText={songDataText}/>
				</section>


			</main>
			<TermsFooter/>
		</div>
	);
}