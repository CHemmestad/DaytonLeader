import React, { useState } from 'react';
import './Sponsor.css';
import sponsor from "./Images/sponsor.png";

const Sponsor = () => {

    const [sponsors] = useState([
        { id: 1, name: "Local Bank", image: sponsor },
        { id: 2, name: "Coffee Shop", image: sponsor },
        { id: 3, name: "Auto Repair", image: sponsor },
        { id: 4, name: "Tech Co", image: sponsor },
        { id: 1, name: "Local Bank", image: sponsor },
        { id: 2, name: "Coffee Shop", image: sponsor },
        { id: 3, name: "Auto Repair", image: sponsor },
        { id: 4, name: "Tech Co", image: sponsor },
        { id: 1, name: "Local Bank", image: sponsor },
        { id: 2, name: "Coffee Shop", image: sponsor },
        { id: 3, name: "Auto Repair", image: sponsor },
        { id: 4, name: "Tech Co", image: sponsor },
        { id: 1, name: "Local Bank", image: sponsor },
        { id: 2, name: "Coffee Shop", image: sponsor },
        { id: 3, name: "Auto Repair", image: sponsor },
        { id: 4, name: "Tech Co", image: sponsor },
    ]);

    return (
        <div className="sponsor-container container">
            <h2 className="title text-center mb-4">Sponsors</h2>
            <div className="row">
                {sponsors.map((sponsor) => (
                    <div key={sponsor.id} className="col-sm-6 col-md-6 col-lg-6 mb-4">
                        <div className="sponsor-card text-center p-3 shadow rounded">
                            <div style={{
                                height: '300px', background: `url(${sponsor.image})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                {/* <img
                                    src={sponsor.image}
                                    alt={sponsor.name}
                                    className="img-fluid mb-2"
                                    style={{ height: "300px", objectFit: "cover" }}
                                /> */}
                            </div>
                            <h5 className="sponsor-name">{sponsor.name}</h5>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Sponsor;
