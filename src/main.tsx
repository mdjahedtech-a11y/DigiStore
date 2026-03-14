import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { CartProvider } from './context/CartContext.tsx';
import './index.css';

// Security features
document.addEventListener('contextmenu', (e) => {
  // Only disable right click on preview images/content, but for demo we'll disable globally
  // except for inputs
  if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
    return;
  }
  e.preventDefault();
});

document.addEventListener('copy', (e) => {
  // Prevent copying text
  if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
    return;
  }
  e.preventDefault();
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CartProvider>
      <App />
    </CartProvider>
  </StrictMode>,
);
