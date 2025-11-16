export default function NoJavaScript() {
    return (
        <noscript>
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100vh',
                backgroundColor: '#f8fafc',
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem',
                fontFamily: 'system-ui, -apple-system, sans-serif'
            }}>
                <div style={{
                    maxWidth: '48rem',
                    width: '100%',
                    backgroundColor: 'white',
                    borderRadius: '1rem',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                    border: '1px solid #e2e8f0',
                    overflow: 'hidden'
                }}>
                    {/* Top bar */}
                    <div style={{
                        background: 'linear-gradient(to right, #3b82f6, #2563eb, #4f46e5)',
                        height: '0.5rem',
                        width: '100%'
                    }} />

                    {/* Content */}
                    <div style={{
                        padding: '3rem 1.5rem',
                        textAlign: 'center'
                    }}>
                        {/* Icon */}
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '5rem',
                            height: '5rem',
                            backgroundColor: '#dbeafe',
                            borderRadius: '9999px',
                            marginBottom: '1.5rem'
                        }}>
                            <svg 
                                style={{ width: '2.5rem', height: '2.5rem', color: '#3b82f6' }}
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth="2" 
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                />
                            </svg>
                        </div>

                        {/* Title */}
                        <h1 style={{
                            fontSize: '2rem',
                            fontWeight: '700',
                            color: '#1e293b',
                            marginBottom: '1rem',
                            lineHeight: '1.2'
                        }}>
                            JavaScript Required
                        </h1>

                        {/* Description */}
                        <p style={{
                            fontSize: '1rem',
                            color: '#64748b',
                            marginBottom: '2rem',
                            lineHeight: '1.6',
                            maxWidth: '32rem',
                            marginLeft: 'auto',
                            marginRight: 'auto'
                        }}>
                            This website requires JavaScript to function properly. Please enable JavaScript in your browser settings to access all features and content.
                        </p>

                        {/* Info box */}
                        <div style={{
                            backgroundColor: '#eff6ff',
                            borderRadius: '0.5rem',
                            padding: '1rem',
                            marginBottom: '2rem',
                            border: '1px solid #bfdbfe',
                            textAlign: 'left'
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '0.75rem'
                            }}>
                                <svg 
                                    style={{ 
                                        width: '1.25rem', 
                                        height: '1.25rem', 
                                        color: '#3b82f6',
                                        flexShrink: '0',
                                        marginTop: '0.125rem'
                                    }}
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth="2" 
                                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                <div>
                                    <p style={{
                                        fontSize: '0.875rem',
                                        color: '#1e40af',
                                        fontWeight: '600',
                                        marginBottom: '0.5rem'
                                    }}>
                                        Why is JavaScript needed?
                                    </p>
                                    <p style={{
                                        fontSize: '0.875rem',
                                        color: '#1e40af',
                                        lineHeight: '1.5'
                                    }}>
                                        This portfolio uses modern web technologies including Next.js and React, which require JavaScript for interactive features, animations, and dynamic content loading.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Instructions */}
                        <div style={{
                            textAlign: 'left',
                            backgroundColor: '#f8fafc',
                            padding: '1.5rem',
                            borderRadius: '0.5rem',
                            border: '1px solid #e2e8f0'
                        }}>
                            <h2 style={{
                                fontSize: '1rem',
                                fontWeight: '600',
                                color: '#1e293b',
                                marginBottom: '1rem'
                            }}>
                                How to enable JavaScript:
                            </h2>
                            <ol style={{
                                fontSize: '0.875rem',
                                color: '#64748b',
                                lineHeight: '1.8',
                                paddingLeft: '1.25rem',
                                margin: 0
                            }}>
                                <li style={{ marginBottom: '0.5rem' }}>
                                    <strong style={{ color: '#475569' }}>Chrome/Edge:</strong> Settings → Privacy and Security → Site Settings → JavaScript → Enable
                                </li>
                                <li style={{ marginBottom: '0.5rem' }}>
                                    <strong style={{ color: '#475569' }}>Firefox:</strong> Type <code style={{ 
                                        backgroundColor: '#e2e8f0',
                                        padding: '0.125rem 0.375rem',
                                        borderRadius: '0.25rem',
                                        fontFamily: 'monospace',
                                        fontSize: '0.8125rem'
                                    }}>about:config</code> in the address bar → Search for <code style={{ 
                                        backgroundColor: '#e2e8f0',
                                        padding: '0.125rem 0.375rem',
                                        borderRadius: '0.25rem',
                                        fontFamily: 'monospace',
                                        fontSize: '0.8125rem'
                                    }}>javascript.enabled</code> → Set to true
                                </li>
                                <li>
                                    <strong style={{ color: '#475569' }}>Safari:</strong> Preferences → Security → Enable JavaScript
                                </li>
                            </ol>
                        </div>

                        {/* Footer note */}
                        <p style={{
                            fontSize: '0.75rem',
                            color: '#94a3b8',
                            marginTop: '2rem',
                            fontStyle: 'italic'
                        }}>
                            After enabling JavaScript, please reload this page to continue.
                        </p>
                    </div>
                </div>
            </div>
        </noscript>
    );
}
