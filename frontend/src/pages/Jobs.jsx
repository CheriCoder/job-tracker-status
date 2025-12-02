import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getJobs, logout } from '../services/api';
import '../App.css';

const Jobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const data = await getJobs();
            setJobs(data.jobs);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to load jobs');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const filteredJobs = jobs.filter(job =>
        job.processName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.processFunction?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.comments?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getVarianceClass = (variance) => {
        if (variance === null || variance === undefined) return '';
        return variance > 0 ? 'text-error' : variance < 0 ? 'text-success' : '';
    };

    return (
        <div style={{ minHeight: '100vh', padding: '2rem' }}>
            <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
                {/* Header */}
                <div className="flex-between mb-3 fade-in">
                    <div>
                        <h1 style={{
                            fontSize: '2.5rem',
                            background: 'var(--accent-gradient)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            marginBottom: '0.5rem'
                        }}>
                            Job Tracker Dashboard
                        </h1>
                        <p style={{ color: 'var(--text-secondary)' }}>
                            Monitor and track job processes
                        </p>
                    </div>
                    <div className="flex gap-1">
                        <button
                            onClick={() => navigate('/config')}
                            className="btn btn-secondary"
                        >
                            ⚙️ Email Config
                        </button>
                        <button
                            onClick={handleLogout}
                            className="btn btn-secondary"
                        >
                            🚪 Logout
                        </button>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="card mb-2 slide-in" style={{ animationDelay: '0.1s' }}>
                    <div className="input-group" style={{ marginBottom: 0 }}>
                        <input
                            type="text"
                            className="input"
                            placeholder="🔍 Search by process name, function, or comments..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Stats */}
                <div className="flex gap-2 mb-2 slide-in" style={{ animationDelay: '0.2s' }}>
                    <div className="card" style={{ flex: 1, textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent-primary)' }}>
                            {jobs.length}
                        </div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Total Jobs</div>
                    </div>
                    <div className="card" style={{ flex: 1, textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--success)' }}>
                            {jobs.filter(j => j.comments === 'Completed').length}
                        </div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Completed</div>
                    </div>
                    <div className="card" style={{ flex: 1, textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--warning)' }}>
                            {filteredJobs.length}
                        </div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Filtered Results</div>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="alert alert-error">
                        {error}
                    </div>
                )}

                {/* Loading State */}
                {loading ? (
                    <div className="flex-center" style={{ padding: '4rem' }}>
                        <div className="spinner"></div>
                    </div>
                ) : (
                    /* Jobs Table */
                    <div className="table-container slide-in" style={{ animationDelay: '0.3s' }}>
                        <table>
                            <thead>
                                <tr>
                                    <th>Process Name</th>
                                    <th>Function</th>
                                    <th>Forecasted Start</th>
                                    <th>Forecasted End</th>
                                    <th>Actual Start</th>
                                    <th>Actual End</th>
                                    <th>Comments</th>
                                    <th>Est. Duration</th>
                                    <th>Actual Duration</th>
                                    <th>Variance</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredJobs.length === 0 ? (
                                    <tr>
                                        <td colSpan="10" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                                            No jobs found matching your search
                                        </td>
                                    </tr>
                                ) : (
                                    filteredJobs.map((job, index) => (
                                        <tr key={index}>
                                            <td style={{ fontWeight: '500' }}>{job.processName || 'N/A'}</td>
                                            <td>{job.processFunction || 'N/A'}</td>
                                            <td>{job.forecastedStart || 'N/A'}</td>
                                            <td>{job.forecastedEnd || 'N/A'}</td>
                                            <td>{job.actualStart || 'N/A'}</td>
                                            <td>{job.actualEnd || 'N/A'}</td>
                                            <td>
                                                <span style={{
                                                    padding: '0.25rem 0.75rem',
                                                    borderRadius: '1rem',
                                                    fontSize: '0.85rem',
                                                    background: job.comments === 'Completed'
                                                        ? 'rgba(16, 185, 129, 0.1)'
                                                        : job.comments === 'Milestone'
                                                            ? 'rgba(245, 158, 11, 0.1)'
                                                            : 'rgba(148, 163, 184, 0.1)',
                                                    color: job.comments === 'Completed'
                                                        ? 'var(--success)'
                                                        : job.comments === 'Milestone'
                                                            ? 'var(--warning)'
                                                            : 'var(--text-secondary)'
                                                }}>
                                                    {job.comments || 'N/A'}
                                                </span>
                                            </td>
                                            <td>{job.estimatedDurationMinutes !== null ? `${job.estimatedDurationMinutes} min` : 'N/A'}</td>
                                            <td>{job.actualDurationMinutes !== null ? `${job.actualDurationMinutes} min` : 'N/A'}</td>
                                            <td className={getVarianceClass(job.variance)}>
                                                {job.variance !== null ? `${job.variance > 0 ? '+' : ''}${job.variance} min` : 'N/A'}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Jobs;
