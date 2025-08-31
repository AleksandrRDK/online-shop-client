import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from '@/App.jsx';
import '@/styles/reset.scss';
import '@/styles/index.scss';
import '@/styles/responsive.scss';

const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
document.documentElement.classList.toggle('dark', prefersDark);

window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', (e) => {
        document.documentElement.classList.toggle('dark', e.matches);
    });

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <App />
    </StrictMode>
);
