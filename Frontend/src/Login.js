import React, { useState } from "react";

const Authentication = ({ username, setUsername, password, setPassword, setUserRole }) => {
    // const [username, setUsername] = useState("");
    // const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await
                fetch("https://daytonleader.onrender.com/contact/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", },
                    body: JSON.stringify({ username, password }),
                }
                );
            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.error);
                setLoading(false);
                return;
            }
            const { role } = await response.json();
            setUserRole(role);
        } catch (err) {
            console.log("Failed to log in. Please try again." + err);
            setError("Failed to log in. Please try again." + err);
        } finally {
            setLoading(false);
        }
    };
    return (<div className="container mt-4">
        <h2 className="text-center">Login</h2>
        <form onSubmit={handleLogin}>
            <div className="mb-3">
                <label className="form-label">Username</label>
                <input type="text" className="form-control" value={username}
                    onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div className="mb-3">
                <label className="form-label">Password</label>
                <input type="password" className="form-control" value={password}
                    onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {error && <p className="text-danger">{error}</p>}
            {loading ? (
            <button className="btn btn-primary" type="button" disabled>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Logging in...
            </button>
            ) : (
            <button type="submit" className="btn btn-primary">Login</button>
            )}
        </form>
    </div>);
};
export default Authentication;
