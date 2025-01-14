import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {
 
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import HomePage from './layout/HomePage';
import Home from './pages/Home';
import PetListing from './pages/PetListing';
import SignUp from './pages/SignUp';
import ContextApi from './auth/ContextApi';

const queryClient = new QueryClient()
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage></HomePage>,
    children:[
      {
        path: '/',
        element:<Home></Home>
      },
      {
        path: '/pet-listing',
        element: <PetListing></PetListing>
      },
      {
        path: '/registration',
        element: <SignUp></SignUp>
      }
    ]
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ContextApi>
      <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
    </QueryClientProvider>

    </ContextApi>
  </StrictMode>,
)
