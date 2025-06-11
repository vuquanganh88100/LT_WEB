import logo from './logo.svg';
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRouter';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AppRoutes>
        </AppRoutes>
        <ToastContainer>
        </ToastContainer>
      </BrowserRouter>
    </div>
  );
}

export default App;
