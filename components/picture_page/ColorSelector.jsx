import { useState } from 'react';
import { ColorSelectorButton } from './ColorSelectorButton';

export const ColorSelector = ({bgStyle, onSetBgStyle, thiefColorPalette, vibrantColorPalette}) => {


	return (
		<div className="flex flex-wrap justify-center gap-2 px-2 py-2 bg-custom-secundary-red rounded-xl">
			
			{/* pega o state das paletts do thief arr[palett] e adiciona um botão pra cada */}
			{ thiefColorPalette && thiefColorPalette.map((palett, index) => {
				return (
					<ColorSelectorButton onClick={() => onSetBgStyle('color', `thief-${index}`, palett)} isActive={bgStyle.key === `thief-${index}`} btnStyle={{type: 'color', data: palett}}/>
				)
			})}

			{/* pega o state das paletts do vibrant (arr[{type, color}]e adiciona um botão pra cada */}
			{ vibrantColorPalette && vibrantColorPalette.map((palett) => {
				return (
					<ColorSelectorButton onClick={() => onSetBgStyle(palett.type, palett.type, palett.data)} isActive={bgStyle.type === palett.type} btnStyle={{type: palett.type, data: palett.data}}/>     
				)
			})}

			{/* pega as imagens de bg e faz um botão p cada  (PRECISA MUDAR ISSO AQUI DEPOIS)*/}
			{/* bgImgsSrc && bgImgsSrc.map((bg) => {
				return (
					<StyleButton onClick={() => {onSetBg('img', bg.name, bg.full), setCurrentBgKey(palett.type)}} isActive={currentBgKey === bg.name} btnStyle={{type: 'img', data: bg.icon}}/>     
				)
			})

			*/}
		</div>
	)
}

export default ColorSelector
