import React, { useState } from 'react'
import { FormButton } from './FormButton';

// isLoading -> vem de HomePage, ativo quando o fetch está carregando
// onSearch -> vem de HomePage, função fetch

export const SongForm = ({isLoading, onSearch}) => {
    // states para guardar os termos escritos no formulário.
    const [songTitle, setSongTitle] = useState('');
    const [songArtist, setSongArtist] = useState('');

    const [formError, setFormError] = useState(null);

    const handleSubmit = (event) => {
        event.preventDefault(); // previne o comportamento default do submit do form que é recarregar a página

        // caso 1: usuário não preencheu artista
        if (songArtist == '') {
            setFormError("Campo artista precisa ser preenchido");
            return;
        }

        // caso 2: usuário preencheu artista, mas não preencheu letra/música
        if (songTitle == '') {
            setFormError("Campo título precisa ser preenchido");
            return;
        }

        let searchTerm = `${songArtist} ${songTitle}`.trim().replace(/\s+/g, ' ') // cria uma query para buscar os dados;
        
        onSearch(searchTerm); // chama a função onSearch e passa a query.

    };


    return (
        <form className="w-full max-w-180" onSubmit={(event) => handleSubmit(event)}>
            <div className="flex flex-col gap-2 w-full p-4 items-center">
                <div className="flex flex-col sm:flex-row w-full gap-2">
                    <input className="w-full focus:outline-none focus:ring-3 focus:ring-custom-charcoal bg-custom-secundary-red rounded-r-full rounded-l-full px-4 py-1.5 text-center placeholder:text-custom-background-sand text-custom-background-sand" type="text" value={songTitle} onChange={(e) => setSongTitle(e.target.value)} placeholder="Título da Música"/>
                    <input className="w-full focus:outline-none focus:ring-3 focus:ring-custom-charcoal bg-custom-secundary-red rounded-r-full rounded-l-full px-4 py-1.5 text-center placeholder:text-custom-background-sand text-custom-background-sand" type="text" value={songArtist} onChange={(e) => setSongArtist(e.target.value)} placeholder="Artista ou Banda"/>
                </div>

                <p className="h-8 text-custom-charcoal">{formError ? formError : ''}</p>

                <FormButton type="submit" disabled={isLoading}>
                    {isLoading ? 'Buscando...' : 'Buscar'}
                </FormButton>
            </div>
        </form>
    )
}