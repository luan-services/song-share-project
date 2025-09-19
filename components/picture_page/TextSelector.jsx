import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

export const TextSelector = ({onSetText, songFullText}) => {

	const [isExpanded, setIsExpanded] = useState(false); // isExpanded serve para o dropdown do setter do texto

	// const textArray = songFullText?.plainLyrics.replace(/\n+/g, '\n')?.split('\n');
	const textArray = songFullText?.plainLyrics.replace(/\n+/g, '\n')?.split('\n');
    
	console.log(textArray)

	return (
		<div className='flex flex-col w-full bg-white border-1 border-gray-300 shadow-sm rounded-lg transition-all duration-300'>
		
			{/* div p dar toggle no dropdown */}
			<div className="w-full flex justify-between items-center px-4 py-4 text-custom-charcoal font-medium">
				
				<span className="text-sm sm:text-[16px]">Adicione texto ao sticker</span>
				<button type="button" onClick={() => setIsExpanded(!isExpanded)}>
					<span className={`inline-block transform transition-transform duration-300 ease-in-out ${isExpanded ? 'rotate-180' : ''}`}>
						<FontAwesomeIcon icon={faCaretDown}></FontAwesomeIcon>
					</span>
				</button>
			</div>

			<div className="border-gray-200 border-b-1"/>


			{/* div com detalhes da letra */}
			<div className={`w-full flex flex-col px-4 origin-top transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-96 opacity-100 py-2' : 'max-h-0 opacity-0 overflow-hidden'}`}>
					<ul className="mt-2 space-y-1">
						<li className="p-2 hover:bg-gray-300 rounded-md cursor-pointer">texto 1</li>
						<li className="p-2 hover:bg-gray-300 rounded-md cursor-pointer">texto 2</li>
						<li className="p-2 hover:bg-gray-300 rounded-md cursor-pointer">texti 3</li>
					</ul>
				</div>
		
		</div>
	)
}
