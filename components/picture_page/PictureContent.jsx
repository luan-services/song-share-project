// procurar biblioteca para encontrar cores complementares, inversas, etc no futuro!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

import shareSongIcon from "../../src/assets/images/share_song_reverse_icon.png"

export const PictureContent = ({ artUrl, track, artist, bgStyle }) => {
    
    // final style é um objeto que vai receber as props pro estilo final do bg
    let finalStyle = {}; 

    const palette = bgStyle?.palette;

    // esse switch lida com todos os types possíveis
    switch (bgStyle?.type) {
        case "vibrant": // se type = vibrant -> sem gradiante cor Vibrant
            finalStyle = { backgroundImage: `linear-gradient(${palette?.Vibrant?.hex}, ${palette?.Vibrant?.hex})` };
            break;
        case "muted": // se type = muted -> sem gradiente cor Muted
            finalStyle = { backgroundImage: `linear-gradient(${palette?.Muted?.hex}, ${palette?.Muted?.hex})` };
            break;
        case "black": // se type = black -> all black igual spotify
            finalStyle = { backgroundColor: '#000' };
            break;
        case "img": // se type = img -> usa a bgImg 
            finalStyle = { backgroundImage: `url(${bgStyle.bgImg})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'};
            break;
        case "gradient": // se type = gradient -> faz um gradient de Vibrant e Muted
            finalStyle = { backgroundImage: `linear-gradient(to bottom, ${palette?.Vibrant?.hex}, ${palette?.Muted?.hex})` };
            break;
        case "darkGradient": // se type = darkGradient -> faz um gradient de DarkVibrant e DarkMuted
            finalStyle = { backgroundImage: `linear-gradient(to bottom, ${palette?.DarkVibrant?.hex}, ${palette?.DarkMuted?.hex})` };
            break;
        default:
            // Estilo padrão enquanto os dados não carregam
            finalStyle = { backgroundColor: '#121212' };
            break;
    }

    return (
        // Aplicamos o objeto de estilo final aqui
        <div className="w-full h-full flex flex-col items-center justify-center p-[19.2px] sm:p-[24px] lg:p-8" style={finalStyle}>
            <div className="w-full relative flex flex-col items-center p-[9.6px] sm:p-[12px] lg:p-4 gap-[6px] sm:gap-[7.5px] lg:gap-2.5">

                {/*fundo preto opaco*/}
                <div className="absolute inset-0 bg-bottom-center opacity-85 rounded-[7.2px] sm:rounded-[9px] lg:rounded-xl" style={ { backgroundColor: '#121212' }}/>

                <img src={artUrl} alt={`Capa de ${track}`} draggable="false" className="z-20 w-full rounded-[3.6px] sm:rounded-[4.5px] lg:rounded-md object-cover pointer-events-none" crossOrigin="anonymous"/>

                <div className="z-20 text-center w-full">
                    <p className="text-[12px] sm:text-[15px] lg:text-xl font-bold text-white truncate select-none">{track}</p>
                    <p className="text-[10.8px] sm:text-[13.5px] lg:text-lg text-gray-100 truncate select-none">{artist}</p>
                </div>

                {/* logo */}
                <div className="z-20 self-end flexx gap-[4.8px] sm:gap-[6px] lg:gap-2 items-center hidden">
                    <img src={shareSongIcon} alt={`Logo`} draggable="false" className="w-[9.6px] sm:w-[12px] lg:w-4 inline pointer-events-none" crossOrigin="anonymous"/>
                    <span className="text-[7.2px] sm:text-[9px] lg:text-xs text-gray-100 font-medium select-none">Song Share</span>
                </div>

            </div>
        </div>
    );
};