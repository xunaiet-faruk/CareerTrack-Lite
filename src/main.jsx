import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { router } from './router/Router'
import { RouterProvider } from 'react-router-dom';
import Authprovider from './context/Authprovider';


createRoot(document.getElementById('root')).render(
  <StrictMode>
<Authprovider>
           <RouterProvider router={router} />

</Authprovider>
  </StrictMode>,
)
