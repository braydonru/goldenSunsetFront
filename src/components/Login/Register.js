import React, {useState} from 'react'
import {Link} from "react-router-dom";
import {ENV} from "../../conf/env";
import { useNavigate } from "react-router-dom";


export default function Register() {
    const navigate = useNavigate();

    const [user, setUser] = useState({
        name:'',
        username:'',
        email:'',
        password:'',

    })
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({
            ...user,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccess('');

        try {
            const body = new URLSearchParams();
            body.append('name', user.name);
            body.append('username', user.username);
            body.append('email', user.email);
            body.append('password', user.password);

            const response = await fetch(`${ENV.API_URL}/Login/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'accept': 'application/json'
                },
                body: body.toString(),
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.detail || 'Error creating user');
            }

            setSuccess('User created successfully!');
            setUser({
                name: '',
                username: '',
                email: '',
                password: '',
            });
            navigate('/login');
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };



    return (
        <div style={styles.page}>
            <div style={styles.card}>

                <div style={styles.formSide}>
                <form onSubmit={handleSubmit} style={styles.formSide}>
                    <h2 style={styles.title}>Sign up</h2>
                    <input
                        type="text"
                        name='name'
                        placeholder="Full Name"
                        value={user.name}
                        onChange={handleChange}
                        style={styles.input}
                        required
                    />

                    <input
                        type="text"
                        name='username'
                        value={user.username}
                        onChange={handleChange}
                        placeholder="username"
                        style={styles.input}
                        required
                    />

                    <input
                        type="email"
                        name='email'
                        value={user.email}
                        onChange={handleChange}
                        placeholder="E-Mail"
                        style={styles.input}
                        required
                    />

                    <input
                        value={user.password}
                        name='password'
                        onChange={handleChange}
                        type="password"
                        placeholder="password"
                        style={styles.input}
                        required
                    />


                    <button style={styles.button}>
                        Sign up
                    </button>
                </form>
                    <p style={styles.footerText}>
                        Do you already have an account? <Link to='/login' style={styles.link}>Login</Link>
                    </p>
                </div>

                {/* RIGHT IMAGE */}
                <div style={styles.imageSide}>
                    <div style={styles.overlay}>
                        <h1 style={styles.brand}>Golden Sunset made by Josh</h1>
                        <p style={styles.subtitle}>
                            Join and create unique garments
                        </p>
                    </div>
                </div>

            </div>
        </div>
    )
}

/* =======================
   STYLES
======================= */
const gold = '#d4af37'
const dark = '#0f172a'

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
        width: 950,
        height: 520,
        display: 'flex',
        borderRadius: 20,
        overflow: 'hidden',
        boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
        background: dark
    },
    formSide: {
        flex: 1,
        padding: 50,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        background: '#020617'
    },
    title: {
        color: gold,
        fontSize: 28,
        marginBottom: 30,
        textAlign: 'center'
    },
    input: {
        padding: '14px 16px',
        borderRadius: 12,
        border: `1px solid ${gold}`,
        background: 'transparent',
        color: '#fff',
        marginBottom: 18,
        fontSize: 15,
        outline: 'none'
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
        cursor: 'pointer'
    },
    footerText: {
        color: '#e5e7eb',
        fontSize: 14,
        textAlign: 'center'
    },
    link: {
        color: gold,
        fontWeight: 700,
        cursor: 'pointer'
    },
    imageSide: {
        flex: 1,
        backgroundImage: 'url(./img/prueba_5.png)',
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
    }
}
