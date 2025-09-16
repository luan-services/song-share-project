// /src/components/CustomCookieBanner.jsx

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { initAnalytics } from '../../services/analytics'; // placeholder para cookies de análise (cookies não-essenciais)

const setCookie = (name, value, days) => {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

const getCookie = (name) => {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

export const CookieBanner = () => {

    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consentCookie = getCookie("songStickerCookieConsent"); // verifica se o cookie de consentimento existe quando o componente carrega
        if (!consentCookie) {
            setIsVisible(true);
        }
    }, []);

    const handleAccept = () => {
        setCookie("songStickerCookieConsent", "true", 150); // Salva o cookie por 150 dias
        setIsVisible(false); 
        initAnalytics(); // inicia o analitcs
    };

    const handleDecline = () => {
        setCookie("songStickerCookieConsent", "false", 150);
        setIsVisible(false);
    };

    if (!isVisible) {
        return null;
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-black/80 z-50 flex justify-center">
            <div className="container flex flex-col gap-4 p-3 sm:flex-row items-center justify-between">

                <div className="text-sm text-white">
                    Este site utiliza cookies para melhorar sua experiência. Saiba mais em nossa <Link to="/privacidade" className="cursor-pointer inline underline font-medium text-custom-secundary-red"> Política de Privacidade.</Link>
                </div>

                <div className="flex gap-2 self-end">
                    <button onClick={handleDecline} className="cursor-pointer border-2 border-custom-secundary-red text-custom-secundary-red px-4 py-2 rounded-lg text-sm font-bold">
                        Recusar
                    </button>
                    <button onClick={handleAccept} className="cursor-pointer bg-custom-secundary-red border-2 border-custom-secundary-red text-custom-charcoal px-4 py-2 rounded-lg text-sm font-bold">
                        Aceitar
                    </button>
                </div>
            </div>
        </div>
    );
};