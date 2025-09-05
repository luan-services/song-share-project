import React from 'react'
import { useNavigate } from 'react-router-dom'; // navigate é um state do react que possibilita ir para outras páginas, como o link, mas
// ao invés de ser um Link, navigate é uma função (também possibilita enviar dados via states
import { useState } from 'react';

import { SongForm } from '../../components/SongForm.jsx'; // componente SongForm
import { SongContainer } from '../../components/SongContainer.jsx';

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
                track: hit.result.track,
                artist: hit.result.primary_artist.name,
                albumArtThumbnailUrl: hit.result.song_art_image_thumbnail_url,
                albumArtUrl: hit.result.song_art_image_url, 
            }));

            if (songs.length === 0) {
                setError('Nenhum resultado encontrado para esta busca.');
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
        <>
            <div>Search Song</div>
            
            <div>
                <SongForm onSearch={handleSearch} isLoading={isLoading}></SongForm>
            </div>
            
            <div>
                <SongContainer onShare={handleShareSong} songList={searchResults}/>
            </div>
        </>
    )
}
