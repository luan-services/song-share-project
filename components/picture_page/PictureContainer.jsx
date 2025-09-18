import {useState, useEffect, useRef, useCallback} from 'react'
import { PictureContent } from './PictureContent';
import { bgImgsSrc } from '../../lib/bg-images'; // importa as imagens de bg pro story
import { toPng, toBlob } from 'html-to-image'; // libary para converter html em png
import Vibrant from 'node-vibrant'; // library vibrant para pegar a colorPalette
import ColorThief from 'colorthief'; // library colorThief para pegar outras palettes.
import { StyleButton } from './StyleButton';
import { mapPaletteToBase, BASE_PALETTE } from "../../lib/color-filter" // utilitário para filtrar paletas com pouca saturação
import { LoadingPage } from "../../src/layout/LoadingPage"
import { DownloadButton } from './DownloadButton';
import { ShareButton } from "./ShareButton"

export const PictureContainer = ({songData}) => {

    const pictureRef = useRef(null); // referência à div da picture

    // ---xxx states para salvar um novo url proxy para a imagem

    const [proxyArtUrl, setProxyArtUrl] = useState(null);
    const [ProxyartUrlIsLoading, setProxyIsLoading] = useState(true);

    useEffect(() => { // useEffect inicial para fazer o fetch do url da imagem, para baixar a foto e fazer um novo url (o cors não permite usar algumas imagens de api para baixar imagem, nem para ler de 'ler' os dados da imagem para busca de palettas)

        let proxyObjectUrl = null;
        
        const getProxiedUrl = async (url) => {

            try {

                if (!url) { // se não houver url, retorna
                    return;
                }

                const proxiedImageUrl = `/api/image-proxy?url=${encodeURIComponent(url)}`;

                const response = await fetch(proxiedImageUrl); // faz o fetch do url do proxy

                if (!response.ok) {
                    throw new Error('Failed to fetch image via proxy');
                }

                const imageBlob = await response.blob();

                const objectUrl = URL.createObjectURL(imageBlob);

                proxyObjectUrl = objectUrl; // Armazena na variável local

                setProxyArtUrl(objectUrl);
                
            } catch (error) {
                console.error("Error ao tentar fazer o proxy da capa do álbum.");
            } finally {
                setProxyIsLoading(false);
            }
        }
        
        getProxiedUrl(songData.coverArtUrl);

        return () => {
            if (proxyObjectUrl) {
                URL.revokeObjectURL(proxyObjectUrl);
                console.log("Object URL desfeito");
            }
        };


    }, [songData]);

    // ---xxx

    const [colorPalette, setColorPalette] = useState(null)
    const [thiefColorPalette, setThiefColorPalette] = useState(null) // para guardar a cor dominante do colorthief

    useEffect(() => { // useEffect para pegar a paleta de cores, a cor em destaque, etc
        
        if (!proxyArtUrl) { // se não tiver uma url de imagem (provavelmente impossível, mas garante que nada quebre), retorna
            return;
        };

        // função assíncrona para extrair as cores, não precisa de useCallBack por estar dentro do useEffect (que vai executar renderizar e executar uma unica vez)
        const extractColors = async () => {
            try {

                const img = new Image(); // cria um novo objeto img
                img.crossOrigin = 'Anonymous'; // previne cors
                
                img.onload = () => { // cria um listener pegar a cor dominante assim que img carregar (precisa ficar antes da img.src)
                    
                    const colorThief = new ColorThief(); // instancia o colorThief

                     
                    const thiefPalette = colorThief.getPalette(img, 6); // 1. gera uma paleta de 4 cores 
                    
                    if (!thiefPalette) { // se não conseguiu retorna
                        console.error("Não foi possível gerar paletta color-thief");
                        return;
                    }

                    const finalPalette = mapPaletteToBase(thiefPalette, BASE_PALETTE); // função p comparar as cores do thief com a paleta base e retornar resultados parecidos

                    setThiefColorPalette(finalPalette);
                };

                img.src = proxyArtUrl; // seta um url p image, quando carregar vai rodar img.onload

                // pega a paleta do Vibrant
                const vibrantPalette = await Vibrant.from(proxyArtUrl).getPalette();

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
        }

        extractColors();

    }, [proxyArtUrl]);

    // ---xxxx funções para share e download

    //... depois do seu useCallback do handleDownload

    const handleShare = useCallback(async () => {
        if (pictureRef.current === null) {
            return;
        }
        
        if (!navigator.share || !navigator.canShare) {
            alert("Seu navegador não suporta o compartilhamento nativo. Tente baixar a imagem.");
            return;
        }

        const currentWidth = pictureRef.current.offsetWidth; // mede a largura atual da div do story

        const pixelRatio = 1080 / currentWidth; // calcula o pixel ratio (fullwidth / current width)
        
        try {
            const blob = await toBlob(pictureRef.current, { pixelRatio: pixelRatio });

            if (!blob) {
                throw new Error("Não foi possível gerar a imagem para compartilhamento.");
            }
            
            const file = new File([blob], "song-share-story.png", { type: blob.type });
            
            const shareData = {
                title: `Música: ${songData.track}`,
                text: `Veja essa música que estou ouvindo: ${songData.track} por ${songData.artist}!`,
                files: [file],
            };

            if (navigator.canShare(shareData)) {
                await navigator.share(shareData);
                console.log("Conteúdo compartilhado com sucesso!");
            } 
            else {
                throw new Error("Não é possível compartilhar este tipo de arquivo.");
            }
            
        } catch (err) {
            console.error('Erro ao tentar compartilhar a imagem:', err);
            alert("Ocorreu um erro ao compartilhar.");
        }
    }, [pictureRef, songData]); // Adicione songData e handleDownload às dependências

    const handleDownload = useCallback( async () => {  // função para criar botão de download do story, useCallback impede ela de ser recriada (já que não está em um useEffect)
        if (pictureRef.current === null) {  // enquanto a div não existir a ser transformada em imagem não existir, não chama a função
            return;
        }

        const link = document.createElement('a');

        const currentWidth = pictureRef.current.offsetWidth; // mede a largura atual da div do story

        const pixelRatio = 1080 / currentWidth; // calcula o pixel ratio (fullwidth / current width)

        try {

            const dataUrl = await toPng(pictureRef.current, { pixelRatio: pixelRatio });
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

    useEffect(() => {  // useEffect final, para definir o estilo inicial do fundo da imagem

        if (!colorPalette || !thiefColorPalette) {
            return;
        }
        
        // Quando as paleta chegarem, definimos um estilo inicial
        setBgStyle({
            type: 'vibrant', // vamos começar com a cor vibrant do Vibrant
            data: colorPalette[0].data, // passamos a paleta cor da cor vibrant 
        });

        setCurrentBgKey('vibrant'); // setamos a key do bg como vibrant

    }, [colorPalette, thiefColorPalette]);

    if (!bgStyle || !proxyArtUrl) { // se não houver um estilo inicial, carregando...
        return (
			<LoadingPage/>
        )
    }


    return (
        <div className="flex flex-col justify-center items-center w-full gap-8">

            {/* container dos botões e do story */}
            <div className="flex flex-col justify-center items-center gap-4 sm:gap-6 p-4 rounded-xl">

                {/* botões do fundo */}
                <div className="flex flex-wrap justify-center gap-2 px-2 py-2 sm:px-1 sm:py-4 max-w-78 sm:max-w-12 bg-custom-secundary-red rounded-xl sm:rounded-t-full sm:rounded-b-full">
                    
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
                    {/* bgImgsSrc && bgImgsSrc.map((bg) => {
                        return (
                            <StyleButton onClick={() => handleSetBgStyle('img', bg.name, bg.full)} isActive={currentBgKey === bg.name} btnStyle={{type: 'img', data: bg.icon}}/>     
                        )
                    })

                    */}

                </div>

                <div className="rounded-lg p-3 bg-white border-1 border-gray-300 shadow-xl sm:mr-18"> {/* div responsiva */}
                    <div ref={pictureRef} 
                        className="w-[216px] h-[384px] sm:w-[270px] sm:h-[480px] lg:w-[360px] lg:h-[640px] transition-all duration-300">
                        <PictureContent artUrl={proxyArtUrl} track={songData.track} artist={songData.artist} bgStyle={bgStyle}/>
                    </div>
                </div>

            </div>


            <div className="flex flex-row gap-4 justify-center">
                {/* caso seja possível usar o webshare API no navegador do usuário */}
                {navigator.share && navigator.canShare && 
                    <ShareButton onClick={handleShare}/>
                }

                <DownloadButton onClick={() => handleDownload()} />

            </div>

        </div>
    )
}


