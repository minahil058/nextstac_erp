import React from 'react';

export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ error, errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: '20px', color: 'white', background: '#990000', fontFamily: 'monospace' }}>
                    <h1>⚠️ Application Crashed</h1>
                    <h2>{this.state.error?.toString()}</h2>
                    <details>
                        <summary>Stack Trace</summary>
                        {this.state.errorInfo?.componentStack}
                    </details>
                    <button onClick={() => window.location.href = '/'} style={{ marginTop: '20px', padding: '10px' }}>Reload</button>
                </div>
            );
        }

        return this.props.children;
    }
}
