import React, { useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
const SearchContact = ({ contacts, setContacts }) => {
    const [contactName, setContactName] = useState("");
    const [contactsQuery, setContactsQuery] = useState([]);

    const fetchContacts = async () => {
        if (!contactName.trim()) {
            alert("Please enter a contact name");
            return;
        }
        try {
            const response = await fetch(`http://localhost:8081/contact/title?title=${encodeURIComponent(contactName)}`);
            if (!response.ok) {
                throw new Error("Failed to fetch contacts");
            }
            const data = await response.json();
            setContactsQuery(data);
        } catch (err) {
            alert("There was an Error loading one contact " + err);
        }
    };
    return (
        <div
    className="d-flex flex-wrap justify-content-center"
>   <h2 className="text-center mt-4">Search Movie</h2>
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
            {contactsQuery.map((contact) => (
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

    // return (
    //     <div className="container">
    //         <h2 className="text-center mt-4">Search Contact</h2>
    //         <div className="input-group mb-3">
    //             <input
    //                 type="text"
    //                 className="form-control"
    //                 placeholder="Enter contact name"
    //                 value={contactName}
    //                 onChange={(e) => setContactName(e.target.value.toLowerCase())}
    //             />
    //             <button className="btn btn-primary" onClick={fetchContacts}>
    //                 Search
    //             </button>
    //         </div>
    //         {/* List the result */}
    //         <ul className="list-group">
    //             {contactsQuery.map((contact) => (
    //                 <li key={contact.id} className="list-group-item d-flex justify-content-between align-items-center">
    //                     <div className="d-flex align-items-center">
    //                         {contact.image_url && (
    //                             <img
    //                                 src={`http://localhost:8081${contact.image_url}`}
    //                                 alt={contact.contact_name}
    //                                 style={{ width: "50px", height: "50px", marginRight: "15px", objectFit: "cover" }}
    //                             />
    //                         )}
    //                         <div>
    //                             <strong>{contact.contact_name}</strong> - {contact.phone_number}
    //                             <p>{contact.message}</p>
    //                         </div>
    //                     </div>
    //                 </li>
    //             ))}
    //         </ul>
    //     </div>
    // );
};
export default SearchContact;