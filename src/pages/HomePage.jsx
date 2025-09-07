import React from 'react'
import { useNavigate } from 'react-router-dom'; // navigate é um state do react que possibilita ir para outras páginas, como o link, mas
// ao invés de ser um Link, navigate é uma função (também possibilita enviar dados via states
import { useState } from 'react';

import { SongForm } from '../../components/home_page/SongForm.jsx'; // componente SongForm
import { SongContainer } from '../../components/home_page/SongContainer.jsx';
import { TermsFooter } from '../../components/TermsFooter.jsx';

export const HomePage = () => {

    // a chamada do hook nos dá uma função, que por convenção chamamos de 'navigate', como se fosse o router em next.js
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false); // usado pelo fetch de dados para definir que está carregando

    const [searchResults, setSearchResults] = useState([]); // usado para guardar o texto da busca

    const [error, setError] = useState(null); // usado para setar erros para o usuário ler

    // o fetch do handleSearch não precisa estar dentro de um useEffect pois ele é uma resposta direto à um click de botão (envio de formulário)
    const handleSearch = async (searchTerm) => {
        setIsLoading(true);
        setError(null);
        setSearchResults([]);

        const url = `/api/fetch-genius?term=${encodeURIComponent(searchTerm)}`; // faz o fetch com os termos

        try {
            const response = await fetch(url);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Falha ao buscar as músicas.');
            }
            const data = await response.json();
            console.log(data.response.hits)
            const songs = data.response.hits.map(hit => ({
                id: hit.result.id,
                geniusSongUrl: hit.result.url,
                track: hit.result.title,
                artist: hit.result.primary_artist.name,
                albumArtUrl: hit.result.song_art_image_url, 
            }));

            if (songs.length === 0) {
                setError('Nenhum resultado encontrado para essa busca.');
            }
            setSearchResults(songs);

        } catch (err) {
            setError(err.message);
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    // função que vai ser chamada após o usuário clicar em Generate ou Generate With Image, song é um objeto com os dados do som, e withLyrics é um bool
    const handleShareSong = (songData) => {
        console.log("Navegando para /picture com os dados da música:", songData);

        navigate('/picture', { // <- chama o state navigate e redireciona para a url
            state: { // <- state gera objetos useState 'songData' que vai ser acessado na outra página com o state 'useLocation'
                songData: songData,
            },
        });
    };

    return (
        <div className="min-h-screen px-2 md:px-12 py-8 flex flex-col justify-between">
            <main className="w-full flex flex-col items-center justify-center">
                <section className="flex flex-col w-full text-center items-center justify-center">
                    <span className="text-4xl font-bold py-8">O que você está ouvindo?</span>

                    <SongForm onSearch={handleSearch} isLoading={isLoading}></SongForm>
                </section>
                
                <section className="flex flex-col w-full justify-center items-center">
                    {error ? <p className="font-bold">Erro: <span className="font-normal">{error}</span></p> : null}
                    <SongContainer onShare={handleShareSong} songList={searchResults} isLoading={isLoading}/>
                </section>

                <section className="flex flex-col w-full gap-2 tems-center justify-center max-w-180">
                    <span className="text-3xl font-bold py-8 text-center">Compartilhe suas músicas favoritas com amigos!</span>

                    <span className='text-center text-sm sm:text-[16px]'>Procure pelo som que você está ouvindo agora, crie um story totalmente personalizado e compartilhe-o no Instagram, Whatsapp, Facebook, entre outros.</span>
                    <span className='text-center text-sm sm:text-[16px]'>Para pesquisar uma música, procure pelo nome do artista + nome da música, ou escreva nome do artista + um trecho da música. </span>
                </section>
            </main>
            <TermsFooter/>
        </div>
    )
}
