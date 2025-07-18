import React, { useState } from 'react';

const Settings = ({ userRole }) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        notifications: {
            newIssue: true,
            newArticle: true,
            columnUpdates: true,
            events: true,
            breakingNews: true,
            announcements: true,
        },
        // darkMode: false,
    });

    const [successMessage, setSuccessMessage] = useState('');
    const subscriptionEndDate = "12/31/2025"; // Example value — replace with actual

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name.startsWith("notifications.")) {
            const key = name.split(".")[1];
            setFormData(prev => ({
                ...prev,
                notifications: { ...prev.notifications, [key]: checked }
            }));
        } else if (type === "checkbox") {
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Updated settings:", formData);

        setSuccessMessage("Settings saved successfully");

        // Reset form fields after saving
        setFormData({
            username: '',
            email: '',
            password: '',
            notifications: {
                newIssue: true,
                newArticle: true,
                columnUpdates: true,
                events: true,
                breakingNews: true,
                announcements: true,
            },
            // darkMode: false,
        });

        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(''), 3000);

        // Optionally send to backend here
    };

    const handleDeleteAccount = () => {
        if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
            console.log("Account deleted");
            // Send delete request here
        }
    };

    return (
        <div className="container">
            <h2 className="title mb-4">Account Settings</h2>
            <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
                <p>
                    <strong>Subscription ends:</strong> {subscriptionEndDate}
                    {userRole === "expired" && (
                        <button
                            type="button"
                            className="btn btn-sm ms-3"
                            onClick={() => alert("Redirect to payment or renewal logic")}
                        >
                            Renew
                        </button>
                    )}
                </p>
                <div className="mb-3">
                    <label className="form-label">Change Username</label>
                    <input type="text" className="form-control" name="username" value={formData.username} onChange={handleChange} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Change Email</label>
                    <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Change Password</label>
                    <input type="password" className="form-control" name="password" value={formData.password} onChange={handleChange} />
                </div>

                <hr />

                <h5>Email Notifications</h5>
                <div className="d-flex flex-wrap justify-content-between mb-3">
                    {Object.entries(formData.notifications).map(([key, val]) => (
                        <div className="form-check me-4" key={key}>
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id={key}
                                name={`notifications.${key}`}
                                checked={val}
                                onChange={handleChange}
                            />
                            <label className="form-check-label" htmlFor={key}>
                                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </label>
                        </div>
                    ))}
                </div>
                {successMessage && (
                    <div className="alert alert-success" role="alert">
                        {successMessage}
                    </div>
                )}

                {/* <hr /> */}

                {/* <h5>Other Preferences</h5>
                <div className="mb-4 text-center">
                    <label htmlFor="darkMode" className="form-label d-block">
                        Enable Dark Mode
                    </label>
                    <div className="form-check form-switch d-inline-block">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            name="darkMode"
                            checked={formData.darkMode}
                            onChange={handleChange}
                            id="darkMode"
                        />
                    </div>
                </div> */}

                <div className="d-flex justify-content-between mt-4">
                    <button type="submit" className="btn">Save Changes</button>
                    <button type="button" className="btn btn-danger" onClick={handleDeleteAccount}>Delete Account</button>
                </div>
            </form>
        </div>
    );
};

export default Settings;
