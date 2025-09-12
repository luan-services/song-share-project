import {useState, useEffect, useRef, useCallback} from 'react'
import { PictureContent } from './PictureContent';
import { bgImgsSrc } from '../../lib/bg-images'; // importa as imagens de bg pro story
import { toPng, toBlob } from 'html-to-image'; // libary para converter html em png
import Vibrant from 'node-vibrant'; // library vibrant para pegar a colorPalette
import ColorThief from 'colorthief'; // library colorThief para pegar outras palettes.
import { StyleButton } from './StyleButton';

import { filterColorPalette } from "../../lib/saturation-filter" // utilitário para filtrar paletas com pouca saturação

/* lógica atual:

como o genius precisa de um proxy para mostrar a imagem no container 1080x1920 e como tanto lastFm como genius precisam de proxy p baixar as cores da imagem,
resolvi criar dois states do url proxy deles, para não repetir código

inicialmente o código tenta pegar esses dois proxy, em seguida ele cria as const trackName e artistName

logo em seguida, ele chama um state para setar a imagem de capa inicial, 
    caso existe capa do spotify e o artista da música é o mesmo artista do album (check básico para ver incosistencia na arte do album),
        a capa é do spotify
    caso contrário, é do genius

tendo uma imagem de capa, o useEffect para extrair as palletas é chamado, e faz isso

tendo as paletas e a imagem de capa, o useEffect para definir o estilo inicial (a imagem e fundo que vão aparecer na div) é chamado

tendo uma imagem de capa e o estilo definido, a tela sai de 'carregando' para o editor do story

tendo o editor, os botões de download e share são criados

Nota: caso a imagem do lastFm exista mas o artista da música não é o mesmo artista do album, pode haver incosistencia no album, então a imagem
do genius é setada como principal e uma div para escolher qual imagem o usuário quer aparece.


*/

