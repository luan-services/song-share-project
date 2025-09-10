import React from 'react'

export const StyleButton = ({onClick, isActive, btnStyle}) => {
	// btnStyle -> {type: null, bg: null, colors = []}
	let btnBg = {};
	let btnClass = isActive ? 'ring-3 ring-white ring-inset' : 'ring-3 ring-white/60 ring-inset'


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
        <div className='flex transition duration-300 cursor-pointer active:scale-90 rounded-full bg-white'>
            <button type="button" onClick={onClick} style={btnBg}
                className={`${btnClass} w-8 h-8 rounded-full transition duration-300 cursor-pointer`}>
            </button>
        </div>
	)
};