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
                    scrollStep = -1;
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
        <div className="d-flex flex-column"
            style={{
                backgroundColor: '#570335',
                height: '100vh',
                position: 'sticky',
                color: 'white',
                top: 0,
            }}
        >
            <div className="align-items-center">
                <span className="title" style={{ color: 'white' }}>ADs</span>
            </div>
            <div
                className="adbar-container"
                ref={scrollRef}
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