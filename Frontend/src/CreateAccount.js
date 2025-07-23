import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const CreateAccount = ({ setUserRole, setUsername }) => {
    const { token } = useParams();
    const navigate = useNavigate();

    const [username, setUsernameTemp] = useState('');
    const [password, setPassword] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // const res = await fetch('http://localhost:8081/create-account', {
            const res = await fetch("https://daytonleader.onrender.com/create-account", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token,
                    username,
                    password,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setErrorMessage(data.message || 'Error creating account');
                setTimeout(() => setErrorMessage(''), 3000);
                return;
            }

            const { role, token: authToken, name } = data;

            localStorage.setItem("authToken", authToken);
            setUserRole(role);
            setUsername(username);
            navigate('/');
        } catch (err) {
            console.error("Create account error:", err);
            setErrorMessage(err.message || 'Network error');
            setTimeout(() => setErrorMessage(''), 3000);
        }
    };

    return (
        <div className="container">
            <h3 className="title mb-4">Create Your Account</h3>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Username</label>
                    <input
                        type="text"
                        className="form-control"
                        required
                        value={username}
                        onChange={(e) => setUsernameTemp(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button className="btn mb-2" type="submit">
                    Create Account
                </button>
            </form>
            {
                successMessage && (
                    <div className="alert alert-success" role="alert">
                        {successMessage}
                    </div>
                )
            }
            {
                errorMessage && (
                    <div className="alert alert-danger" role="alert">
                        {errorMessage}
                    </div>
                )
            }
        </div>
    );
};

export default CreateAccount;
