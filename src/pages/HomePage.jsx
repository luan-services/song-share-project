import React from 'react'
import { useNavigate } from 'react-router-dom'; // navigate é um state do react que possibilita ir para outras páginas, como o link, mas
// ao invés de ser um Link, navigate é uma função (também possibilita enviar dados via states
import { useState } from 'react';


import { SongForm } from '../../components/SongForm.jsx'; // componente SongForm

const dummySongs = [ // músicas dummy para testar o navigate, remover depois...
  {
    id: 1,
    title: 'Yellow',
    artist: 'Coldplay',
    album: 'Parachutes',
    lyricsSnippet: 'Look at the stars, look how they shine for you...',
  },
  {
    id: 2,
    title: 'Bohemian Rhapsody',
    artist: 'Queen',
    album: 'A Night at the Opera',
    lyricsSnippet: 'Is this the real life? Is this just fantasy?...',
  }]


export const HomePage = () => {

    const [isLoading, setIsLoading] = useState(false); // usado pelo fetch de dados para definir que está carregando

    const [searchResults, setSearchResults] = useState([]); // usado para guardar o texto da busca

    const [error, setError] = useState(null); // usado para setar erros para o usuário ler

    // a chamada do hook nos dá uma função, que por convenção chamamos de 'navigate', como se fosse o router em next.js
    const navigate = useNavigate();

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
        
        const songs = data.response.hits.map(hit => ({
            id: hit.result.id,
            title: hit.result.title,
            artist: hit.result.primary_artist.name,
            albumArtUrl: hit.result.song_art_image_thumbnail_url,
        }));

        if (songs.length === 0) {
            setError('Nenhum resultado encontrado para esta busca.');
        }
        setSearchResults(songs);
        console.log(songs)

        } catch (err) {
            setError(err.message);
        console.error(err);
        } finally {
        setIsLoading(false);
        }
    };

    const handleSelectSong = (song) => {
        navigate('/picture', {
        state: { songData: song },
        });
    };

    // função que vai ser chamada após o usuário clicar em Generate ou Generate With Image, song é um objeto com os dados do som, e withLyrics é um bool
    const handleGenerateImage = (songData, withLyrics) => {
        console.log("Navegando para /picture com os dados da música:", songData);

        
        navigate('/picture', { // <- chama o state navigate e redireciona para a url
            state: { // <- state gera objetos useState 'songData' e 'withLyrics' que vão ser acessados na outra página com o state 'useLocation'
                songData: songData,
                withLyrics: withLyrics,
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
                
            </div>
        </>
    )
}
