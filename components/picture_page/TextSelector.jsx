import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faBan } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect, useMemo } from 'react';

export const TextSelector = ({ onSetText, songFullText }) => {
	// estado para abrir ou fechar a caixa de texto
    const [isExpanded, setIsExpanded] = useState(false);

    // estado para guardar o índice inicial e final do texto selecionado
    const [selection, setSelection] = useState({ start: null, end: null });

    const textArray = useMemo(() => { // transforma o fetch do texto em um array
        return songFullText?.plainLyrics.split('\n') || [];
    }, [songFullText]);
    
	useEffect(() => { // esse useEffect 'envia' o texto selecionado para o estado no pai
		if (selection.start !== null && selection.end !== null) {
			const selectedLines = textArray.slice(selection.start, selection.end + 1);
			onSetText(selectedLines); // envia como um array de strings
			return;
		} 
		onSetText([]);
	}, [selection, onSetText, textArray]);


    const handleLineClick = (clickedIndex) => {

        const { start } = selection;

        if (start === null || clickedIndex < start) { // se ainda não tem nada selecionado ou se o clique for ANTES do primeiro index selecionado, começa
            setSelection({ start: clickedIndex, end: clickedIndex });
            return;
        }

        if (clickedIndex >= start) { // se o clique for DEPOIS da seleção atual, expande a seleção

            const potentialSelection = textArray.slice(start, clickedIndex + 1); // pega o trecho entre o início da seleção e o ponto clicado
            
            const nonEmptyLinesCount = potentialSelection.filter(line => line !== '').length; // ve a quantidade total de linhas selecionadas

            if (nonEmptyLinesCount <= 8) {  // Se for menor ou igual a 5, aumenta a seleção
                setSelection({ ...selection, end: clickedIndex });
				return;
            } 
			// Se for maior que 8, reinicia a seleção a partir do ponto clicado
			setSelection({ start: clickedIndex, end: clickedIndex });
        }
    };

    return (
        <div className="px-2 sm:px-0">
            <div className='flex flex-col w-full bg-white border-1 border-gray-300 shadow-sm rounded-lg transition-all duration-300 mt-4'>
                
                {/* botão de toggle no seletor */}
                <button disabled={!(textArray.length > 0)} type="button" onClick={() => setIsExpanded(!isExpanded)} className="w-full flex justify-between items-center px-4 py-4 text-custom-charcoal font-medium cursor-pointer disabled:cursor-default">
                        
                    <span className="text-[14px] lg:text-[16px]">{textArray.length > 0 ? "Clique no texto e adicione ao sticker" : "Não há texto disponível para essa música."}</span>
                    <span className={`inline-block transform transition-transform duration-300 ease-in-out ${textArray.length > 0 ? '' : 'text-custom-primary-red'} ${isExpanded ? 'rotate-180' : ''}`}>
                        
                        {(textArray.length > 0) ? <FontAwesomeIcon icon={faCaretDown} /> : <FontAwesomeIcon icon={faBan} />}
                    </span>
                </button>

                <div className="border-gray-200 border-b-1" />

                {/* Corpo com a listagem de letras */}
                <div className={`w-full flex px-4 origin-top transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-96 opacity-100 py-2 overflow-y-auto' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                    <div className="w-full max-h-88 pr-4">

                        {textArray && textArray.map((line, index) => {
                            const isEmpty = line === '';

                            if (isEmpty) { // se a linha for uma quebra, ela vai ser apenas uma div, sem botão
                                return <div key={index} className="h-[12px] lg:h-[16px]" />;
                            }
                            
                            // se houver uma seleção e o indíce da linha atual estiver entre o primeiro selecionado e o último, essa linha também está selecionada
                            const isSelected = selection.start !== null && index >= selection.start && index <= selection.end;

                            // lógica para saber se a linha atual pode ser selecionada (é uma das 5 próximas linhas)
                            let isPotentiallySelectable = false;

                            // se houver uma seleção e o indíce da linha atual for maior do que o da última selecionada
                            if (selection.start !== null && !isSelected && index > selection.end && !isEmpty) {
                                
                                // calcula quantas linhas já foram selecionadas
                                const potentialSelection = textArray.slice(selection.start, index + 1);
                                const nonEmptyLinesCount = potentialSelection.filter(l => l !== '').length;
                                
                                // se menos de 5 linhas foram selecionadas, a linha atual ganha isPontentiallySelectable = true;
                                if (nonEmptyLinesCount <= 8) {
                                    isPotentiallySelectable = true;
                                }
                            } 

                            return (
                                <button key={index} type="button" onClick={() => handleLineClick(index)}  className={`w-full text-start rounded-md mb-1.5 transition-colors duration-150 ${isEmpty ? 'cursor-default' : 'cursor-pointer'} ${isSelected ? 'bg-custom-secundary-red text-white' : ''} ${isPotentiallySelectable ? 'bg-custom-light-red' : ''}`}>
                                    <p translate="no" className={`px-2 py-1 text-[12px] sm:text-[14px] lg:text-[16px] font-medium select-none ${isEmpty ? 'h-[12px] lg:h-[16px]' : ''}`}>
                                        {line}
                                    </p>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>

    );
};