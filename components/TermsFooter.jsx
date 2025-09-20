import React from 'react'
import { Link } from 'react-router-dom'

export const TermsFooter = () => {
	return (
		<div className='flex flex-col justify-center gap-1 p-4'>
			<div className="flex flex-col md:flex-row items-center text-center justify-center gap-2">
				<span translate='no' className="font-medium">© 2025 Song Sticker. Todos os direitos reservados. </span>
				<span >
					<Link to="/termos" className="cursor-pointer">Termos de Serviço </Link> | 
					<Link to="/privacidade" className="cursor-pointer"> Políticas de Privacidade</Link>
				</span>

			</div>

			<div className="flex justify-center gap-2">
				<p className="text-sm"> 
					Dados fornecidos por <a href="https://developers.deezer.com/" target="_blank" rel="noopener noreferrer" translate='no' className="underline">Deezer</a> e <a href="https://lrclib.net/" target="_blank" rel="noopener noreferrer" translate='no' className="underline">lrclib</a>.
				</p>
			</div>
			
		</div>
	)
}

