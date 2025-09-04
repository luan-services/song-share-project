// import do react-router
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// import das páginas
import { HomePage } from './pages/HomePage';
import { PicturePage } from './pages/PicturePage';

// import do css global
import './App.css'

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
      }
    ],
  },
]);


function App() {

	return (
		<div className="min-h-screen text-gray-700">
			<RouterProvider router={router} />
		</div>
	)
}

export default App
