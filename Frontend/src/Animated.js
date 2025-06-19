import React, { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";

const Contacts = ({ contacts, setContacts }) => {
    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const response = await fetch("http://localhost:8081/contact/animated");
                if (!response.ok) {
                    throw new Error("Failed to fetch contacts");
                }
                const data = await response.json();
                setContacts(data);
            } catch (error) {
                alert("There was an Error loading contacts " + error);
            }
        };
        fetchContacts();
    }, []);
    return (
        <div
    className="d-flex flex-wrap justify-content-center"
>
            {contacts.map((contact) => (
                <div className="card shadow-sm themed-movie-card m-2" style={{ width: '18rem' }}>
                    <img
                        src={`${contact.url}`}
                        className="card-img-top"
                        style={{ height: '300px', objectFit: 'cover', borderRadius: '5%' }}
                        alt={contact.title}
                    />
                    <div className="card-body">
                        <p className="card-text">
                        <strong>{contact.title}</strong><br></br>{contact.year} - {contact.duration} - {contact.category}<br></br>
                            <span style={{ color: "gold", marginLeft: '7px' }}>
                                {"★".repeat(contact.stars)}
                            </span>
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
export default Contacts;