export const BASE_PALETTE = [
  // --- Vibrantes e Saturados --- (Cores Puras e Energéticas)
  '#FF3B30', // Vermelho Vívido
  '#FF2D55', // Rosa Choque
  '#FF9500', // Laranja Intenso
  '#FFCC00', // Amarelo Ouro
  '#ADFF2F', // Verde Lima (NOVO)
  '#34C759', // Verde Brilhante
  '#00C49A', // Verde Água
  '#40E0D0', // Turquesa (NOVO)
  '#30B0C7', // Ciano
  '#007AFF', // Azul Royal
  '#5856D6', // Índigo
  '#C71585', // Magenta (NOVO)
  '#AF52DE', // Roxo Lavanda

  // --- Tons Terrosos e Naturais --- (O segredo para imagens como a do "AM")
  '#D4A017', // Amarelo Mostarda (NOVO)
  '#BDB76B', // Cítrino / Khaki (NOVO)
  '#808000', // Verde Oliva (NOVO)
  '#D95D39', // Terracota
  '#E2725B', // Terracota Salmão (NOVO)
  '#A0522D', // Siena (NOVO)
  '#8B4513', // Marrom Sela (NOVO)
  '#6A5ACD', // Azul Ardósia (NOVO)

  // --- Pastéis Suaves e Claros --- (Tons Leves e Arejados)
  '#FFD6A5', // Pêssego Claro
  '#FDFFB6', // Amarelo Manteiga
  '#E0FFCD', // Verde Menta Claro (NOVO)
  '#CAFFBF', // Verde Menta
  '#B4F8C8', // Verde Chá (NOVO)
  '#AFEEEE', // Turquesa Pálido (NOVO)
  '#9BF6FF', // Azul Gelo
  '#A0C4FF', // Azul Sereno
  '#BDB2FF', // Lilás Suave
  '#E6E6FA', // Lavanda (NOVO)
  '#FFC0CB', // Rosa Bebê
  '#FADADD', // Rosa Pálido (NOVO)

  // --- Tons Profundos e Sóbrios --- (Cores Ricas, Escuras e Elegantes)
  '#A31621', // Vinho Tinto
  '#C70039', // Vermelho Rubi
  '#800000', // Bordô / Maroon (NOVO)
  '#4C2C69', // Roxo Berinjela
  '#483D8B', // Azul Ardósia Escuro (NOVO)
  '#1D2D44', // Azul Naval
  '#0F4C5C', // Verde Petróleo
  '#006400', // Verde Escuro (NOVO)
  '#36013F', // Roxo Imperial (NOVO)
  
  '#CCCCCC', // Cinza Claro (NOVO)
  '#E5E4E2', // Branco Platina (NOVO)
  '#FAF4E8', // Branco Linho
  '#F8F7FF', // Branco Fantasma


  
];

function rgbToHsl(r, g, b) {
	r /= 255;
	g /= 255;
	b /= 255;

	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	let h, s, l = (max + min) / 2;

	if (max === min) {
		h = s = 0; // acromático (cinza)
	} else {
		const d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
		switch (max) {
		case r: h = (g - b) / d + (g < b ? 6 : 0); break;
		case g: h = (b - r) / d + 2; break;
		case b: h = (r - g) / d + 4; break;
		}
		h /= 6;
	}

	return [h, s, l];
}

function hexToRgb(hex) {
    let r = 0, g = 0, b = 0;
    // 3 digits
    if (hex.length === 4) {
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);
    } 
    // 6 digits
    else if (hex.length === 7) {
        r = parseInt(hex[1] + hex[2], 16);
        g = parseInt(hex[3] + hex[4], 16);
        b = parseInt(hex[5] + hex[6], 16);
    }
    return [r, g, b];
}

// Funções de conversão de espaço de cores: RGB -> XYZ -> CIELAB
function rgbToLab([r, g, b]) {
    r /= 255;
    g /= 255;
    b /= 255;

    r = (r > 0.04045) ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
    g = (g > 0.04045) ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
    b = (b > 0.04045) ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

    let x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
    let y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.00000;
    let z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;

    x = (x > 0.008856) ? Math.pow(x, 1/3) : (7.787 * x) + 16/116;
    y = (y > 0.008856) ? Math.pow(y, 1/3) : (7.787 * y) + 16/116;
    z = (z > 0.008856) ? Math.pow(z, 1/3) : (7.787 * z) + 16/116;

    return [(116 * y) - 16, 500 * (x - y), 200 * (y - z)];
}

function hslToRgb(h, s, l) {
    let r, g, b;

    if (s === 0) {
        r = g = b = l; // acromático
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function rgbToHex([r, g, b]) {
    const toHex = c => ('0' + c.toString(16)).slice(-2);
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}


//---------xxx

function getDeltaE(lab1, lab2) {
    const [l1, a1, b1] = lab1;
    const [l2, a2, b2] = lab2;

    const deltaL = l1 - l2;
    const deltaA = a1 - a2;
    const deltaB = b1 - b2;

    // Distância Euclidiana simples, que é suficiente para a maioria dos casos (CIE76)
    return Math.sqrt(deltaL * deltaL + deltaA * deltaA + deltaB * deltaB);
}


export function mapPaletteToBase(sourceRgbPalette, baseHexPalette) {
    // 1. Converte a paleta base para RGB e LAB para cálculos rápidos
    const baseRgbPalette = baseHexPalette.map(hexToRgb);
    const baseLabPalette = baseRgbPalette.map(rgbToLab);

    const matchedColors = new Set();

    // 2. Para cada cor da imagem, encontre a mais próxima na base
    sourceRgbPalette.forEach(sourceRgb => {
        const sourceLab = rgbToLab(sourceRgb);
        
        let minDistance = Infinity;
        let bestMatchIndex = 0;

        baseLabPalette.forEach((baseLab, index) => {
            const distance = getDeltaE(sourceLab, baseLab);
            if (distance < minDistance) {
                minDistance = distance;
                bestMatchIndex = index;
            }
        });

        // 3. Adiciona a cor correspondente (em formato hex) da paleta base ao conjunto
        matchedColors.add(baseHexPalette[bestMatchIndex]);
    });

    // 4. Retorna as cores únicas encontradas como um array
    return Array.from(matchedColors);
}

export function getContrastingShade(hexColor, amount = 0.15) {
    if (!hexColor) return '#000000'; // Retorna preto se a cor for inválida

    // 1. Converte Hex para RGB, e depois para HSL
    const rgb = hexToRgb(hexColor);
    let [h, s, l] = rgbToHsl(...rgb);

    // 2. Verifica se a cor é clara (luminosidade > 0.55) e a escurece
    if (l > 0.55) {
        l = Math.max(0, l - amount);
    } 
    // 3. Se a cor for escura, a clareia
    else { 
        l = Math.min(1, l + amount);
    }

    // 4. Converte o HSL modificado de volta para RGB e depois para Hex
    const newRgb = hslToRgb(h, s, l);
    return rgbToHex(newRgb);
}

export function isInnerBgLight(hexColor) {
    if (!hexColor) return true; // Retorna branco como padrão

    const rgb = hexToRgb(hexColor);
    const [r, g, b] = rgb.map(c => {
        c /= 255.0;
        if (c <= 0.03928) {
            return c / 12.92;
        }
        return Math.pow((c + 0.055) / 1.055, 2.4);
    });

    // Fórmula para calcular a luminância (brilho percebido)
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

    // Retorna preto para fundos claros (luminância > 0.5) e branco para fundos escuros
    return luminance > 0.5 ? true : false;
}