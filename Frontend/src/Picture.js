import React, { useState } from 'react';
import './Picture.css';
import sponsor from "./Images/Pictures/genericPictures.png";

const Picture = () => {

    const [sponsors] = useState([
    { id: 1, title: "Fourth of July Parade", image: sponsor },
    { id: 2, title: "County Fair 2024", image: sponsor },
    { id: 3, title: "Veterans Day Ceremony", image: sponsor },
    { id: 4, title: "Town Hall Meeting", image: sponsor },
    { id: 5, title: "School Play: Hamlet", image: sponsor },
    { id: 6, title: "Winter Festival", image: sponsor },
    { id: 7, title: "Spring Clean-Up", image: sponsor },
    { id: 8, title: "Fall Farmers Market", image: sponsor },
    { id: 9, title: "Holiday Tree Lighting", image: sponsor },
    { id: 10, title: "Community Sports Day", image: sponsor },
]);

    return (
        <div className="sponsor-container container">
            <h2 className="title text-center mb-4">Pictures</h2>
            <div className="row">
                {sponsors.map((sponsor) => (
                    <div key={sponsor.id} className="col-sm-12 col-md-6 col-lg-6 mb-4">
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
                            <h5 className="sponsor-name">{sponsor.title}</h5>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Picture;
