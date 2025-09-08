import {useState, useEffect, useRef, useCallback} from 'react'
import { toPng, toBlob } from 'html-to-image'; // função para converter html em png
import Vibrant from 'node-vibrant';
import { PictureContent } from './PictureContent';

import { backgroundImages } from '../../lib/images';

export const PictureContainer = ({songData, lastFmSongData, selectedLyrics}) => {

    const pictureRef = useRef(null); // referência à div da picture

    // ---xxx

    // const referenciando o dado final, sendo do lastFm caso houver, ou do Genius, caso contrário.
    const coverArtUrl = lastFmSongData?.artUrl || songData.albumArtUrl;
    const trackName = lastFmSongData?.track || songData.track;
    const artistName = lastFmSongData?.artist || songData.artist;

    // ---xxx

    const [colorPalette, setColorPalette] = useState(null)

    useEffect(() => { // useEffect para pegar a paleta de cores
        
        if (!coverArtUrl) { // se não tiverm uma url de imagem, retorna
            return;
        };

        // Função assíncrona para extrair a paleta
        const extractPalette = async () => {
            try {
                
                const proxiedImageUrl = `/api/image-proxy?url=${encodeURIComponent(coverArtUrl)}`;

                const vibrantPalette = await Vibrant.from(proxiedImageUrl).getPalette();
                setColorPalette(vibrantPalette);
                console.log("Paleta de cores extraída:", vibrantPalette);
            } catch (error) {
                console.error("Erro ao extrair a paleta de cores:", error);
            }
        };

        extractPalette();
        console.log(colorPalette);

    }, [coverArtUrl]);

    // ---xxx

    const handleDownload = useCallback(() => {
        if (pictureRef.current === null) {
            return;
        }

        // --- A MÁGICA ACONTECE AQUI ---
        // 1. Medimos a largura ATUAL do nosso div de preview.
        const currentWidth = pictureRef.current.offsetWidth;

        // 2. Calculamos o pixelRatio necessário para chegar em 1080px.
        // Se o preview tem 180px, ratio = 6. Se tem 360px, ratio = 3.
        const pixelRatio = 1080 / currentWidth;
        // --- FIM DA MÁGICA ---

        toPng(pictureRef.current, { 
            cacheBust: true,
            pixelRatio: pixelRatio // Usamos o valor calculado dinamicamente!
        })
        .then((dataUrl) => {
            const link = document.createElement('a');
            link.download = 'meu-story-1080p.png';
            link.href = dataUrl;
            link.click();
        })
        .catch((err) => {
            console.error('Erro ao gerar imagem:', err);
        });
    }, [pictureRef]);

    // ---xxx useState bgStyle, que guarda o tipo do bg escolhido e passa pro PictureContent
    // também há um useEffect que fica ouvindo quando a paleta de cores estiver pronta, para passar pro bgStyle

    const [bgStyle, setBgStyle] = useState({type: null, palette: null, bgImg: null})

    useEffect(() => {
        // Se a paleta ainda não chegou, não fazemos nada
        if (!colorPalette) return;

        // Quando a paleta chegar, definimos um estilo inicial.
        // Seus botões no futuro vão chamar setBgStyle com outros valores.
        setBgStyle({
            type: 'vibrant', // Vamos começar com o gradiente escuro
            palette: colorPalette // Passamos a paleta inteira para o filho
        });

    }, [colorPalette]);


     return (
        <div className="flex flex-col justify-center items-center w-full gap-8">
            {/* A DIV ÚNICA E RESPONSIVA */}
            <div ref={pictureRef} 
                className="overflow-hidden w-[216px] h-[384px] sm:w-[270px] sm:h-[480px] lg:w-[360px] lg:h-[640px] transition-all duration-300">
                <PictureContent artUrl={coverArtUrl} track={trackName} artist={artistName} bgStyle={bgStyle}/>
            </div>

            {/* O BOTÃO DE DOWNLOAD QUE ACIONA A LÓGICA INTELIGENTE */}
            <button 
                onClick={handleDownload} 
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700">
                Baixar Imagem (1080p)
            </button>
        </div>
    )
}


