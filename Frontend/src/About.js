import React from 'react';
import LazyVideo from './LazyVideo';
import './About.css';
import justine from './Images/justine.png';
import courtney from './Images/courtney.png';

const About = () => {
    return (
        <div className="about-container">
            <h2 className="title text-center mb-4">About The Dayton Leader</h2>
            <LazyVideo videoId="xYYQe30pAMM" title="KCCI News Clip 1" />
            <div className="bios mt-5">
                <h4 className="title mb-4">Meet Our Team</h4>
                <div className="bio-card d-flex mb-4 align-items-center">
                    <img src={justine} alt="Justine Hemmestad" className="profile-pic me-4" />
                    <div className="bio-text">
                        <h4>Justine & Shawn Hemmestad</h4>
                        <p><strong>Justine - Education:</strong> Master’s Degree in English Literature</p>
                        <p><strong>Justine - Writing:</strong> Author of 3 novels and a contributor to 18 anthologies</p>
                        <p><strong>Justine - Role:</strong> Editor</p>
                        <p><strong>Shawn - Role:</strong> Graphic Designer and Photographer</p>
                        <p><strong>Ownership:</strong> Co-owners of the Dayton Leader</p>
                    </div>
                </div>
                <div className="bio-card d-flex mb-4 align-items-center">
                    <img src={courtney} alt="Courtney Sogard" className="profile-pic me-4" />
                    <div className="bio-text">
                        <h4>Courtney Sogard</h4>
                        <p><strong>Education:</strong> Bachelor’s in Secondary Education from Buena Vista University</p>
                        <p><strong>Occupation:</strong> Director at Dayton and Harcourt Public Libraries</p>
                        <p><strong>Role:</strong> Managing Editor of the Dayton Leader</p>
                    </div>
                </div>
            </div>
            <LazyVideo videoId="UcqmlNCptVM" title="KCCI News Clip 2" />
        </div>
    );
};

export default About;
