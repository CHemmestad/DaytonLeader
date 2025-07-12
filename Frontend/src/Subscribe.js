import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Subscribe.css';
import paper from "./Images/paperStack2.png";
import online from "./Images/onlinePaper.png";
import bundle from "./Images/bundle.png";
import background from "./Images/Backgrounds/background.jpg"

const Subscribe = () => {

    const navigate = useNavigate();

    const handleSubscribe = (priceId) => {
        navigate(`/checkout?priceId=${priceId}`);
    };

    return (
        <div className="subscribe-container">
            <h2 className="title">Choose a Subscription Plan</h2>
            <div className="article-divider d-flex align-items-center m-3">
                <div className="flex-grow-1 line-left" />
                <span className="px-3 title">Newspaper Only</span>
                <div className="flex-grow-1 line-right" />
            </div>
            <div className="d-flex flex-column justify-content-center">
                <div className="plan-card">
                    <div className="d-flex">
                        <div
                            className="article-image"
                            style={{
                                backgroundImage: `url(${paper})`,
                                maxWidth: '300px',
                                minWidth: '100px',
                                backgroundSize: 'cover',
                                backgroundColor: '#570335',
                            }}
                        ></div>
                        <div className="plan-content col">
                            <div className="plan-perks d-flex flex-column flex-grow-1">
                                <ul className="list-unstyled">
                                    <li>Weekly printed newspaper delivery</li>
                                    <li>Local news coverage</li>
                                    <li>Special feature stories</li>
                                    <li>Exclusive interviews</li>
                                </ul>
                            </div>
                            <div className="plan-footer">
                                <p>$50/year</p>
                                <button className="btn" onClick={() => handleSubscribe('price_1RiLckQHfiVvd5iEDEsi4Bwy')}>Subscribe</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="article-divider d-flex align-items-center m-3">
                    <div className="flex-grow-1 line-left" />
                    <span className="px-3 title">Online Only</span>
                    <div className="flex-grow-1 line-right" />
                </div>
                <div className="plan-card">
                    <div className="d-flex">
                        <div
                            className="article-image"
                            style={{
                                backgroundImage: `url(${online})`,
                                maxWidth: '300px',
                                minWidth: '100px',
                                backgroundSize: 'cover',
                            }}
                        ></div>
                        <div className="plan-content col">
                            <div className="plan-perks d-flex flex-column flex-grow-1">
                                <ul className="list-unstyled">
                                    <li>Access to digital editions online</li>
                                    <li>Receive digital editions via email</li>
                                    <li>Play built-in games</li>
                                    <li>Automatic email notifications</li>
                                    <li>Ad-free browsing experience</li>
                                    <li>Downloadable digital issues</li>
                                </ul>
                            </div>
                            <div className="plan-footer">
                                <p>$35/year</p>
                                <button className="btn" onClick={() => handleSubscribe('price_1RiLfYQHfiVvd5iEcub76Iaf')}>Subscribe</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="article-divider d-flex align-items-center m-3">
                    <div className="flex-grow-1 line-left" />
                    <span className="px-3 title">Bundle</span>
                    <div className="flex-grow-1 line-right" />
                </div>
                <div className="plan-card">
                    <div className="d-flex">
                        <div
                            className="article-image"
                            style={{
                                backgroundImage: `url(${bundle})`,
                                maxWidth: '300px',
                                minWidth: '100px',
                                backgroundSize: 'cover',
                            }}
                        ></div>
                        <div className="plan-content col">
                            <div className="plan-perks d-flex flex-column flex-grow-1">
                                <ul className="list-unstyled">
                                    <li>Weekly printed newspaper delivery</li>
                                    <li>Local news coverage</li>
                                    <li>Special feature stories</li>
                                    <li>Exclusive interviews</li>
                                    <li>Access to digital editions online</li>
                                    <li>Receive digital editions via email</li>
                                    <li>Play built-in games</li>
                                    <li>Automatic email notifications</li>
                                    <li>Ad-free browsing experience</li>
                                    <li>Downloadable digital issues</li>
                                </ul>
                            </div>
                            <div className="plan-footer">
                                <p>$60/year</p>
                                <button className="btn" onClick={() => handleSubscribe('price_1RiLhGQHfiVvd5iE1Dv46M53')}>Subscribe</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Subscribe;
