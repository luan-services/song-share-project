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

const router = createBrowserRouter([
  {
    path: "/",
    children: [
      {
        index: true, // "index: true" indica que este é o componente padrão para a rota pai "/"
        element: <HomePage />,
      },
      {
        path: "picture",
        element: <PicturePage/>,
      },
            {
        path: "termos",
        element: <TermsPage/>,
      },
            {
        path: "privacidade",
        element: <PrivacyPage/>,
      }
    ],
  },
]);


function App() {

	return (
		<div className="min-h-screen text-custom-charcoal bg-custom-background-sand">
        <RouterProvider router={router} />
		</div>
	)
}

export default App
