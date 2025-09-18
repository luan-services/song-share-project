import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faFileLines } from '@fortawesome/free-solid-svg-icons';

export const LyricsSelector = ({currentTemplate, onSetTemplate, onSetLyrics}) => {

	return (
		<div className="flex flex-wrap flex-col gap-2 px-2 py-2">
			<div className="flex justify-center flex-row gap-4">
				<button type="button" disabled={currentTemplate == 'image'} onClick={() => onSetTemplate('image')} 
					className='flex bg-custom-secundary-red justify-center py-2 px-2 text-custom-charcoal text-2xl font-medium rounded-lg cursor-pointer transition active:scale-92 disabled:active:scale-100 disabled:brightness-85 disabled:cursor-pointer items-center'>
					<FontAwesomeIcon icon={faImage}></FontAwesomeIcon>
				</button>

				<button type="button" disabled={currentTemplate == 'lyric'} onClick={() => onSetTemplate('lyric')} 
					className='flex bg-custom-secundary-red justify-center py-2 px-2 text-custom-charcoal text-2xl font-medium rounded-lg cursor-pointer transition active:scale-92 disabled:active:scale-100 disabled:brightness-85 disabled:cursor-pointer items-center'>
					<FontAwesomeIcon icon={faFileLines}></FontAwesomeIcon>
				</button>

			</div>
			
			{currentTemplate == 'lyric' &&
				<div className='bg-custom-secundary-red'>
					d
				</div>
			}

		</div>
	)
}

