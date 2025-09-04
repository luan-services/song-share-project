import React from 'react'
import { useNavigate } from 'react-router-dom'; // navigate é um state do react que possibilita ir para outras páginas, como o link, mas
// ao invés de ser um Link, navigate é uma função (também possibilita enviar dados via states

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
    
    // a chamada do hook nos dá uma função, que por convenção chamamos de 'navigate', como se fosse o router em next.js
    const navigate = useNavigate();


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
        <div className="space-y-4">
            {dummySongs.map((song) => (
            <div key={song.id} className="p-4 bg-white rounded-lg shadow-md flex justify-between items-center">
                <div>
                <h2 className="text-xl font-semibold">{song.title}</h2>
                <p className="text-gray-600">{song.artist}</p>
                <p className="text-sm text-gray-500 italic mt-1">"{song.lyricsSnippet}"</p>
                </div>
                <div className="flex space-x-2">
                <button
                    onClick={() => handleGenerateImage(song, false)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Gerar Imagem
                </button>
                <button
                    onClick={() => handleGenerateImage(song, true)}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                    Gerar com Letra
                </button>
                </div>
            </div>
            ))}
        </div>
    )
}
