// ./components/templates/TextTemplate.js

import SongStickerIcon from "../../src/assets/images/song_sticker_reverse_icon.png"

export const TextTemplate = ({ songText, contentRef, artUrl, track, artist, bgStyle }) => {
    // A lógica para definir o estilo do background é idêntica à do ClassicTemplate.
    // Podemos reutilizá-la aqui.
    let finalStyle = {}; 

    switch (bgStyle.type) {
        case "color": 
        case "vibrant": 
        case "muted":
            finalStyle = { backgroundColor: bgStyle.data };
            break;
        case "img":
            finalStyle = { backgroundImage: `url(${bgStyle.data})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'};
            break;
        case "gradient":
        case "darkGradient":
            finalStyle = { backgroundImage: `linear-gradient(to bottom, ${bgStyle.data[0]}, ${bgStyle.data[1]})` };
            break;
        default:
            finalStyle = { backgroundColor: '#000' };
            break;
    }

    return (
		<div className="w-full h-full flex flex-col items-center justify-center px-[21.6px] sm:px-[27px] lg:px-9" style={finalStyle}>

			<div ref={contentRef} className="w-full relative flex flex-col items-center p-[9.6px] sm:p-[12px] lg:p-4 gap-[6px] sm:gap-[7.5px] lg:gap-2.5">

				{/*fundo colorido opaco*/}
				<div className="absolute inset-0 bg-bottom-center rounded-[7.2px] sm:rounded-[9px] lg:rounded-xl lg:shadow-lg border-1 border-black/20" style={finalStyle?.backgroundImage ? { backgroundColor: '#121212' } : finalStyle}/>

				<div className="z-20 w-full flex-row flex items-center justify-between">

					<div className="z-20">
						<p translate="no" className="text-[9.6px] sm:text-[12px] lg:text-[16px] font-bold text-white truncate select-none">{track}</p>
						<p translate="no" className="text-[8.4px] sm:text-[10.5px] lg:text-[14px] text-gray-100 truncate select-none">{artist}</p>
					</div>
					
					<img src={artUrl} alt={`Capa de ${track}`} draggable="false" className="z-20 w-[33.6px] h-[33.6px] sm:w-[42px] sm:h-[42px] lg:w-[56px] lg:h-[56px] object-cover pointer-events-none" crossOrigin="anonymous"/>
				</div>

				<div className="w-full border-b-1 border-white/50 z-20"></div>

				<div className="w-full z-20 text-white font-medium">
					<p translate="no" className="text-[9.6px] sm:text-[12px] lg:text-[16px] font-medium text-white truncate select-none">sdfdsf</p>
					<p translate="no" className="text-[9.6px] sm:text-[12px] lg:text-[16px] font-medium text-white truncate select-none">sdfdsf</p>
					<p translate="no" className="text-[9.6px] sm:text-[12px] lg:text-[16px] font-medium text-white truncate select-none">sdfdsf</p>
				</div>
				
				<div className="w-full border-b-1 border-white/50 z-20"></div>

				{/* logo */}
				<div className="z-20 self-end flex gap-[4.8px] sm:gap-[6px] lg:gap-2 items-center">
					<img src={SongStickerIcon} alt={`Logo`} draggable="false" className="w-[9.6px] sm:w-[12px] lg:w-4 inline pointer-events-none" crossOrigin="anonymous"/>
					<span translate="no" className="text-[7.2px] sm:text-[9px] lg:text-xs text-gray-100 font-medium select-none">Song Sticker</span>
				</div>

			</div>
		</div>
    );
};