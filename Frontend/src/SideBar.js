import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ userRole, username }) => {
    const [profilePicture, setProfilePicture] = useState(null);
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
        <div className="d-flex flex-column vh-200 p-3" 
        style={{
            width: '250px',
            backgroundColor: 'darkRed',
            height: '100vh', // Set the height to 100vh to fill the entire screen
            position: 'sticky', // Fix the sidebar on the left side
            top: 0, 
        }}
        >
            <h2 className="text-center">Navigation</h2>
            <ul className="nav flex-column">
                <li className="nav-item">
                    <Link to="/" className="nav-link text-dark">Home</Link>
                </li>
                <li className="nav-item">
                    <Link to="/contacts" className="nav-link text-dark">View Movies</Link>
                </li>
                <li className="nav-item">
                    <Link to="/contacts/action" className="nav-link text-dark">Action</Link>
                </li>
                <li className="nav-item">
                    <Link to="/contacts/animated" className="nav-link text-dark">Animated</Link>
                </li>
                <li className="nav-item">
                    <Link to="/contacts/thriller" className="nav-link text-dark">Thriller</Link>
                </li>
                <li className="nav-item">
                    <Link to="/contacts/comedy" className="nav-link text-dark">Comedy</Link>
                </li>
                <li className="nav-item">
                    <Link to="/searchContacts" className="nav-link text-dark">Search Movies</Link>
                </li>
                <li className="nav-item">
                    <Link to="/new_message" className="nav-link text-dark">Add New Review</Link>
                </li>
                <li className="nav-item">
                    <Link to="/FAQs" className="nav-link text-dark">FAQs</Link>
                </li>
                <li className="nav-item">
                    <Link to="/About" className="nav-link text-dark">About Us</Link>
                </li>
                {userRole === "admin" && (
                    <>
                        <li className="nav-item">
                            <Link to="/add-contact" className="nav-link text-dark">Add Movie</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/deletecontact" className="nav-link text-dark">Delete Movie</Link>
                        </li>
                    </>
                )}
            </ul>
            <div className="profile-picture">
                {profilePicture && <img src={profilePicture} style={{ width: "150px", height: "auto" }} alt="User Profile" />}
                <p>{username}</p>
            </div>
        </div>
    );
};
export default Sidebar;