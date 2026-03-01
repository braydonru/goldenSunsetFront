import React, { useState } from "react";
import { Link } from "react-router-dom";
import { login } from "../../store/auth.actions";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async () => {
        // Limpiar error anterior
        setError("");

        if (!email || !password) {
            setError("Please fill in all fields");
            return;
        }

        setIsLoading(true);

        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError("Invalid username or password");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                <div style={styles.imageSide}>
                    <div style={styles.overlay}>
                        <h1 style={styles.brand}>Golden Sunset made by Josh</h1>
                        <p style={styles.subtitle}>
                            Personalize your style with elegance
                        </p>
                    </div>
                </div>

                <div style={styles.formSide}>
                    <h2 style={styles.title}>Login</h2>

                    {error && (
                        <div style={styles.errorMessage}>
                            ⚠️ {error}
                        </div>
                    )}

                    <input
                        type="text"
                        placeholder="Username"
                        style={{
                            ...styles.input,
                            borderColor: error && !email ? '#ff6b6b' : styles.input.borderColor
                        }}
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            if (error) setError("");
                        }}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        style={{
                            ...styles.input,
                            borderColor: error && !password ? '#ff6b6b' : styles.input.borderColor
                        }}
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            if (error) setError("");
                        }}
                    />

                    <button
                        style={{
                            ...styles.button,
                            opacity: isLoading ? 0.7 : 1,
                            cursor: isLoading ? 'not-allowed' : 'pointer'
                        }}
                        onClick={handleLogin}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>

                    <p style={styles.footerText}>
                        Don't have an account?{" "}
                        <Link to="/register" style={styles.link}>
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

const gold = '#d4af37';
const dark = '#5d687b';
const errorRed = '#ff6b6b';

const styles = {
    page: {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #020617, #0f172a)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, sans-serif'
    },
    card: {
        width: 900,
        height: 480,
        display: 'flex',
        borderRadius: 20,
        overflow: 'hidden',
        boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
        background: dark
    },
    imageSide: {
        flex: 1,
        backgroundImage: 'url(./img/prueba1.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative'
    },
    overlay: {
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(180deg, rgba(0,0,0,0.2), rgba(0,0,0,0.85))',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: 40,
        color: gold
    },
    brand: {
        fontSize: 36,
        margin: 0,
        fontWeight: 800,
        letterSpacing: 1,
        color: '#f5e6b3',
    },
    subtitle: {
        marginTop: 8,
        color: '#f5e6b3',
        fontSize: 16
    },
    formSide: {
        flex: 1,
        padding: 50,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        background: '#020617',
        position: 'relative'
    },
    title: {
        color: gold,
        fontSize: 28,
        marginBottom: 20,
        textAlign: 'center'
    },
    errorMessage: {
        backgroundColor: 'rgba(255, 107, 107, 0.1)',
        border: `1px solid ${errorRed}`,
        color: errorRed,
        padding: '12px 16px',
        borderRadius: '12px',
        marginBottom: '20px',
        fontSize: '14px',
        textAlign: 'center',
        animation: 'shake 0.5s ease-in-out',
        backdropFilter: 'blur(5px)'
    },
    input: {
        padding: '14px 16px',
        borderRadius: 12,
        border: `1px solid ${gold}`,
        background: 'transparent',
        color: '#fff',
        marginBottom: 18,
        fontSize: 15,
        outline: 'none',
        transition: 'all 0.3s ease'
    },
    button: {
        marginTop: 10,
        padding: 14,
        borderRadius: 14,
        border: 'none',
        background: `linear-gradient(135deg, ${gold}, #f5d76e)`,
        color: '#1a1a1a',
        fontWeight: 800,
        fontSize: 16,
        cursor: 'pointer',
        transition: 'all 0.3s ease'
    },
    footerText: {
        marginTop: 20,
        color: '#e5e7eb',
        fontSize: 14,
        textAlign: 'center'
    },
    link: {
        color: gold,
        textDecoration: 'none',
        fontWeight: 600
    }
};

// Agrega este estilo al final de tu archivo CSS global o en una etiqueta <style>
const globalStyles = `
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
}
`;

// Si no tienes un archivo CSS global, puedes agregarlo así:
const styleTag = document.createElement('style');
styleTag.textContent = globalStyles;
document.head.appendChild(styleTag);