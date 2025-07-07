import React from 'react';
import './Subscribe.css';
import paper from "./Images/paperStack.png";
import online from "./Images/onlinePaper.png";
import bundle from "./Images/bundle.png";

const Subscribe = () => {
    const handleSubscribe = async (priceId) => {
        const response = await fetch('http://localhost:8081/create-checkout-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ priceId }),
        });

        const { url } = await response.json();
        window.location.href = url; // Redirects to Stripe Checkout
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
                                <p>$100/year</p>
                                <button className="btn" onClick={() => handleSubscribe('price_1XXX_Newspaper')}>Subscribe</button>
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
                                <p>$50/year</p>
                                <button className="btn" onClick={() => handleSubscribe('price_1XXX_Newspaper')}>Subscribe</button>
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
                                <p>$75/year</p>
                                <button className="btn" onClick={() => handleSubscribe('price_1XXX_Newspaper')}>Subscribe</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Subscribe;
