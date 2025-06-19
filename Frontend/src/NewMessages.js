import React, { useState } from 'react';

const NewMessage = () => {
    const [contactName, setContactName] = useState('');
    const [contactsQuery, setContactsQuery] = useState([]);
    const [sendContactId, setSendContactId] = useState(null); // Track which contact is being edited
    const [sendNewMessage, setSendNewMessage] = useState(''); // Track new message input
    const [messages, setMessages] = useState({}); // Store messages by contactId

    const fetchContacts = async () => {
        if (!contactName.trim()) {
            alert("Please enter a contact name");
            return;
        }
        try {
            const response = await fetch(`http://localhost:8081/contact/title?title=${encodeURIComponent(contactName)}`);
            if (!response.ok) {
                const errorMessage = await response.json();
                throw new Error(`Failed to fetch contacts: ${errorMessage.error}`);
            }
            const data = await response.json();
            setContactsQuery(data);
        } catch (err) {
            alert("Error loading contacts: " + err);
        }
    };
    const fetchMessages = async (contactId) => {
        try {
            const response = await fetch(`http://localhost:8081/contact/messages/${contactId}`);
            if (!response.ok) {
                const errorMessage = await response.json();
                throw new Error(`Failed to fetch messages: ${errorMessage.error}`);
            }
            const data = await response.json();
            // Store messages for this contact
            setMessages((prevMessages) => ({ ...prevMessages, [contactId]: data, }));
        } catch (err) {
            alert("Error fetching messages: " + err);
        }
    };
    const handleUpdateSubmit = async (contactId) => {
        if (!sendNewMessage.trim()) {
            alert("Please enter a message.");
            return;
        }
        try {
            const response = await fetch('http://localhost:8081/contact/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', },
                body: JSON.stringify({ contactId, message: sendNewMessage }),
            });
            if (!response.ok) {
                const errorMessage = await response.json();
                throw new Error(errorMessage.error);
            }
            alert("Message sent successfully!");
            setSendNewMessage(''); // Clear message input
            fetchMessages(contactId); // Refresh messages
        } catch (err) {
            alert("Error sending message: " + err);
        }
    };
    return (
        <div className="container">
            <h2 className="text-center mt-4">Add a New Review</h2>
            <div className="input-group mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Enter movie name"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value.toLowerCase())}
                />
                <button className="btn btn-primary" onClick={fetchContacts}>
                    Search
                </button>
            </div>
            <ul className="list-group">
                {contactsQuery.map((contact) => (
                    <li key={contact.id} className="list-group-item">
                        {/* Contact Details */}
                        <div className="d-flex align-items-center">
                            {contact.url && (
                                <img
                                    src={`${contact.url}`}
                                    alt={contact.title}
                                    style={{ width: "50px", height: "50px", marginRight: "15px", objectFit: "cover" }}
                                />
                            )}
                            <div>
                                <strong>{contact.title}</strong> - {contact.year}
                                <span style={{ color: "gold", marginLeft: '7px' }}>
                                    {"★".repeat(contact.stars)}
                                </span>
                            </div>
                            {/* Arrow Button to Show Messages */}
                            <button className="btn btn-sm btn-outline-primary" style={{ margin: "7px" }} onClick={() => fetchMessages(contact.id)}>
                                {/* Arrow Icon */}
                                Reviews
                            </button>
                            {/* Send Message Button */}
                            <button className="btn btn-outline-secondary btn-sm ms-auto" onClick={() => setSendContactId(contact.id)}>
                                New Review
                            </button>
                        </div>
                        {/* Messages List */}
                        {messages[contact.id] && (
                            <ul className="list-group mt-2">
                                {messages[contact.id].map((msg) => (
                                    <li key={msg.id} className="list-group-item">
                                        {msg.message} <small className="text-muted"></small>
                                    </li>
                                ))}
                            </ul>
                        )}
                        {/* Input Form for Adding New Message */}
                        {sendContactId === contact.id && (
                            <div className="mt-3">
                                <textarea
                                    className="form-control mb-2"
                                    value={sendNewMessage}
                                    onChange={(e) => setSendNewMessage(e.target.value)}
                                    placeholder="New Message"
                                />
                                <button className="btn btn-success btn-sm" onClick={() => handleUpdateSubmit(contact.id)} >
                                    Submit
                                </button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div >
    );
};
export default NewMessage;