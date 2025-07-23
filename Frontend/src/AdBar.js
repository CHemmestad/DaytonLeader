// src/components/AdBar.js
import React from 'react';
import './AdBar.css';
import logo from "./Images/logo.jpg"
import { useRef, useEffect } from 'react';
import importedAds from './LoadAds.js';

const AdBar = () => {
    const scrollRef = useRef(null);

    useEffect(() => {
        const scrollContainer = scrollRef.current;
        let scrollStep = 1; // initial scroll direction: down
        const intervalTime = 30; // ms

        const interval = setInterval(() => {
            if (scrollContainer) {
                // Change direction at bottom
                if (scrollContainer.scrollTop + scrollContainer.clientHeight >= scrollContainer.scrollHeight) {
                    scrollStep = 0;
                }
                // Change direction at top
                if (scrollContainer.scrollTop <= 0) {
                    scrollStep = 1;
                }

                scrollContainer.scrollTop += scrollStep;
            }
        }, intervalTime);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="scroll d-flex flex-column"
            style={{
                backgroundColor: '#570335',
                height: '100vh',
                position: 'sticky',
                color: 'white',
                top: 0,
            }}
        >
            <div className="scroll align-items-center">
                {/* <span
                    className="title"
                    style={{
                        position: 'absolute',
                        top: '10px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        color: 'white',
                        backgroundColor: '#570335',
                        padding: '0.4rem 1.2rem',
                        borderRadius: '10px',
                        zIndex: 10,
                        boxShadow: '0 0px 5px rgba(0, 0, 0, 0.47)',
                        width: '85%',
                    }}
                >
                    ADs
                </span> */}
                {/* <div className="glass-card"
                    style={{
                        height: 'auto',
                        position: 'absolute',
                        top: '10px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        padding: '10px',
                        borderRadius: '10px',
                        zIndex: 10,
                        width: '85%',
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(87,3,53,0.25))',
                        backdropFilter: 'blur(3px)',
                        WebkitBackdropFilter: 'blur(3px)',
                    }}
                >
                    <span
                        className="title"
                        style={{
                            top: '10px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            color: 'white',
                            backgroundColor: '#570335',
                            padding: '0.4rem 1.2rem',
                            borderRadius: '10px',
                            zIndex: 10,
                            boxShadow: '0 0px 5px rgba(0, 0, 0, 0.47)',
                            width: '85%',
                        }}
                    >
                        ADs
                    </span>
                </div> */}
            </div>
            <div
                className="scroll adbar-container"
                ref={scrollRef}
                // style={{ paddingTop: '12vh' }}
            >
                {/* {repeatedAds} */}
                {importedAds.map(ad => (
                    <a key={ad.id} href={ad.link} target="_blank" rel="noopener noreferrer" className="adcard">
                        <img src={ad.imageUrl} alt="Ad" className="ad-image" />
                        <p style={{ color: 'black', margin: '0' }}> {ad.company} </p>
                    </a>
                ))}
            </div>
        </div>
    );
};

export default AdBar;