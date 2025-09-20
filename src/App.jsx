// import do react-router
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// import das páginas
import { HomePage } from './pages/HomePage';
import { PicturePage } from './pages/PicturePage';

// import do css global
import './App.css'
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import { PageWrapper } from './layout/PageWrapper';

const router = createBrowserRouter([
  {
    path: "/",
    children: [
      {
        index: true, // "index: true" indica que este é o componente padrão para a rota pai "/"
        element: <PageWrapper><HomePage /></PageWrapper>,
      },
      {
        path: "picture",
        element: <PageWrapper><PicturePage/></PageWrapper>,
      },
            {
        path: "termos",
        element: <PageWrapper><TermsPage/></PageWrapper>,
      },
            {
        path: "privacidade",
        element: <PageWrapper><PrivacyPage/></PageWrapper>,
      }
    ],
  },
]);


function App() {

	return (
		<div className="min-h-screen text-custom-charcoal bg-custom-background-sand font-noto-sans">
        <RouterProvider router={router} />
		</div>
	)
}

export default App
