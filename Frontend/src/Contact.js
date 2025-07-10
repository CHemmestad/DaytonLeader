import React, { useState } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Contact.css';
import justine from './Images/HeadShots/Justine1.png';
import courtney from './Images/HeadShots/Courtney1nb.png';
import shawn from './Images/HeadShots/Shawn1.png';

const Contact = () => {
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        subject: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Message submitted!');
        // You can add logic to send this data to a backend if needed
        setFormData({ email: '', name: '', subject:'', message: '' });
    };

    return (
        <div className="contact-container">
            <h2 className="title text-center mb-4">Contact Us</h2>
            <div className="bio-card d-flex mb-4 mt-4 align-items-center">
                <img src={justine} alt="Justine Hemmestad" className="profile-pic me-4" style={{ backgroundColor: '#570335' }}/>
                <div className="bio-text">
                    <h4>Justine Hemmestad - Articles</h4>
                    <p><strong>Email:</strong> jhdaytonleader@gmail.com</p>
                    <p><strong>Number:</strong> (515) 351-2129</p>
                </div>
                <button
                    className="btn exciting-button"
                    onClick={() => window.location.href = 'mailto:jhdaytonleader@gmail.com'}
                    style={{ height: '75px', width: '200px' }}
                >
                    <i className="bi bi-envelope-fill me-2"></i> Email Justine
                </button>
            </div>
            <div className="bio-card d-flex mb-4 mt-4 align-items-center">
                <img src={courtney} alt="Courtney Sogard" className="profile-pic me-4" style={{ backgroundColor: '#570335' }} />
                <div className="bio-text">
                    <h4>Courtney Sogard - Current Events</h4>
                    <p><strong>Email:</strong> csdaytonleader@gmail.com</p>
                </div>
                <button
                    className="btn exciting-button"
                    onClick={() => window.location.href = 'mailto:csdaytonleader@gmail.com'}
                    style={{ height: '75px', width: '200px' }}
                >
                    <i className="bi bi-envelope-fill me-2"></i> Email Courtney
                </button>
            </div>
            <div className="bio-card d-flex mb-4 mt-4 align-items-center">
                <img src={shawn} alt="Shawn Hemmestad" className="profile-pic me-4" style={{ backgroundColor: '#570335' }}/>
                <div className="bio-text">
                    <h4>Shawn Hemmestad - ADs/Billing/Subscriptions</h4>
                    <p><strong>Email:</strong> shdaytonleader@gmail.com</p>
                    <p><strong>Number:</strong> (515) 351-4886</p>
                </div>
                <button
                    className="btn exciting-button"
                    onClick={() => window.location.href = 'mailto:shdaytonleader@gmail.com'}
                    style={{ height: '75px', width: '200px' }}
                >
                    <i className="bi bi-envelope-fill me-2"></i> Email Shawn
                </button>
            </div>
            <form className="contact-form mx-auto mb-4" onSubmit={handleSubmit}>
                <h4>News Submissions</h4>
                <div className="form-group mb-3">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="name">Subject:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="message">Message:</label>
                    <textarea
                        className="form-control"
                        id="message"
                        name="message"
                        rows="5"
                        value={formData.message}
                        onChange={handleChange}
                        required
                    ></textarea>
                </div>
                <button type="submit" className="btn contact-btn">
                    Submit
                </button>
            </form>
            <div className="bio-card d-flex mb-4 mt-4"
                style={{
                    maxWidth: '600px',      // fixed max width
                    width: '100%',          // full width up to max
                    margin: '0 auto',       // centers it horizontally
                    justifyContent: 'center', // centers content inside
                }}>
                <div className="bio-text">
                    <h4>Mailing Address and General Contact</h4>
                    <p><strong>Mailing Address</strong><br />Dayton Leader<br />P.O. Box 141<br />Dayton, IA 50530</p>
                    <p><strong>Email</strong><br />Dayton Leader@gmail.com</p>
                    <p><strong>Phone</strong><br />(515) 351-4886</p>
                    <p><strong>Text</strong><br />(515) 351-4886</p>
                </div>
            </div>
            <div className="map-container" style={{ width: '100%', height: '450px' }}>
                <iframe
                    title="Dayton Public Library Location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3026.926014184268!2d-94.07297558435852!3d42.26171317919309!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87ed934ab5acfc01%3A0x84146ad87dcf859d!2sDayton%20Public%20Library!5e0!3m2!1sen!2sus!4v1720561250000!5m2!1sen!2sus"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
            </div>
        </div>
    );
};

export default Contact;
