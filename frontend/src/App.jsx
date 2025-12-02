import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Jobs from './pages/Jobs';
import Config from './pages/Config';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                    path="/jobs"
                    element={
                        <ProtectedRoute>
                            <Jobs />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/config"
                    element={
                        <ProtectedRoute>
                            <Config />
                        </ProtectedRoute>
                    }
                />
                <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
        </Router>
    );
}

export default App;
