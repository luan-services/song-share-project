// ./components/templates/TextTemplate.js

import SongStickerIcon from "../../src/assets/images/song_sticker_reverse_icon.png"
import SongStickerBlackIcon from "../../src/assets/images/song_sticker_reverse_icon_black.png"
import { getContrastingShade, isInnerBgLight } from "../../lib/color-filter";


export const TextTemplate = ({ songText, contentRef, artUrl, track, artist, bgStyle }) => {
	
    let outerBgStyle = {}; // cor do fundo

	let innerBgStyle = {}; // cor do interior da div

	// pega a cor mais clara, ou mais escura, para por no interior da div
	const contrastingColor = bgStyle.type === 'img' ? '#121212' : (bgStyle.type === 'gradient' || bgStyle.type === 'darkGradient') ? getContrastingShade(bgStyle.data[0]) : getContrastingShade(bgStyle.data);

	// função para saber se a cor da div do exterior é 'clara' ou 'escura', para definir a cor do texto
	const bgIsLight = isInnerBgLight(contrastingColor);

    switch (bgStyle.type) {
        case "color": 
        case "vibrant": 
        case "muted":
            outerBgStyle = { backgroundColor: bgStyle.data };
			innerBgStyle = { backgroundColor: contrastingColor };
            break;
        case "img": // caso o fundo seja imagem, o innerBg passa a ser preto, como no sticker sem lyrics
            outerBgStyle = { backgroundImage: `url(${bgStyle.data})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'};
			innerBgStyle = { backgroundColor: '#121212' };
            break;
        case "gradient":
        case "darkGradient":
            outerBgStyle = { backgroundImage: `linear-gradient(to bottom, ${bgStyle.data[0]}, ${bgStyle.data[1]})` };
			innerBgStyle = { backgroundColor: contrastingColor };
            break;
        default:
            outerBgStyle = { backgroundColor: '#000' };
			innerBgStyle = { backgroundColor: '#121212' };
            break;
    }

    return (
		/* fundo colorido original */
		<div className="w-full h-full flex flex-col items-center justify-center px-[21.6px] sm:px-[27px] lg:px-9" style={outerBgStyle}>

			<div ref={contentRef} className="w-full relative flex flex-col items-center p-[9.6px] sm:p-[12px] lg:p-4 gap-[6px] sm:gap-[7.5px] lg:gap-2.5">

				{/*fundo colorido com cor mais escura/clara, baseado no original*/}
				<div className="absolute inset-0 bg-bottom-center rounded-[7.2px] sm:rounded-[9px] lg:rounded-xl lg:shadow-lg" style={innerBgStyle}/>

				{/* div do texto e imagem */}
				<div className="z-20 w-full flex-row flex items-center justify-between">
					<div className="z-20 truncate">
						<p translate="no" className={`text-[9.6px] sm:text-[12px] lg:text-[16px] font-bold  truncate select-none ${bgIsLight ? 'text-custom-charcoal/90' : 'text-white'}`}>{track}</p>
						<p translate="no" className={`text-[8.4px] sm:text-[10.5px] lg:text-[14px]  truncate select-none ${bgIsLight ? 'text-custom-charcoal' : 'text-gray-100'}`}>{artist}</p>
					</div>
					
					<img src={artUrl} alt={`Capa de ${track}`} draggable="false" className="z-20 w-[33.6px] h-[33.6px] sm:w-[42px] sm:h-[42px] lg:w-[56px] lg:h-[56px] object-cover select-none pointer-events-none" crossOrigin="anonymous"/>
				</div>

				{/*linebreak*/}
				<div className={`w-full border-b-1  z-20 ${bgIsLight ? 'border-custom-charcoal/30' : 'border-white/50'}`}></div>

				{/*div da letra, se a linha é '\n', dá espaço, caso contrário, escreve a linha*/}
				<div className={`w-full z-20 font-medium ${bgIsLight ? 'text-custom-charcoal' : 'text-white'}`}>
					{songText.map((line, index) => {
						return <p translate="no" key={`line-${index}`} className={`text-[9.6px] sm:text-[12px] lg:text-[16px] mb-0.5 font-medium select-none ${line == '' ? 'h-[9.6px] sm:h-[12px] lg:h-[16px]' : ''}`}>{line}</p>
					})}
				</div>

				{/*linebreak*/}
				<div className={`w-full border-b-1 hidden z-20 ${bgIsLight ? 'border-custom-charcoal/30' : 'border-white/50'}`}></div>

				{/* logo */}
				<div className="z-20 self-end flex gap-[4.8px] sm:gap-[6px] lg:gap-2 items-center">
					<img src={bgIsLight ? SongStickerBlackIcon : SongStickerIcon} alt={`Logo`} draggable="false" className="w-[9.6px] sm:w-[12px] lg:w-4 inline select-none pointer-events-none" crossOrigin="anonymous"/>
					<span translate="no" className={`text-[7.2px] sm:text-[9px] lg:text-xs font-medium select-none ${bgIsLight ? 'text-custom-charcoal' : 'text-gray-100'}`}>Song Sticker</span>
				</div>

			</div>
		</div>
    );
};