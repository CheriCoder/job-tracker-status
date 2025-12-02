import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEmailConfigs, addEmailConfig, deleteEmailConfig, sendReport } from '../services/api';
import '../App.css';

const Config = () => {
    const [emails, setEmails] = useState([]);
    const [newEmail, setNewEmail] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchEmails();
    }, []);

    const fetchEmails = async () => {
        try {
            const data = await getEmailConfigs();
            setEmails(data.emails);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to load email configurations');
        } finally {
            setLoading(false);
        }
    };

    const handleAddEmail = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!newEmail.trim()) {
            setError('Please enter an email address');
            return;
        }

        try {
            await addEmailConfig(newEmail.trim());
            setSuccess('Email added successfully!');
            setNewEmail('');
            fetchEmails();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to add email');
        }
    };

    const handleDeleteEmail = async (id) => {
        setError('');
        setSuccess('');

        try {
            await deleteEmailConfig(id);
            setSuccess('Email removed successfully!');
            fetchEmails();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to delete email');
        }
    };

    const handleSendReport = async () => {
        setError('');
        setSuccess('');
        setSending(true);

        try {
            const response = await sendReport();
            setSuccess(response.message || 'Report sent successfully!');
            setTimeout(() => setSuccess(''), 5000);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to send report');
        } finally {
            setSending(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', padding: '2rem' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
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
                            Email Configuration
                        </h1>
                        <p style={{ color: 'var(--text-secondary)' }}>
                            Manage recipient email addresses for job reports
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/jobs')}
                        className="btn btn-secondary"
                    >
                        ← Back to Jobs
                    </button>
                </div>

                {/* Alerts */}
                {error && <div className="alert alert-error">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                {/* Add Email Form */}
                <div className="card mb-2 slide-in">
                    <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>Add New Email</h2>
                    <form onSubmit={handleAddEmail}>
                        <div className="flex gap-1">
                            <input
                                type="email"
                                className="input"
                                placeholder="Enter email address (e.g., user@harman.com)"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                style={{ flex: 1 }}
                            />
                            <button type="submit" className="btn btn-primary">
                                ➕ Add Email
                            </button>
                        </div>
                    </form>
                </div>

                {/* Email List */}
                <div className="card mb-2 slide-in" style={{ animationDelay: '0.1s' }}>
                    <div className="flex-between mb-2">
                        <h2 style={{ fontSize: '1.5rem' }}>Configured Recipients</h2>
                        <span style={{
                            padding: '0.5rem 1rem',
                            background: 'rgba(99, 102, 241, 0.1)',
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--accent-primary)',
                            fontWeight: '600'
                        }}>
                            {emails.length} {emails.length === 1 ? 'recipient' : 'recipients'}
                        </span>
                    </div>

                    {loading ? (
                        <div className="flex-center" style={{ padding: '2rem' }}>
                            <div className="spinner"></div>
                        </div>
                    ) : emails.length === 0 ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '3rem',
                            color: 'var(--text-muted)',
                            background: 'var(--bg-secondary)',
                            borderRadius: 'var(--radius-md)'
                        }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📧</div>
                            <p>No email addresses configured yet</p>
                            <p style={{ fontSize: '0.875rem' }}>Add an email address above to get started</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {emails.map((email) => (
                                <div
                                    key={email.id}
                                    className="flex-between"
                                    style={{
                                        padding: '1rem',
                                        background: 'var(--bg-secondary)',
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid var(--border-color)',
                                        transition: 'all var(--transition-fast)'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'var(--bg-card)';
                                        e.currentTarget.style.borderColor = 'var(--accent-primary)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'var(--bg-secondary)';
                                        e.currentTarget.style.borderColor = 'var(--border-color)';
                                    }}
                                >
                                    <div>
                                        <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>
                                            📧 {email.sender_email}
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                            Added: {new Date(email.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteEmail(email.id)}
                                        className="btn btn-danger btn-sm"
                                    >
                                        🗑️ Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Send Report Button */}
                <div className="card slide-in" style={{ animationDelay: '0.2s' }}>
                    <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>Send Job Report</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                        Send the complete job tracking report to all configured email addresses
                    </p>
                    <button
                        onClick={handleSendReport}
                        className="btn btn-primary"
                        style={{ width: '100%', fontSize: '1.1rem', padding: '1rem' }}
                        disabled={sending || emails.length === 0}
                    >
                        {sending ? (
                            <>
                                <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div>
                                Sending Report...
                            </>
                        ) : (
                            <>
                                📨 Send Report to {emails.length} {emails.length === 1 ? 'Recipient' : 'Recipients'}
                            </>
                        )}
                    </button>
                    {emails.length === 0 && (
                        <p style={{
                            marginTop: '1rem',
                            textAlign: 'center',
                            color: 'var(--text-muted)',
                            fontSize: '0.875rem'
                        }}>
                            Add at least one email address to send reports
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Config;
