import React, { useEffect, useState } from 'react';
import "./User.css";

const UsersPage = ({ setUsername, setUserRole }) => {
    const [users, setUsers] = useState([]);
    const [generatedLink, setGeneratedLink] = useState('');
    const [overrideDelete, setOverrideDelete] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [expirationDate, setExpirationDate] = useState(() => {
        const today = new Date();
        today.setFullYear(today.getFullYear() + 1);

        // Format as YYYY-MM-DD in local time
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const day = String(today.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    });

    const [newUser, setNewUser] = useState({
        email: '',
        username: '',
        password: '',
        role: 'user',
    });

    useEffect(() => {
        const token = localStorage.getItem("authToken");

        if (token) {
            // fetch("http://localhost:8081/protected", {
            fetch("https://daytonleader.onrender.com/protected", {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then(res => {
                    if (!res.ok) throw new Error("Invalid token");
                    return res.json();
                })
                .then(data => {
                    console.log(data.message);
                    setUserRole(data.role);
                    setUsername(data.name);
                })
                .catch(() => {
                    localStorage.removeItem("authToken");
                    localStorage.removeItem("name");
                    localStorage.removeItem("role");
                    setUserRole(null);
                    setUsername("");
                });
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("authToken");
            setLoading(true);
            // const res = await fetch("http://localhost:8081/users", {
                const res = await fetch("https://daytonleader.onrender.com/users", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            const roleOrder = { admin: 0, editor: 1, user: 2, expired: 3 };
            const sorted = Array.isArray(data)
                ? data.sort((a, b) => {
                    const roleA = roleOrder[a.role] ?? 99;
                    const roleB = roleOrder[b.role] ?? 99;

                    if (roleA !== roleB) {
                        return roleA - roleB;
                    }

                    return a.username.localeCompare(b.username);
                })
                : [];

            setUsers(sorted);
        } catch (err) {
            console.error("Failed to load users", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (userId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this user? This action cannot be undone.");
        if (!confirmDelete) return;

        try {
            const token = localStorage.getItem("authToken");
            // const res = await fetch(`http://localhost:8081/users/${userId}`, {
                const res = await fetch(`https://daytonleader.onrender.com/users/${userId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) {
                const errorData = await res.json();
                setErrorMessage(`${errorData.error || 'Failed to delete user'}`);
                setTimeout(() => setErrorMessage(''), 3000);
                return;
            }

            setSuccessMessage("User deleted successfully");
            fetchUsers();
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            console.error("Delete error:", err);
            setErrorMessage("Failed to delete user");
            setTimeout(() => setErrorMessage(''), 3000);
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();

        const today = new Date().toISOString().split("T")[0];

        const userPayload = {
            ...newUser,
            expirationDate: expirationDate,
            lastLogin: today,
            settings: {
                newIssue: true,
                newArticle: true,
                columnUpdate: true,
                events: true,
                breakingNews: true,
                announcements: true,
            }
        };

        try {
            const token = localStorage.getItem("authToken");
            // const res = await fetch("http://localhost:8081/users", {
                const res = await fetch("https://daytonleader.onrender.com/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(userPayload),
            });

            if (!res.ok) {
                const errorData = await res.json();
                setErrorMessage(`${errorData.error || 'Unknown error'}`);
                setTimeout(() => setErrorMessage(''), 3000);
                return;
            }

            setSuccessMessage("User added successfully");
            setNewUser({ email: '', username: '', password: '', role: 'user' });
            fetchUsers();
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            console.error("Failed to add user", err);
            setErrorMessage("Failed to add user");
            setTimeout(() => setErrorMessage(''), 3000);
        }
    };

    const handleGenerateLink = async () => {
        try {
            const token = localStorage.getItem("authToken");
            // const res = await fetch('http://localhost:8081/generate-token', {
            const res = await fetch("https://daytonleader.onrender.com/generate-token", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    email: newUser.email,
                    role: newUser.role,
                    expirationDate,
                }),
            });

            const data = await res.json();
            if (data.token) {
                setGeneratedLink(`${window.location.origin}/DaytonLeader/#/create-account/${data.token}`);
            } else {
                throw new Error(data.message || 'Token generation failed');
            }
        } catch (err) {
            setGeneratedLink('');
            setErrorMessage(err.message);
            setTimeout(() => setErrorMessage(''), 3000);
        }
    };

    const isExpired = (dateStr) => {
        const today = new Date().toISOString().split("T")[0];
        return dateStr < today;
    };

    return (
        <div className="container">
            <h2 className="title mb-4">User Management</h2>
            <div className="text-center mb-4">
                <label className="form-label mb-1 d-block" htmlFor="overrideSwitch">
                    Override Delete Restrictions
                </label>
                <div className="form-check form-switch d-inline-block">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        id="overrideSwitch"
                        checked={overrideDelete}
                        onChange={() => {
                            if (!overrideDelete) {
                                const confirmEnable = window.confirm("Enabling override will allow deletion of active users. Are you sure?");
                                if (confirmEnable) {
                                    setOverrideDelete(true);
                                }
                            } else {
                                setOverrideDelete(false);
                            }
                        }}
                    />
                </div>
            </div>
            <div className="scroll" style={{ maxHeight: '50vh', overflowY: 'scroll' }}>
                <table className="scroll table table-bordered table-hover text-center align-middle">
                    <thead className="table-dark">
                        <tr>
                            <th>Username</th>
                            <th>Role</th>
                            <th>Email</th>
                            <th>Last Login</th>
                            <th>Expiration</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="6">
                                    <div className="placeholder-glow">
                                        <div
                                            className="placeholder col-12"
                                            style={{ height: '20vh', borderRadius: '8px' }}
                                        ></div>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            users.map(user => (
                                <tr key={user.id}>
                                    <td>{user.username}</td>
                                    <td>{user.role}</td>
                                    <td>{user.email}</td>
                                    <td>{formatDate(user.lastLogin)}</td>
                                    <td>
                                        {formatDate(user.expirationDate)} {isExpired(user.expirationDate) && "(expired)"}
                                    </td>
                                    <td>
                                        {isExpired(user.expirationDate) || overrideDelete ? (
                                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(user.id)}>
                                                Delete
                                            </button>
                                        ) : (
                                            <span className="text-muted">Active</span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <hr />

            <h4 className="mt-4">Add New User</h4>
            <form onSubmit={handleAddUser} className="card p-3 mb-2">
                <div className="row g-3">
                    <div className="col-md-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Username"
                            required
                            value={newUser.username}
                            onChange={(e) => setNewUser({ ...newUser, username: e.target.value.trimStart() })}
                            onKeyDown={(e) => {if (e.key === ' ') e.preventDefault();}}
                        />
                    </div>
                    <div className="col-md-3">
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Password"
                            required
                            value={newUser.password}
                            onChange={(e) => setNewUser({ ...newUser, password: e.target.value.trimStart() })}
                            onKeyDown={(e) => {if (e.key === ' ') e.preventDefault();}}
                        />
                    </div>
                    <div className="col-md-2">
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Email"
                            required
                            value={newUser.email}
                            onChange={(e) => setNewUser({ ...newUser, email: e.target.value.trimStart() })}
                            onKeyDown={(e) => {if (e.key === ' ') e.preventDefault();}}
                        />
                    </div>
                    <div className="col-md-2">
                        <input
                            type="date"
                            className="form-control"
                            value={expirationDate}
                            onChange={(e) => setExpirationDate(e.target.value)}
                        />
                    </div>
                    <div className="col-md-1">
                        <select
                            className="form-select"
                            value={newUser.role}
                            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                            <option value="editor">Editor</option>
                        </select>
                    </div>
                    <div className="col-md-1 d-grid">
                        <button type="submit" className="btn">Add</button>
                    </div>
                </div>
            </form>
            {
                successMessage && (
                    <div className="alert alert-success" role="alert">
                        {successMessage}
                    </div>
                )
            }
            {
                errorMessage && (
                    <div className="alert alert-danger" role="alert">
                        {errorMessage}
                    </div>
                )
            }
            <h4 className="mt-4">Create One-Time Setup Link (1 day)</h4>
            <form onSubmit={(e) => { e.preventDefault(); handleGenerateLink(); }} className="card p-3 mb-2">
                <div className="row g-3">
                    <div className="col-md-4">
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Email"
                            required
                            value={newUser.email}
                            onChange={(e) => setNewUser({ ...newUser, email: e.target.value.trimStart() })}
                            onKeyDown={(e) => {if (e.key === ' ') e.preventDefault();}}
                        />
                    </div>
                    <div className="col-md-4">
                        <input
                            type="date"
                            className="form-control"
                            value={expirationDate}
                            onChange={(e) => setExpirationDate(e.target.value)}
                        />
                    </div>
                    <div className="col-md-2">
                        <select
                            className="form-select"
                            value={newUser.role}
                            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                            <option value="editor">Editor</option>
                        </select>
                    </div>
                    <div className="col-md-2 d-grid">
                        <button className="btn" type="submit">
                            Create Link
                        </button>
                    </div>
                </div>
            </form>
            {generatedLink && (
                <div
                    className="mt-2 p-3 rounded border d-flex align-items-center justify-content-between"
                    style={{ backgroundColor: '#f3f0f2', color: '#2e2e2e' }}
                >
                    <div style={{ wordBreak: 'break-all' }}>
                        <strong>One-Time Link:</strong><br />
                        <code>{generatedLink}</code>
                    </div>
                    <button
                        className="btn btn-sm ms-3"
                        onClick={() => navigator.clipboard.writeText(generatedLink)}
                    >
                        Copy
                    </button>
                </div>
            )}
        </div >
    );
};

export default UsersPage;

const formatDate = (dateStr) => {
    const [year, month, day] = dateStr.split("-");
    return new Date(year, month - 1, day).toLocaleDateString('en-US');
};


