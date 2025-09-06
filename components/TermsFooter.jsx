import React from 'react'
import { Link } from 'react-router-dom'

export const TermsFooter = () => {
	return (
		<div className='flex flex-col justify-center gap-1 p-4'>
			<div className="flex justify-center gap-2">
				<span className="font-medium">© 2025 Song Share. Todos os direitos reservados.</span>
				<Link to="/termos" className="cursor-pointer">Termos de Serviço</Link>
				<Link to="/privacidade" className="cursor-pointer">Políticas de Privacidade</Link>
			</div>

			<div className="flex justify-center gap-2">
				<p className="text-sm"> 
					Dados fornecidos por <a href="https://www.last.fm/api" target="_blank" rel="noopener noreferrer" className="underline"> Last.fm </a> e <a href="https://genius.com" target="_blank" rel="noopener noreferrer" className="underline"> Genius</a>.
				</p>
			</div>
			
		</div>
	)
}

