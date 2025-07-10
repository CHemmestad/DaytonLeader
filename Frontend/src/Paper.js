// src/pages/Paper.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import paperExample from "./Images/paperExample.jpg";
import { useRef } from 'react';

const Paper = ({ userRole }) => {
    const [showModal, setShowModal] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const handleOpen = () => setShowModal(true);
    const handleClose = () => setShowModal(false);
    const navigate = useNavigate();
    const imageRef = useRef(null);
    const imageContainerRef = useRef(null);

    const isAllowed = userRole === 'admin' || userRole === 'user';

    const handleProtectedAction = (path) => {
        if (isAllowed) {
            handleOpen();
        } else {
            // Redirect to login or show prompt
            alert('Please log in or subscribe to access this feature.');
            navigate('/subscribe');
        }
    };

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, []);

    const handleFullScreen = () => {
        if (imageContainerRef.current) {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else {
                imageContainerRef.current.requestFullscreen().catch((err) => {
                    console.error(`Error attempting to enable full-screen mode: ${err.message}`);
                });
            }
        }
    };

    useEffect(() => {
        if (showModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        // Cleanup on unmount
        return () => {
            document.body.style.overflow = '';
        };
    }, [showModal]);

    return (
        <div className="paper-wrapper" style={styles.wrapper}>
            <img src={paperExample} alt="Front Page" style={styles.image} />
            {showModal && (
                <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-xl modal-dialog-scrollable" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title article-title">The Leader</h5>
                                <button type="button" className="btn-close" onClick={handleClose}></button>
                            </div>
                            <div className="modal-body text-center">
                                <div
                                    ref={imageContainerRef}
                                    style={{
                                        overflow: isFullscreen ? 'auto' : 'hidden',
                                        maxHeight: isFullscreen ? '100vh' : 'unset',
                                    }}
                                >
                                    <img
                                        ref={imageRef}
                                        src={paperExample}
                                        alt="Article"
                                        style={{
                                            width: isFullscreen ? '1500px' : '100%',
                                            borderRadius: '8px',
                                            marginBottom: '1rem',
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn" onClick={handleFullScreen}>
                                    Full Screen
                                </button>
                                <button className="btn" onClick={handleClose}>
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div style={styles.buttonGroup}>
                <a
                    className="btn mx-2"
                    onClick={() => handleProtectedAction()}
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
