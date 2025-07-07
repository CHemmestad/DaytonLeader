import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Link } from 'react-router-dom';
import logo from "./Images/logo.jpg";

const Sidebar = ({ userRole, setUserRole }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [username, setUsername] = useState("Caleb");
    const [password, setPassword] = useState("");

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
            setError("Failed to log in. Please try again. " + err);
        } finally {
            setPassword("");
            setLoading(false);
        }
    };

    const handleLogout = () => {
        setUserRole(null);
        setUsername("");
        setPassword("");
        setError("");
    };

    return (
        <div className="d-flex flex-column vh-100 p-3"
            style={{
                width: '160px',
                // minWidth: '100px',
                backgroundColor: '#570335',
                // height: '100vh', // Set the height to 100vh to fill the entire screen
                position: 'sticky', // Fix the sidebar on the left side
                top: 0,
                color: 'white'
            }}
        >
            <div
                className="themed-grid-col"
                style={{
                    width: '150px',
                    height: '150px',
                    minWidth: '80px',
                    minHeight: '80px',
                    maxWidth: '150px',
                    maxHeight: '150px',
                    backgroundImage: `url(${logo})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: '50%',
                    flexShrink: 0,
                }}
            ></div>
            <nav className="navbar navbar-expand-lg">
                <div className="container-fluid">
                    <button className="navbar-toggler mx-auto" style={{ filter: 'brightness(0) invert(1)', borderColor: 'white', }} type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="nav flex-column text-center">
                            <li className="nav-item">
                                <Link to="/" className="nav-link text-white">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/paper" className="nav-link text-white">Paper</Link>
                            </li>
                            {userRole ? (
                                <>
                                    <li className="nav-item">
                                        <Link to="/about" className="nav-link text-white">Games</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="/searchContacts" className="nav-link text-white">Settings</Link>
                                    </li>
                                </>
                            ) : (
                                <li className="nav-item">
                                    <Link to="/subscribe" className="nav-link text-white">Subcribe</Link>
                                </li>
                            )}
                            <li className="nav-item">
                                <Link to="/sponsor" className="nav-link text-white">Sponsors</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/contact" className="nav-link text-white">Contact</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/about" className="nav-link text-white">About</Link>
                            </li>
                            {userRole === "admin" && (
                                <>
                                    <li className="nav-item">
                                        <Link to="/add-contact" className="nav-link text-white">Add/Delete User</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="/deletecontact" className="nav-link text-white">Edit</Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>
            {userRole ? (
                <div className="mt-auto text-center" >
                    <p>{username}</p>
                    <button
                        type="logout"
                        className="btn btn-sm btn-light"
                        style={{ fontSize: '0.75rem', backgroundColor: 'white', color: '#570335' }}
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            ) : (
                <form className="mt-auto text-center" style={{ width: '100%' }} onSubmit={handleLogin}>
                    <div className="mb-2">
                        <input type="text"
                            placeholder="Username"
                            className="form-control form-control-sm"
                            style={{ fontSize: '0.75rem' }}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)} required />
                    </div>
                    <div className="mb-2">
                        <input type="password"
                            placeholder="Password"
                            className="form-control form-control-sm"
                            style={{ fontSize: '0.75rem' }}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    {error && <p className="text-danger">{error}</p>}
                    {loading ? (
                        <span className="spinner-border" role="status" aria-hidden="true"></span>
                    ) : (
                        <button type="submit" className="btn btn-sm btn-light" style={{ fontSize: '0.75rem', backgroundColor: 'white', color: '#570335' }}>Login</button>
                    )}
                </form>
            )}
        </div>
    );
};
export default Sidebar;