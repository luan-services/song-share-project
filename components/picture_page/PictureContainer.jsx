import {useState, useEffect, useRef, useCallback} from 'react'

import { toPng, toBlob } from 'html-to-image'; // libary para converter html em png
import Vibrant from 'node-vibrant'; // library vibrant para pegar a colorPalette
import ColorThief from 'colorthief'; // library colorThief para pegar outras palettes.
import { mapPaletteToBase, BASE_PALETTE } from "../../lib/color-filter" // utilitário para filtrar paletas com pouca saturação

import { LoadingPage } from "../../src/layout/LoadingPage"

import { TextTemplate } from './TextTemplate'; // template de foto com texto
import { ClassicTemplate } from './ClassicTemplate'; // template de foto apenas com nome da música

import { ColorSelector } from './ColorSelector'; // componente para definir a cor do bg
import { TemplateSelector } from './TemplateSelector';
import { TextSelector } from './TextSelector';

import { DownloadButton } from './DownloadButton';
import { ShareButton } from "./ShareButton"


export const PictureContainer = ({songData, songDataText}) => {

    const pictureRef = useRef(null); // referência à div da picture
    const contentRef = useRef(null); // referencia apenas ao sticker

    // ---xxx  useState currentTemplate, que guarda o template da imagem selecionada, e useState SongText, que guarda o texto do template (selecionado pelo usuário)
    
    const [currentTemplate, setCurrentTemplate] = useState('image');

    const [songText, setSongText] = useState([]);

    // ---xxx states para salvar um novo url proxy para a imagem

    const [proxyArtUrl, setProxyArtUrl] = useState(null);
    const [ProxyartUrlIsLoading, setProxyArtUrlIsLoading] = useState(true);

    useEffect(() => { // useEffect inicial para fazer o fetch do url da imagem, para baixar a foto e fazer um novo url (o cors não permite usar algumas imagens de api para baixar imagem, nem para ler de 'ler' os dados da imagem para busca de palettas)

        if (!songData) { // sem dado de música, retorna
            return;
        }

        
        const getProxiedUrl = async (url) => {

            setProxyArtUrlIsLoading(true)

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

                const reader = new FileReader();

                reader.onloadend = () => {
                    setProxyArtUrl(reader.result); // base64 seguro
                    setProxyArtUrlIsLoading(false);
                };

                reader.readAsDataURL(imageBlob);
                return;

                
            } catch (error) {
                console.error("Error ao tentar fazer o proxy da capa do álbum.");
            } finally {
                setProxyArtUrlIsLoading(false);
            }
        }
        
        getProxiedUrl(songData.coverArtUrl);

    }, [songData]);

    // ---xxx

    const [colorPalette, setColorPalette] = useState(null)
    const [thiefColorPalette, setThiefColorPalette] = useState(null) // para guardar a cor dominante do colorthief

    useEffect(() => { // useEffect para pegar a paleta de cores, a cor em destaque, etc
        
        if (ProxyartUrlIsLoading || !proxyArtUrl) { // se não tiver uma url de imagem (provavelmente impossível, mas garante que nada quebre), retorna
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

    }, [proxyArtUrl, ProxyartUrlIsLoading]);

    // ---xxxx funções para share e download

    //... depois do seu useCallback do handleDownload

    const handleShare = useCallback(async () => {

        const targetContainer = (currentTemplate === 'image' || currentTemplate === 'lyric') ? pictureRef.current : contentRef.current;
        
        if (targetContainer === null) {
            return;
        }
        
        if (!navigator.share || !navigator.canShare) {
            alert("Seu navegador não suporta o compartilhamento nativo. Tente baixar a imagem.");
            return;
        }

        const currentWidth = targetContainer.offsetWidth; // mede a largura atual da div do story

        const pixelRatio = 1080 / currentWidth; // calcula o pixel ratio (fullwidth / current width)
        
        try {

            const blob = await toBlob(targetContainer, { pixelRatio: pixelRatio });

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
    }, [pictureRef, contentRef, currentTemplate, songData]); // Adicione songData e handleDownload às dependências

    const handleDownload = useCallback( async () => {  // função para criar botão de download do story, useCallback impede ela de ser recriada (já que não está em um useEffect)
        
        const targetContainer = (currentTemplate === 'image' || currentTemplate === 'lyric') ? pictureRef.current : contentRef.current;
        
        if (targetContainer === null) { // enquanto a div não existir a ser transformada em imagem não existir, não chama a função
            return; 
        }

        const link = document.createElement('a');

        const currentWidth = targetContainer.offsetWidth; // mede a largura atual da div do story

        const pixelRatio = 1080 / currentWidth; // calcula o pixel ratio (fullwidth / current width)

        try {

            const dataUrl = await toPng(targetContainer, { pixelRatio: pixelRatio});
            link.download = 'song-share-story.png';
            link.href = dataUrl;
            link.click();

        } catch(err) {
            console.error('Erro ao gerar imagem para download:', err);
        };

    }, [pictureRef, contentRef, currentTemplate]);

    // ---xxx  useState bgStyle, que guarda o tipo do bg escolhido pelo colorSelector e passa pro PictureContent

    const [bgStyle, setBgStyle] = useState({type: null, data: null})

    const handleSetBgStyle = (type, key, style) => {
        setBgStyle({
            type: type,
            key: key,
            data: style,
        })
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


    }, [colorPalette, thiefColorPalette]);

    if (!bgStyle || !proxyArtUrl) { // se não houver um estilo inicial, carregando...
        return (
			<LoadingPage/>
        )
    }


    return (
        <div className="flex lg:flex-row flex-col lg:justify-between justify-center lg:items-start items-center  w-full gap-8  py-6">


            <div className="flex flex-col max-w-120 lg:max-w-full lg:w-3/10 lg:pt-12">
                {/* Container dos botões de fundo, eles recebem o style atual, palettas, e função para setar o style atual*/}
                <ColorSelector bgStyle={bgStyle} onSetBgStyle={handleSetBgStyle} thiefColorPalette={thiefColorPalette} vibrantColorPalette={colorPalette}/>

                <TemplateSelector currentTemplate={currentTemplate} onSetTemplate={setCurrentTemplate}/>

                {currentTemplate == 'lyric' &&
                    <TextSelector onSetText={setSongText} songFullText={songDataText}/>
                }
            </div>


            <div className="rounded-lg p-3 bg-white border-1 border-gray-300 shadow-sm"> {/* div responsiva */}
                <div ref={pictureRef} 
                    className="w-[216px] h-[384px] sm:w-[270px] sm:h-[480px] lg:w-[360px] lg:h-[640px] transition-all duration-300 items-center flex">
                    

                    {currentTemplate === 'image' &&
                        <ClassicTemplate contentRef={contentRef} artUrl={proxyArtUrl} track={songData.track} artist={songData.artist} bgStyle={bgStyle}/>
                    }

                    {currentTemplate === 'lyric' && 
                        <TextTemplate contentRef={contentRef} songText={songText} artUrl={proxyArtUrl} track={songData.track} artist={songData.artist} bgStyle={bgStyle}/>
                    }
                </div>
            </div>


            <div className="flex flex-wrap flex-row gap-4 justify-center w-full lg:w-3/10 lg:pt-12">

                <div className="flex flex-col w-full gap-2 pb-8 tems-center justify-center max-w-180">
                    <span className="text-3xl font-bold py-2 pb-4 text-center">Compartilhe</span>
                    <span className='text-center text-sm sm:text-[16px]'>Faça o download diretamente em 1080x1920, ou compartilhe o sticker nas redes sociais pelo botão.</span>
                </div>


                {/* caso seja possível usar o webshare API no navegador do usuário */}
                {navigator.share && navigator.canShare && 
                    <ShareButton onClick={handleShare}/>
                }

                <DownloadButton onClick={() => handleDownload()} />

            </div>

        </div>
    )
}



