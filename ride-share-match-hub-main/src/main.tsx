import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Clear any stale user data on fresh app load to ensure clean state
// This removes the fake "logged in" state
if (typeof window !== 'undefined') {
  // Only clear on actual page load, not on hot reload
  const isFirstLoad = !sessionStorage.getItem('app_initialized');
  if (isFirstLoad) {
    localStorage.removeItem('userData');
    localStorage.removeItem('userResume');
    localStorage.removeItem('appliedJobs');
    sessionStorage.setItem('app_initialized', 'true');
  }
}

createRoot(document.getElementById("root")!).render(<App />);
