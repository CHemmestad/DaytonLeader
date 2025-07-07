// src/components/AdBar.js
import React from 'react';
import './AdBar.css';
import logo from "./Images/logo.jpg"
import { useRef, useEffect } from 'react';

const company = "Company Name"
const ads = [
    // {
    //     id: 1,
    //     imageUrl: logo,
    //     company: company,
    //     link: 'https://www.company1.com'
    // },
    {
        id: 1,
        imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpkc0tcJA47QFkWY-N5CoWXQ_A3V4thWEoRQ&s',
        company: 'BrewMaster Coffee',
        link: 'https://www.a.com',
    },
    {
        id: 2,
        imageUrl: 'https://www.searchenginejournal.com/wp-content/uploads/2024/07/ad-buyers-business-outcomes-top-kpi-iab-report-469.png',
        company: 'GreenStep Shoes',
        link: 'https://www.a.com',
    },
    {
        id: 3,
        imageUrl: 'https://www.appsflyer.com/wp-content/uploads/2021/11/What-is-an-ad-server.jpg',
        company: 'SkyNet WiFi',
        link: 'https://www.a.com',
    },
    {
        id: 4,
        imageUrl: 'https://marketingepic.com/wp-content/uploads/2017/02/Graphic_Of_Billboard_With_Word_Ad.webp',
        company: 'BookBarn',
        link: 'https://www.a.com',
    },
    {
        id: 5,
        imageUrl: 'https://i.vimeocdn.com/video/726299121-80b98654b4e6b29cbfc1fb64fecc16987d144a6a72d1efd875b705530efcde2f-d_890?region=us',
        company: 'FreshPlate Meals',
        link: 'https://www.a.com',
    }
];

const AdBar = () => {
    const numberOfAds = 4;
    const repeatedAds = [];

    for (let i = 0; i < numberOfAds; i++) {
        repeatedAds.push(
            <a
                key={i}
                href={ads[0].link}
                target="_blank"
                rel="noopener noreferrer"
                className="adcard"
            >
                <img src={ads[0].imageUrl} alt="Ad" className="ad-image" />
                <p style={{ color: 'black', margin: '0' }}>{ads[0].company}</p>
            </a>
        );
    }

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
                // height: '100vh',
                position: 'sticky',
                color: 'white'
            }}
        >
            <div
                className="adbar-container"
                ref={scrollRef}
            >
                <div className="align-items-center">
                    <span className="title" style={{ color: 'white' }}>ADs</span>
                </div>
                {/* {repeatedAds} */}
                {ads.map(ad => (
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