import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect, useMemo } from 'react';

export const TextSelector = ({ onSetText, songFullText }) => {
	// estado para abrir ou fechar a caixa de texto
    const [isExpanded, setIsExpanded] = useState(false);

    // estado para guardar o índice inicial e final do texto selecionado
    const [selection, setSelection] = useState({ start: null, end: null });

    const textArray = useMemo(() => { // transforma o fetch do texto em um array
        return songFullText?.plainLyrics.split('\n') || [];
    }, [songFullText]);
    
	useEffect(() => { // esse useEffect 'envia' o texto selecionado para o componente pa
		if (selection.start !== null && selection.end !== null) {
			// Extrai as linhas selecionadas do array original
			const selectedLines = textArray.slice(selection.start, selection.end + 1);
			// Envia como um array de strings
			onSetText(selectedLines);
			return;
		} 
			// Limpa o texto se não houver seleção, enviando um array vazio
			onSetText([]);
	}, [selection, onSetText, textArray]);


    const handleLineClick = (clickedIndex) => {
        // Ignora o clique se a linha for vazia
        if (textArray[clickedIndex] === '') {
            return;
        }

        const { start } = selection;

        // 1. Se não há nada selecionado, inicia uma nova seleção.
        // 2. Se o clique for ANTES da seleção atual, reinicia a seleção a partir do ponto clicado.
        if (start === null || clickedIndex < start) {
            setSelection({ start: clickedIndex, end: clickedIndex });
            return;
        }

        // 3. Se o clique for DEPOIS da seleção atual, expande a seleção.
        if (clickedIndex >= start) {
            // Pega o trecho entre o início da seleção e o ponto clicado
            const potentialSelection = textArray.slice(start, clickedIndex + 1);
            
            // Conta quantas linhas NÃO vazias existem nesse trecho
            const nonEmptyLinesCount = potentialSelection.filter(line => line !== '').length;

            // Se for menor ou igual a 5, expande a seleção
            if (nonEmptyLinesCount <= 5) {
                setSelection({ ...selection, end: clickedIndex });
            } else {
                // Se for maior que 5, reinicia a seleção a partir do ponto clicado
                setSelection({ start: clickedIndex, end: clickedIndex });
            }
        }
    };

    return (
        <div className='flex flex-col w-full bg-white border-1 border-gray-300 shadow-sm rounded-lg transition-all duration-300 mt-4'>
            {/* Cabeçalho do seletor */}
            <div className="w-full flex justify-between items-center px-4 py-4 text-custom-charcoal font-medium">
                <span className="text-sm sm:text-[16px]">Adicione texto ao sticker</span>
                <button type="button" onClick={() => setIsExpanded(!isExpanded)}>
                    <span className={`inline-block transform transition-transform duration-300 ease-in-out ${isExpanded ? 'rotate-180' : ''}`}>
                        <FontAwesomeIcon icon={faCaretDown} />
                    </span>
                </button>
            </div>

            <div className="border-gray-200 border-b-1" />

            {/* Corpo com a listagem de letras */}
            <div className={`w-full flex flex-col px-4 origin-top transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-96 opacity-100 py-2 overflow-y-auto' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                <div className="w-full max-h-72">
                    {textArray.map((line, index) => {
                        const isEmpty = line === '';

						if (isEmpty) {
							return <div key={index} className="h-[12px] lg:h-[16px]" />;
						}

                        const isSelected = selection.start !== null && index >= selection.start && index <= selection.end;

                        // --- NOVA LÓGICA ADICIONADA AQUI ---
                        let isPotentiallySelectable = false;
                        // Verifica se a linha é uma candidata à seleção
                        if (selection.start !== null && !isSelected && index > selection.end && !isEmpty) {
                            // Calcula o tamanho da seleção potencial
                            const potentialSelection = textArray.slice(selection.start, index + 1);
                            const nonEmptyLinesCount = potentialSelection.filter(l => l !== '').length;
                            // Se estiver dentro do limite, marca como selecionável
                            if (nonEmptyLinesCount <= 5) {
                                isPotentiallySelectable = true;
                            }
                        }
                        // --- FIM DA NOVA LÓGICA ---

                        return (
                            <button
                                key={index}
                                type="button"
                                onClick={() => handleLineClick(index)} 
                                // Classes de estilo atualizadas
                                className={`
                                    w-full text-start rounded-md mb-1.5 transition-colors duration-150
                                    ${isEmpty ? 'cursor-default' : 'cursor-pointer'}
                                    ${isSelected ? 'bg-custom-secundary-red text-white' : ''}
                                    ${isPotentiallySelectable ? 'bg-custom-light-red' : ''}
                                `}
                            >
                                <p translate="no" className={`px-2 py-1 text-[12px] lg:text-[16px] font-medium select-none ${isEmpty ? 'h-[12px] lg:h-[16px]' : ''}`}>
                                    {line}
                                </p>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};