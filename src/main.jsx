
import { createRoot } from 'react-dom/client'
import App from './ScrollVideo.jsx'
import CentralLogViewer from './CentralLogViewer.jsx'

createRoot(document.getElementById('root')).render(
  <>
    <App />
    <CentralLogViewer /> 
  </>
)
