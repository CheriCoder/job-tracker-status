import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import '../App.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = await login(username, password);
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            navigate('/jobs');
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem'
        }}>
            <div className="card fade-in" style={{ maxWidth: '450px', width: '100%' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{
                        fontSize: '2.5rem',
                        background: 'var(--accent-gradient)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        marginBottom: '0.5rem'
                    }}>
                        Job Tracker
                    </h1>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Sign in to access your dashboard
                    </p>
                </div>

                {error && (
                    <div className="alert alert-error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            type="text"
                            className="input"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            autoFocus
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            className="input"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', marginTop: '1rem' }}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div>
                                Signing in...
                            </>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>

                <div style={{
                    marginTop: '2rem',
                    padding: '1rem',
                    background: 'rgba(99, 102, 241, 0.05)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(99, 102, 241, 0.1)'
                }}>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                        Default credentials: <strong style={{ color: 'var(--text-primary)' }}>admin / admin123</strong>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
