import React, { useState } from 'react';
import './Contact.css';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
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
        setFormData({ name: '', email: '', message: '' });
    };

    return (
        <div className="contact-container">
            <h2 className="title text-center mb-4">Contact Us</h2>
            <form className="contact-form mx-auto" onSubmit={handleSubmit}>
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
        </div>
    );
};

export default Contact;
