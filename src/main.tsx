
import { createRoot } from 'react-dom/client'
import App from './core/App'
import './index.css'

// OPTIMIZED: Removed StrictMode for production performance
createRoot(document.getElementById("root")!).render(<App />);