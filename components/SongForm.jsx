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

        onSearch(searchTerm); // chama a função onSearch e passa a query.

    };


    return (
        <form className="w-full max-w-212" onSubmit={(event) => handleSubmit(event)}>
            <div className="flex flex-col gap-2 w-full p-4">
                <div className="flex flex-col sm:flex-row w-full gap-2">
                    <input className="border-2 w-full border-custom-charcoal rounded-r-full rounded-l-full px-4 py-1.5 focus:outline-none text-sm text-center" type="text" value={songTitle} onChange={(e) => setSongTitle(e.target.value)} placeholder="Título da Música"/>
                    <input className="border-2 w-full border-custom-charcoal rounded-r-full rounded-l-full px-4 py-1.5 focus:outline-none text-sm text-center" type="text" value={songArtist} onChange={(e) => setSongArtist(e.target.value)} placeholder="Artista ou Banda"/>
                </div>

                <div className="flex w-full gap-2">
                    <input className="border-2 w-full border-custom-charcoal rounded-r-full rounded-l-full px-4 py-1.5 focus:outline-none text-sm text-center" type="text" value={songLyrics} onChange={(e) => setSongLyrics(e.target.value)} placeholder="Letra"/>
                </div>

                <p className="h-12 text-custom-primary-red">{formError ? formError : ''}</p>

                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Buscando...' : 'Buscar'}
                </button>
            </div>
        </form>
    )
}