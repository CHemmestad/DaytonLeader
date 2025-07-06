import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Link } from 'react-router-dom';
import logo from "./Images/logo.jpg";

const Sidebar = ({ userRole, username }) => {
    const [loading, setLoading] = useState(false);
    const [profilePicture, setProfilePicture] = useState(null);
    const [error, setError] = useState("");
    
    useEffect(() => {
        async function fetchProfilePicture() {
            console.log("Read the picture for Sidebar ...")
            try {
                // const sanitizedUsername = username.replace(/\s+/g, '')
                const response = await fetch(`http://localhost:8081/user/profile_picture/` + username);
                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
                    setProfilePicture(`http://localhost:8081${data.picture}`);
                } else {
                    console.error("Failed to fetch profile picture: ", response.statusText);
                }
            } catch (err) {
                console.error("Failed to fetch profile picture: ", err);
            }
        }
        fetchProfilePicture();
    }, []);
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
                            <li className="nav-item">
                                <Link to="/subscribe" className="nav-link text-white">Subcribe</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/About" className="nav-link text-white">Sponsors</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/contact" className="nav-link text-white">Contact</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/About" className="nav-link text-white">About</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/searchContacts" className="nav-link text-white">Search</Link>
                            </li>
                            {userRole === "admin" && (
                                <>
                                    <li className="nav-item">
                                        <Link to="/add-contact" className="nav-link text-white">Add Article</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="/deletecontact" className="nav-link text-white">Delete Article</Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>
            <form className="mt-auto text-center" style={{ width: '100%' }}>
                <div className="mb-2">
                    <input
                        type="text"
                        placeholder="Username"
                        className="form-control form-control-sm"
                        style={{ fontSize: '0.75rem' }}
                    />
                </div>
                <div className="mb-2">
                    <input
                        type="password"
                        placeholder="Password"
                        className="form-control form-control-sm"
                        style={{ fontSize: '0.75rem' }}
                    />
                </div>
                <button
                    type="submit"
                    className="btn btn-sm btn-light"
                    style={{ fontSize: '0.75rem', backgroundColor: 'white', color: '#570335' }}
                >
                    Login
                </button>
            </form>
        </div>
    );
};
export default Sidebar;