import {ShareButton} from "./ShareButton"

export const SongContainer = ({onShare, songList, isLoading}) => {
	return (
		<div className="flex flex-col w-full max-w-120 py-2 gap-2">
			
			{/* cas haja resultado da busca, mostra esses textos */}
			{((songList.length > 0)) && 
				<>
					<div className="text-sm italic">Dica: Resultados cujo o título é apenas o nome da música e autor é a banda, possuem dados oficiais, traduções costumam ser fontes não-oficiais.</div>
					<span className="text-sm self-end">
						*Dados das músicas disponibilizados pela API do <a className="underline italic" href="https://www.genius.com/" target="_blank"> Genius </a>
					</span>
				</>
			}

			{isLoading && 
				[0,1,2,3,4,5,6,7,8,9].map((index) => (
					<div key={index} className="flex w-full bg-custom-light-red p-4 gap-2 justify-between rounded-lg border-1 border-custom-secundary-red">
						<div className="flex flex-col gap-2 w-full animate-pulse">
							<div className="flex w-full gap-1">
								<span className="h-4 bg-custom-charcoal rounded w-8/10"></span>
							</div>
							<div className="flex w-full gap-1">
								<span className="h-4 bg-custom-charcoal rounded w-6/10"></span>
							</div>
						</div>
						
						<div className="flex items-center justify-end animate-pulse">
							<div className="flex h-6 bg-custom-primary-red justify-center py-4 px-6 rounded-xl">
							</div>
						</div>
					</div>
        		))
			}


		{songList.map((song, index) => {
			return (
			<div key={song.id} className="flex w-full bg-custom-light-red p-4 gap-2 justify-between rounded-lg border-1 border-custom-secundary-red">
				<div className="flex flex-col w-full gap-1">
					<div className="">
						<span className="font-bold">Título: </span>
						<span>{song.track}</span>
					</div>

					<div className="">
						<span className="font-bold">Autor: </span>
						<span>{song.artist}</span>
					</div>
				</div>
				
				<div className="flex items-center">
					<ShareButton type="button" onClick={() => onShare(song)}/>
				</div>
				
			</div>
			);
		})}
		</div>
	)
}
