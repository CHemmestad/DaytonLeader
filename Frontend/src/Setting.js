import React, { useEffect, useState } from 'react';

const Settings = ({ userRole, setUserRole, username, setUsername }) => {
    const [password, setPassword] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [subscriptionEndDate, setSubscriptionEndDate] = useState('');
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        newPassword: '',
        notifications: {
            newIssue: false,
            newArticle: false,
            columnUpdates: false,
            events: false,
            breakingNews: false,
            announcements: false,
        },
    });

    const handleDeleteAccount = async (e) => {
        e.preventDefault();
        if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
            console.log("Account deleted");
        } else {
            return;
        }
        const token = localStorage.getItem("authToken");

        try {
            const res = await fetch(`https://daytonleader.onrender.com/user/${username}`, {
            // const res = await fetch(`http://localhost:8081/user/${username}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ password: password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setErrorMessage(data.error || "Failed to delete account");
                setTimeout(() => setErrorMessage(""), 3000);
                return;
            }

            // Clear session
            localStorage.removeItem("authToken");
            localStorage.removeItem("name");
            localStorage.removeItem("role");

            setSuccessMessage("Account deleted successfully");
            setTimeout(() => {
                setSuccessMessage('');
                setUserRole(null);
                setUsername("");
            }, 3000);

        } catch (err) {
            console.error("Account deletion error:", err);
            setErrorMessage("Something went wrong");
            setTimeout(() => setErrorMessage(""), 3000);
        }
    };

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem("authToken");
            const userId = username;

            if (!token || !userId) return;

            try {
                const res = await fetch(`https://daytonleader.onrender.com/user/${userId}`, {
                // const res = await fetch(`http://localhost:8081/user/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) throw new Error("Failed to fetch user data");

                const data = await res.json();

                setFormData({
                    username: userId,
                    email: data.email,
                    newPassword: '',
                    notifications: data.settings || {},
                });

                setSubscriptionEndDate(data.expirationDate ? formatDateToMMDDYYYY(data.expirationDate) : '');
            } catch (err) {
                console.error("Error loading user data:", err);
            }
        };

        fetchUserData();
    }, []);

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("authToken");

        try {
            const res = await fetch(`https://daytonleader.onrender.com/user/${username}`, {
            // const res = await fetch(`http://localhost:8081/user/${username}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ...formData,
                    password // current password needed to authorize
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setErrorMessage(data.error || "Failed to save settings");
                setTimeout(() => setErrorMessage(""), 3000);
                return;
            }

            setSuccessMessage("Settings updated successfully");
            setTimeout(() => setSuccessMessage(""), 3000);

        } catch (err) {
            console.error("Settings update error:", err);
            setErrorMessage("Something went wrong");
            setTimeout(() => setErrorMessage(""), 3000);
        } finally {
            setFormData(prev => ({ ...prev, newPassword: '' }));
            setPassword('');
        }
    };

    return (
        <div className="container">
            <h2 className="title mb-4">Account Settings</h2>
            <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
                <p>
                    <div className="title justify-text-center"><strong>Hello {formData.username}</strong></div>
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
                {/* <div className="mb-3">
                    <label className="form-label">Change Username</label>
                    <input type="text" className="form-control" name="username" value={formData.username} onChange={handleChange} />
                </div> */}
                <div className="mb-3">
                    <label className="form-label">Change Email</label>
                    <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Change Password</label>
                    <input type="password" className="form-control" name="newPassword" value={formData.newPassword} onChange={handleChange} />
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
                <div className="mb-3">
                    <label className="form-label">Current Password</label>
                    <input type="password" className="form-control" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                {successMessage && (
                    <div className="alert alert-success" role="alert">
                        {successMessage}
                    </div>
                )}
                {errorMessage && (
                    <div className="alert alert-danger" role="alert">
                        {errorMessage}
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

function formatDateToMMDDYYYY(dateStr) {
    if (!dateStr || typeof dateStr !== 'string') return '';
    const [year, month, day] = dateStr.split('-');
    return `${month}/${day}/${year}`;
}
