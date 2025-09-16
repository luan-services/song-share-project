// /src/layout/PageWrapper.jsx

import { CookieBanner } from "../layout/CookieBanner" // componente baner para setar as permissões

export const PageWrapper = ({ children }) => {
    return (
        <>
            {children}
            <CookieBanner/>
        </>
    );
};