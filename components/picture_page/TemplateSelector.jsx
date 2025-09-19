import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faFileLines } from '@fortawesome/free-solid-svg-icons';

export const TemplateSelector = ({currentTemplate, onSetTemplate, textExists}) => {

	return (
		<div className="flex flex-wrap flex-col gap-2 py-2">
			<div className="flex justify-end flex-row gap-2">
				<button type="button" disabled={currentTemplate == 'image'} onClick={() => {onSetTemplate('image')}} 
					className='flex bg-custom-secundary-red justify-center py-2 px-2 text-white/95 text-2xl font-medium rounded-lg cursor-pointer transition active:scale-92 disabled:active:scale-100 disabled:brightness-85 disabled:cursor-pointer items-center'>
					<FontAwesomeIcon icon={faImage}></FontAwesomeIcon>
				</button>

				{/* se existe texto, mostra o botão de selecionar texto, caso contrário, fica desativado*/}
				{textExists &&
					<button type="button" disabled={currentTemplate == 'lyric'} onClick={() => {onSetTemplate('lyric')}} 
						className='flex bg-custom-secundary-red justify-center py-2 px-2 text-white/95 text-2xl font-medium rounded-lg cursor-pointer transition active:scale-92 disabled:active:scale-100 disabled:brightness-85 disabled:cursor-pointer items-center'>
						<FontAwesomeIcon icon={faFileLines}></FontAwesomeIcon>
					</button>
				}

				{!textExists &&
					<button type="button" disabled={true}
						className='flex bg-gray-300 justify-center py-2 px-2 text-white/95 text-2xl font-medium rounded-lg cursor-pointer brightness-90 items-center'>
						<FontAwesomeIcon icon={faFileLines}></FontAwesomeIcon>
					</button>
				}

			</div>

		</div>
	)
}

