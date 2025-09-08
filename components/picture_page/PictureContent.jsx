// procurar biblioteca para encontrar cores complementares, inversas, etc no futuro

// tentar gerar imagem 1080x1920 com  o gemini e tirar a dúvida sobre como fazer o bg escalar com o tamanho da imagem p tela

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
            finalStyle = { backgroundImage: `url(${bgStyle.bgImg})` };
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
        <div className="w-full h-full flex flex-col items-center justify-center p-2 sm:p-4 lg:p-8"
             style={finalStyle}
        >
            <div className="w-full bg-black bg-opacity-20 backdrop-blur-md rounded-lg md:rounded-xl flex flex-col items-center p-2 md:p-3 space-y-1 md:space-y-2">
                
                <img 
                    src={artUrl} // Prop renomeada para evitar conflito com a constante no pai
                    alt={`Capa de ${track}`}
                    className="w-full aspect-square rounded-sm md:rounded-md object-cover shadow-lg"
                    crossOrigin="anonymous" 
                />
                <div className="text-center w-full">
                    <h2 className="text-base md:text-2xl font-bold text-white truncate">{track}</h2>
                    <p className="text-xs md:text-lg text-white/90">{artist}</p>
                </div>
            </div>
        </div>
    );
};