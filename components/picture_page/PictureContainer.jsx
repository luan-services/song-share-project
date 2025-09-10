import {useState, useEffect, useRef, useCallback} from 'react'
import { PictureContent } from './PictureContent';
import { bgImgsSrc } from '../../lib/bg-images'; // importa as imagens de bg pro story
import { toPng, toBlob } from 'html-to-image'; // libary para converter html em png
import Vibrant from 'node-vibrant'; // library vibrant para pegar a colorPalette
import ColorThief from 'colorthief'; // library colorThief para pegar outras palettes.
import { StyleButton } from './StyleButton';


export const PictureContainer = ({songData, lastFmSongData, selectedLyrics}) => {

    const pictureRef = useRef(null); // referência à div da picture

    // ---xxx

    // const referenciando o dado final, sendo do lastFm caso houver, ou do Genius, caso contrário.
    const coverArtUrl = lastFmSongData?.artUrl || songData.albumArtUrl;
    const trackName = lastFmSongData?.track || songData.track;
    const artistName = lastFmSongData?.artist || songData.artist;

    // ---xxx

    const [colorPalette, setColorPalette] = useState(null)
    const [thiefColorPalette, setThiefColorPalette] = useState(null) // para guardar a cor dominante do colorthief

    useEffect(() => { // useEffect para pegar a paleta de cores, a cor em destaque, etc
        
        if (!coverArtUrl) { // se não tiverm uma url de imagem (provavelmente impossível, mas garante que nada quebre), retorna
            return;
        };

        // Função assíncrona para extrair as cores, não precisa de useCallBack por estar dentro do useEffect (que vai executar renderizar e executar uma unica vez)
        const extractColors = async () => {
            try {

                const proxiedImageUrl = `/api/image-proxy?url=${encodeURIComponent(coverArtUrl)}`; // faz um url proxy da imagem (é necessário 'baixar' a imagem no backend)

                console.log(proxiedImageUrl)
                const img = new Image(); // cria um novo objeto img
                img.crossOrigin = 'Anonymous'; // previne cors
                
                img.onload = () => { // cria um listener pegar a cor dominante assim que img carregar (precisa ficar antes da img.src)
                    
                    const colorThief = new ColorThief(); // instancia o colorThief

                     
                    const thiefPalette = colorThief.getPalette(img, 4); // 1. gera uma paleta de 4 cores 
                    
                    if (!thiefPalette) { // se não conseguiu retorna
                        console.error("Não foi possível gerar paletta color-thief");
                        return;
                    }

                    console.log("Paleta do thief", thiefPalette);
                    setThiefColorPalette(thiefPalette);
                };

                img.src = proxiedImageUrl; // seta um url p image, quando carregar vai rodar img.onload

                // pega a paleta do Vibrant
                const vibrantPalette = await Vibrant.from(proxiedImageUrl).getPalette();
                
                setColorPalette(vibrantPalette); // seta a paletta no useState

                console.log("Paleta de cores extraída:", vibrantPalette);

            } catch (error) {
                console.error("Erro ao extrair a paleta de cores:", error);
            }
        };

        extractColors();

    }, [coverArtUrl]);

    // ---xxx

    const handleDownload = useCallback( async () => {  // função para criar botão de download do story, useCallback impede ela de ser recriada (já que não está em um useEffect)
        if (pictureRef.current === null) {  // enquanto a div não existir a ser transformada em imagem não existir, não chama a função
            return;
        }

        const currentWidth = pictureRef.current.offsetWidth; // mede a largura atual da div do story

        const pixelRatio = 1080 / currentWidth; // calcula o pixel ratio (fullwidth / current width)

        try {

            const dataUrl = await toPng(pictureRef.current, { cacheBust: true, pixelRatio: pixelRatio });
            link.download = 'song-share-story.png';
            link.href = dataUrl;
            link.click();

        } catch(err) {
            console.error('Erro ao gerar imagem para download:', err);
        };

    }, [pictureRef]);

    // ---xxx useState bgStyle, que guarda o tipo do bg escolhido e passa pro PictureContent
    // também há um useEffect que fica ouvindo quando a paleta de cores estiver pronta, para passar pro bgStyle

    const [bgStyle, setBgStyle] = useState({type: null, palette: null, averageColor: null, bgImg: null})
    const [currentBgType, setCurrentBgType] = useState('img');

    useEffect(() => { 
        if (!colorPalette || !thiefColorPalette) { // se a paleta ainda não chegou, não fazemos nada
            return;
        }

        // pega todas as palettas do thief e transforma em um array de strings rgb(x,y,z)  
        const thiefRgb = thiefColorPalette.map(palet => (
            `rgb(${palet[0]}, ${palet[1]}, ${palet[2]})`
        ));
       
        // Quando as paleta chegarem, definimos um estilo inicial. seus botões no futuro vão chamar setBgStyle com outros valores.
        setBgStyle({
            type: 'img', // Vamos começar com o gradiente escuro
            palette: colorPalette, // Passamos a paleta inteira para o filho
            thiefPalette: thiefRgb, // passa o array de strings rgb
            bgImg: bgImgsSrc.halloween.full,
        });

    }, [colorPalette, thiefColorPalette]);


    // ---xxx

    if (!bgStyle) { // se não houver um estilo inicial, carregando...
        return (
            <div className="flex flex-col">
                Carregando imagem...
            </div>
        )
    }


    return (
        <div className="flex flex-col justify-center items-center w-full gap-8">

            {/* container dos botões e do story */}
            <div className="flex flex-col justify-center items-center w-full max-w-128 gap-8 p-4 bg-gray-100">

                {/* botões */}
                <div className="flex flex-wrap justify-center gap-2 bg-custom-secundary-red px-3 py-3 w-full max-w-120">
                    <StyleButton isActive={currentBgType === 'img'} btnStyle={{type: 'img', bgImg: bgImgsSrc.halloween.full, colors: []}}/>
                    <StyleButton isActive={currentBgType === 'color'} btnStyle={{type: 'color', bgImg: null, colors: [colorPalette?.Vibrant?.hex]}}/>
                <StyleButton isActive={currentBgType === 'img'} btnStyle={{type: 'img', bgImg: bgImgsSrc.halloween.full, colors: []}}/>
                    <StyleButton isActive={currentBgType === 'color'} btnStyle={{type: 'color', bgImg: null, colors: [colorPalette?.Vibrant?.hex]}}/>
                <StyleButton isActive={currentBgType === 'img'} btnStyle={{type: 'img', bgImg: bgImgsSrc.halloween.full, colors: []}}/>
                    <StyleButton isActive={currentBgType === 'color'} btnStyle={{type: 'color', bgImg: null, colors: [colorPalette?.Vibrant?.hex]}}/>
                <StyleButton isActive={currentBgType === 'img'} btnStyle={{type: 'img', bgImg: bgImgsSrc.halloween.full, colors: []}}/>
                    <StyleButton isActive={currentBgType === 'color'} btnStyle={{type: 'color', bgImg: null, colors: [colorPalette?.Vibrant?.hex]}}/>
                
                </div>
            
                {/* div responsiva */}
                <div ref={pictureRef} 
                    className="w-[216px] h-[384px] sm:w-[270px] sm:h-[480px] lg:w-[360px] lg:h-[640px] transition-all duration-300">
                    <PictureContent artUrl={coverArtUrl} track={trackName} artist={artistName} bgStyle={bgStyle}/>
                </div>
            </div>

            {/* download */}
            <button 
                onClick={handleDownload} 
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700">
                Baixar Imagem (1080p)
            </button>
        </div>
    )
}


