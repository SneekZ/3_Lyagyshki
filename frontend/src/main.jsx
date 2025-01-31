import ReactDOM from 'react-dom/client' 
import './index.css'
import App from './App.jsx'
import { MessageProvider } from './components/Utils/MessageContext.jsx'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <MessageProvider>
        <App />
    </MessageProvider>
)
