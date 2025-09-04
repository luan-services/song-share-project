import React, { useState } from 'react'

// isLoading -> vem de HomePage, ativo quando o fetch está carregando
// onSearch -> vem de HomePage, função fetch

export const SongForm = ({isLoading, onSearch}) => {
    // states para guardar os termos escritos no formulário.
    const [songTitle, setSongTitle] = useState('');
    const [songArtist, setSongArtist] = useState('');
    const [songLyrics, setSongLyrics] = useState('');

    const [formError, setFormError] = useState(null);

    const handleSubmit = (event) => {
        event.preventDefault(); // previne o comportamento default do submit do form que é recarregar a página

        // caso 1: usuário não preencheu artista
        if (songArtist == '') {
            setFormError("Campo artista precisa ser preenchido");
            return;
        }

        // caso 2: usuário preencheu artista, mas não preencheu letra/música
        if (songArtist && (songTitle == '' && songLyrics == '')) {
            setFormError("Campo título ou letra precisa ser preenchido.");
            return;
        }

        let searchTerm = `${songArtist} ${songTitle} ${songLyrics}`.trim().replace(/\s+/g, ' ') // cria uma query para buscar os dados;

        onSearch(searchTerm); // chama a função on Search e passa a query.

    };


    return (
        <form onSubmit={(event) => handleSubmit(event)}>
            <div>
                <input type="text" value={songTitle} onChange={(e) => setSongTitle(e.target.value)} placeholder="título da música"/>
                <input type="text" value={songArtist} onChange={(e) => setSongArtist(e.target.value)} placeholder="artista/banda"/>
                <input type="text" value={songLyrics} onChange={(e) => setSongLyrics(e.target.value)} placeholder="letra"/>
            </div>
            <p className="h-12">{formError ? formError : ''}</p>

            <button type="submit" disabled={isLoading}>
                {isLoading ? 'Buscando...' : 'Buscar'}
            </button>
        </form>
    )
}