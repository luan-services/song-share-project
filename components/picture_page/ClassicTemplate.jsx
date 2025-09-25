// procurar biblioteca para encontrar cores complementares, inversas, etc no futuro!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

import SongStickerIcon from "../../src/assets/images/song_sticker_reverse_icon.png"

export const ClassicTemplate = ({ artUrl, contentRef, track, artist, bgStyle }) => {
    // bgStyle -> {type: null, data: img || string[a,b] || string}
    
    // final style é um objeto que vai receber as props pro estilo final do bg
    let finalStyle = {}; 

    
    // esse switch lida com todos os types possíveis
    switch (bgStyle.type) {
        case "color": 
        case "vibrant": 
        case "muted": // se type = vibrant -> sem gradiante cor Vibrant
            finalStyle = { backgroundColor: bgStyle.data };
            break;
        case "img": // se type = img -> usa a bgImg 
            finalStyle = { backgroundImage: `url(${bgStyle.data})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'};
            break;
        case "gradient":
        case "darkGradient": // se type = gradient ou darkGradient -> faz um gradient de Vibrant e Muted
            finalStyle = { backgroundImage: `linear-gradient(to bottom, ${bgStyle.data[0]}, ${bgStyle.data[1]})` };
            break;
        default:
            finalStyle = { backgroundColor: '#000' };
            break;
    }

    return (
        <div className="w-full h-full flex flex-col items-center justify-center px-[21.6px] sm:px-[27px] lg:px-9" style={finalStyle}>

            <div ref={contentRef} className="w-full relative flex flex-col items-center p-[9.6px] sm:p-[12px] lg:p-4 gap-[6px] sm:gap-[7.5px] lg:gap-2.5">

                {/*fundo preto opaco*/}
                <div className="absolute inset-0 bg-bottom-center opacity-85 rounded-[7.2px] sm:rounded-[9px] lg:rounded-xl" style={ { backgroundColor: '#121212' }}/>

                <img src={artUrl} alt={`Capa de ${track}`} draggable="false" className="z-20 w-full rounded-[3.6px] sm:rounded-[4.5px] lg:rounded-md object-cover select-none pointer-events-none" crossOrigin="anonymous"/>

                <div className="z-20 text-center w-full">
                    <p translate="no" className="text-[12px] sm:text-[15px] lg:text-xl font-bold text-white truncate select-none">{track}</p>
                    <p translate="no" className="text-[10.8px] sm:text-[13.5px] lg:text-lg text-gray-100 truncate select-none">{artist}</p>
                </div>
                
                <div className="w-full border-b-1 border-white/50 z-20"></div>

                {/* logo */}
                <div className="z-20 self-end flex items-center gap-[4.8px] sm:gap-[6px] lg:gap-2">
                    <img src={SongStickerIcon} alt={`Logo`} draggable="false" className="w-[9.6px] sm:w-[12px] lg:w-4 h-[9.6px] sm:h-[12px] lg:h-4 inline select-none pointer-events-none" crossOrigin="anonymous"/>
                    <span translate="no" className="pt-0.25 sm:pt-0 text-[7.2px] sm:text-[9px] lg:text-xs text-gray-100 font-medium select-none">Song Sticker</span>
                </div>

            </div>
        </div>
    );

};