export const PictureContainer = ({songData, lastFmSongData, selectedLyrics}) => {

    const pictureRef = useRef(null); // referência à div da picture

    // ---xxx

    const [geniusProxyArtUrl, setGeniusProxyArtUrl] = useState(null);
    const [lastFmProxyArtUrl, setLastFmProxyArtUrl] = useState(null);

    useEffect(() => { // useEffect inicial para fazer o fetch do url da imagem do Genius, para baixar a foto e fazer um novo url (o cors não permite usar algumas imagem do genius para baixar imagem, e não permite nem lastFm nem Genius de 'ler' os dados da imagem para busca de palettas)

                    
        let geniusObjectUrl = null;
        let lastFmObjectUrl = null;

        const getProxiedUrl = async (url, source) => {

            try {

                if (!url) { // se não houver url, retorna
                    return;
                }
                const proxiedImageUrl = `/api/image-proxy?url=${encodeURIComponent(url)}`;

                // 1. Fetch the image data through the proxy
                const response = await fetch(proxiedImageUrl);
                if (!response.ok) {
                    throw new Error('Failed to fetch image via proxy');
                }

                const imageBlob = await response.blob();
                let objectUrl = URL.createObjectURL(imageBlob);

                if (source === 'genius') {
                    geniusObjectUrl = objectUrl; // Armazena na variável local
                    setGeniusProxyArtUrl(objectUrl);
                } else {
                    lastFmObjectUrl = objectUrl; // Armazena na variável local
                    setLastFmProxyArtUrl(objectUrl);
                }
                
            } catch (error) {
                console.error("Error ao tentar fazer o fetch da imagem do Genius:", error);
            };
        }

        if (songData.albumArtUrl) {
            getProxiedUrl(songData.albumArtUrl, 'genius');
        }

        if (lastFmSongData?.artUrl) {
            getProxiedUrl(lastFmSongData?.artUrl, 'lastFm');
        }


        return () => {
            // Quando o componente for desmontado, revoga as URLs que foram criadas
            if (geniusObjectUrl) {
                URL.revokeObjectURL(geniusObjectUrl);
            }
            if (lastFmObjectUrl) {
                URL.revokeObjectURL(lastFmObjectUrl);
            }
        };

    }, [songData, lastFmSongData]);

    // ---xxx coverArtUrl é um state que guarda qual é o url da imagem que está sendo usada atualmente, genius ou lastfm

    const [coverArtUrl, setCoverArtUrl] = useState(null);

    const handleSetCoverArt = (type) => {

        if (type === 'lastFm' && lastFmProxyArtUrl) {
            setCoverArtUrl(lastFmProxyArtUrl)
            return;
        };

        setCoverArtUrl(geniusProxyArtUrl);
    };

    // ---xxx

    // const referenciando o dado final, sendo do lastFm caso houver, ou do Genius, caso contrário.
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

                const img = new Image(); // cria um novo objeto img
                img.crossOrigin = 'Anonymous'; // previne cors
                
                img.onload = () => { // cria um listener pegar a cor dominante assim que img carregar (precisa ficar antes da img.src)
                    
                    const colorThief = new ColorThief(); // instancia o colorThief

                     
                    const thiefPalette = colorThief.getPalette(img, 8); // 1. gera uma paleta de 4 cores 
                    
                    if (!thiefPalette) { // se não conseguiu retorna
                        console.error("Não foi possível gerar paletta color-thief");
                        return;
                    }

                    const filteredPalette = filterColorPalette(thiefPalette, {
                        minSaturation: 0.25, // Remove cores muito acinzentadas
                        minLightness: 0.15,  // Remove cores muito escuras
                        maxLightness: 0.90,  // Remove cores muito claras/brancas
                    });

                    const finalPalette = filteredPalette.length >= 3 ? filteredPalette : thiefPalette.slice(0, 4);

                    // pega todas as palettas do thief e transforma em um array de strings rgb(x,y,z)  
                    const thiefRgb = finalPalette.map(palet => (
                        `rgb(${palet[0]}, ${palet[1]}, ${palet[2]})`
                    ));

                    setThiefColorPalette(thiefRgb);
                };

                img.src = coverArtUrl; // seta um url p image, quando carregar vai rodar img.onload

                // pega a paleta do Vibrant
                const vibrantPalette = await Vibrant.from(coverArtUrl).getPalette();

                if (!vibrantPalette) { // se não conseguiu retorna
                    console.error("Não foi possível gerar paletta Vibrant");
                    return;
                }

                const colors = [
                    {type: 'vibrant', data: vibrantPalette.Vibrant?.hex || '#000'},
                    {type: 'muted', data: vibrantPalette.Muted?.hex || '#000'},
                    {type: 'gradient', data: [vibrantPalette.Vibrant?.hex || '#000', vibrantPalette.Muted?.hex || '#000']},
                    {type: 'darkGradient', data: [vibrantPalette.DarkVibrant?.hex || '#000', vibrantPalette.DarkMuted?.hex || '#000']}
                ]

                setColorPalette(colors); // seta a paletta no useState


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

        const link = document.createElement('a');

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

    const [bgStyle, setBgStyle] = useState({type: null, data: null})

    const [currentBgKey, setCurrentBgKey] = useState(null);

    const handleSetBgStyle = (type, key, style) => {

        setBgStyle({
            type: type,
            data: style,
        })

        setCurrentBgKey(key); // seta a key do bg (o nome)
    };


    // ---xxx

    useEffect(() => {  // useEffect para definir a imagem de capa inicial
        if ( (!geniusProxyArtUrl && !lastFmProxyArtUrl) || coverArtUrl ) { // se pelo menos uma imagem ainda não chegou, não fazemos nada
            console.log(geniusProxyArtUrl, lastFmProxyArtUrl, coverArtUrl)
            return;
        }
       
        // quando as imagens chegarem, definimos uma imagem inicial
        if (lastFmProxyArtUrl && lastFmSongData?.artist === lastFmSongData?.albumArtist) { // o segundo check verifica se o artista da música é o mesmo artista do album (check básico para ver incosistencia na arte do album)
          
            setCoverArtUrl(lastFmProxyArtUrl); 
            return;
        }

        setCoverArtUrl(geniusProxyArtUrl);

    }, [lastFmProxyArtUrl, geniusProxyArtUrl, coverArtUrl]);

    useEffect(() => {  // useEffect final, para definir o estilo inicial do fundo da imagem
        if (!colorPalette || !thiefColorPalette ) { // se a paleta ainda não chegou, não fazemos nada
            return;
        }
       
        // Quando as paleta chegarem, definimos um estilo inicial
        setBgStyle({
            type: 'vibrant', // vamos começar com a cor vibrant do Vibrant
            data: colorPalette[0].data, // passamos a paleta cor da cor vibrant 
        });

        setCurrentBgKey('vibrant'); // setamos a key do bg como vibrant

    }, [colorPalette, thiefColorPalette, lastFmProxyArtUrl, geniusProxyArtUrl]);

    if (!bgStyle || !coverArtUrl) { // se não houver um estilo inicial, carregando...
        return (
            <div className="flex flex-col">
                Carregando imagem...
            </div>
        )
    }


    return (
        <div className="flex flex-col justify-center items-center w-full gap-8">

            {/* container dos botões e do story */}
            <div className="flex flex-col sm:flex-row justify-center items-center max-w-72 sm:max-w-98 lg:max-w-120 gap-2 p-4 rounded-xl">



                {/* botões do fundo */}
                <div className="flex flex-wrap justify-center gap-2 px-2 py-2 sm:px-1 sm:py-4 bg-custom-secundary-red rounded-xl sm:rounded-t-full sm:rounded-b-full">
                    
                    {/* pega o state das paletts do thief arr[palett] e adiciona um botão pra cada */}
                    { thiefColorPalette && thiefColorPalette.map((palett, index) => {
                        return (
                            <StyleButton onClick={() => handleSetBgStyle('color', `thief-${index}`, palett)} isActive={currentBgKey === `thief-${index}`} btnStyle={{type: 'color', data: palett}}/>
                        )
                    })}

                    {/* pega o state das paletts do vibrant (arr[{type, color}]e adiciona um botão pra cada */}
                    { colorPalette && colorPalette.map((palett) => {
                        return (
                            <StyleButton onClick={() => handleSetBgStyle(palett.type, palett.type, palett.data)} isActive={currentBgKey === palett.type} btnStyle={{type: palett.type, data: palett.data}}/>     
                        )
                    })}

                    {/* pega as imagens de bg e faz um botão p cada */}
                    { bgImgsSrc && bgImgsSrc.map((bg) => {
                        return (
                            <StyleButton onClick={() => handleSetBgStyle('img', bg.name, bg.full)} isActive={currentBgKey === bg.name} btnStyle={{type: 'img', data: bg.icon}}/>     
                        )
                    })

                    }

                </div>
        
                
                <div className="rounded-lg p-3 bg-white border-1 border-gray-300 shadow-xl"> {/* div responsiva */}
                    <div ref={pictureRef} 
                        className="w-[216px] h-[384px] sm:w-[270px] sm:h-[480px] lg:w-[360px] lg:h-[640px] transition-all duration-300">
                        <PictureContent artUrl={coverArtUrl} track={trackName} artist={artistName} bgStyle={bgStyle}/>
                    </div>
                </div>

                {/*
                    check verifica se o artista da música é o mesmo artista do album (check básico para ver incosistencia na arte do album) e se existe imagem do lastFm
                    caso sim, disponíbiliza botões pro usuário selecionar a arte
                */}
                {!(lastFmSongData?.artist === lastFmSongData?.albumArtist) && lastFmProxyArtUrl && (
                    <div className="flex flex-wrap justify-center gap-2 px-2 py-2 sm:px-1 sm:py-4 bg-custom-secundary-red rounded-xl sm:rounded-t-full sm:rounded-b-full">
                        <div className='flex transition duration-300 cursor-pointer active:scale-90 rounded-full bg-white'>
                            <button type="button" onClick={() => handleSetCoverArt('lastFm')} className={`${coverArtUrl === lastFmProxyArtUrl ? 'ring-3 ring-white ring-inset' : 'ring-3 ring-white/60 ring-inset' } w-8 h-8 rounded-full transition duration-300 cursor-pointer`} style={{ backgroundImage: `url(${lastFmSongData?.artUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'}}/>
                        </div>
                        <div className='flex transition duration-300 cursor-pointer active:scale-90 rounded-full bg-white'>
                            <button type="button" onClick={() => handleSetCoverArt('genius')} className={`${coverArtUrl === geniusProxyArtUrl ? 'ring-3 ring-white ring-inset' : 'ring-3 ring-white/60 ring-inset' } w-8 h-8 rounded-full transition duration-300 cursor-pointer`} style={{ backgroundImage: `url(${songData.albumArtUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'}}/>
                        </div>
                    </div>
                )}


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


