import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './auth.css';
import './login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const location = useLocation();
    const incoming = location.state?.incoming;
    
    // Mount untoggled to trigger transition animations perfectly
    const [isToggled, setIsToggled] = useState(true);

    const shapeStyle = (incoming && !isToggled) ? { transitionDelay: '0s' } : {};

    const { login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Triggers the CSS slide transition after mounting
        const timer = setTimeout(() => {
            setIsToggled(false);
        }, 50);
        return () => clearTimeout(timer);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const result = await login(email, password);
        if (!result.success) {
            setError(result.message);
        } else {
            navigate('/');
        }
        setLoading(false);
    };

    return (
        <div className="auth-page-container">
            <div className={`auth-wrapper ${isToggled ? 'toggled' : ''}`}>
                <div className="background-shape" style={shapeStyle}></div>
                <div className="secondary-shape" style={shapeStyle}></div>
                
                <div className="credentials-panel signin">
                    <h2 className="slide-element">Login</h2>
                    
                    {error && <div className="slide-element" style={{ color: '#ff4d4d', textAlign: 'center', marginBottom: 15, background: 'rgba(255,0,0,0.1)', padding: 10, borderRadius: 5, border: '1px solid rgba(255,0,0,0.3)' }}>{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="field-wrapper slide-element">
                            <input 
                                type="text" 
                                required 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <label>Username</label>
                            <i className="fa-solid fa-user"></i>
                        </div>

                        <div className="field-wrapper slide-element">
                            <input 
                                type="password" 
                                required 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <label>Password</label>
                            <i className="fa-solid fa-lock"></i>
                        </div>

                        <div className="field-wrapper slide-element">
                            <button className="submit-button" type="submit" disabled={loading}>
                                {loading ? 'Logging in...' : 'Login'}
                            </button>
                        </div>

                        <div className="switch-link slide-element">
                            <p>
                                Don't have an account? <br/> 
                                <a 
                                    href="#" 
                                    className="register-trigger"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setIsToggled(true);
                                        setTimeout(() => navigate('/register', { state: { incoming: true } }), 500);
                                    }}
                                >
                                    Sign Up
                                </a>
                            </p>
                        </div>
                    </form>
                </div>

                <div className="welcome-section signin">
                    <h2 className="slide-element">WELCOME BACK!</h2>
                </div>
            </div>

            <div className="auth-footer">
                <p>Made with ❤️ by <a href="#" target="_blank" rel="noreferrer">SVHEC</a></p>
            </div>
        </div>
    );
};

export default Login;
