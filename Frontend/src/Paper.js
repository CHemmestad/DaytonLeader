// src/pages/Paper.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import paperExample from "./Images/paperExample.jpg"; // adjust the path as needed

const Paper = ({ userRole }) => {
    const navigate = useNavigate();

    const isAllowed = userRole === 'admin' || userRole === 'user';

    const handleProtectedAction = (path) => {
        if (isAllowed) {
            navigate(path);
        } else {
            // Redirect to login or show prompt
            alert('Please log in or subscribe to access this feature.');
            navigate('/subscribe');
        }
    };
    return (
        <div className="paper-wrapper" style={styles.wrapper}>
            <img src={paperExample} alt="Front Page" style={styles.image} />

            <div style={styles.buttonGroup}>
                <a
                    className="btn mx-2"
                    onClick={() => handleProtectedAction('/paper/read')}
                >
                    Read
                </a>
                <a
                    className="btn mx-2"
                    onClick={() => handleProtectedAction('/paper/download')}
                >
                    Download
                </a>
            </div>
        </div>
    );
};

const styles = {
    wrapper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
    },
    image: {
        width: '100%',
        maxWidth: '800px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    },
    buttonGroup: {
        marginTop: '1.5rem',
    },
};

export default Paper;
