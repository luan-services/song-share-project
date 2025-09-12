import React from 'react'

export const StyleButton = ({onClick, isActive, btnStyle}) => {
	// btnStyle -> {type: null, data: img || string[a,b] || string}
	let btnBg = {};
	let btnClass = isActive ? 'ring-3 ring-white ring-inset' : 'ring-3 ring-white/60 ring-inset'

	switch (btnStyle?.type) {
        case "color": 
        case "vibrant": 
        case "muted": // se type = vibrant -> sem gradiante cor Vibrant
            btnBg = { backgroundColor: btnStyle.data };
            break;
        case "img": // se type = img -> usa a bgImg 
            btnBg = { backgroundImage: `url(${btnStyle.data})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'};
            break;
        case "gradient":
        case "darkGradient": // se type = gradient ou darkGradient -> faz um gradient de Vibrant e Muted
            btnBg = { backgroundImage: `linear-gradient(to bottom, ${btnStyle.data[0]}, ${btnStyle.data[1]})` };
            break;
        default:
            // Bg padrão enquanto os dados não carregam
            btnBg = { backgroundColor: '#000' };
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