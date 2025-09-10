import React from 'react'

export const StyleButton = ({onClick, isActive, btnStyle}) => {
	// btnStyle -> {type: null, bg: null, colors = []}
	let btnBg = {};
	let btnClass = isActive ? 'opacity-100' : 'opacity-60'


	switch (btnStyle?.type) {
        case "color": // se type = vibrant -> sem gradiante cor Vibrant
            btnBg = { backgroundColor: btnStyle.colors[0] };
            break;
        case "img": // se type = img -> usa a bgImg 
            btnBg = { backgroundImage: `url(${btnStyle.bgImg})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'};
            break;
        case "gradient": // se type = gradient -> faz um gradient de Vibrant e Muted
            btnBg = { backgroundImage: `linear-gradient(to bottom, ${btnStyle.colors[0]}, ${btnStyle.colors[1]})` };
            break;
        default:
            // Bg padrão enquanto os dados não carregam
            btnBg = { backgroundColor: '#121212' };
            break;
    }

	return (
			<div className='flex transition duration-300 cursor-pointer active:scale-90 rounded-full bg-white border-3 lg:border-2 border-gray-700 shadow-xs ring-1 ring-black'>
				<button type="button" onClick={onClick} style={btnBg}
					className={`${btnClass} w-8 h-8 lg:w-11 lg:h-11 rounded-full transition duration-300 cursor-pointer`}>
				</button>
			</div>

	)
};