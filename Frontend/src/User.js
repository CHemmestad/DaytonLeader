import React, { useEffect, useState } from 'react';
import "./User.css";

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [overrideDelete, setOverrideDelete] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [expirationDate, setExpirationDate] = useState(() => {
        const today = new Date().toISOString().split("T")[0];
        return today;
    });
    const [newUser, setNewUser] = useState({
        email: '',
        username: '',
        password: '',
        role: 'user',
    });

    const fetchUsers = async () => {
        try {
            setLoading(true);
            // const res = await fetch("http://localhost:8081/users");
            const res = await fetch("https://daytonleader.onrender.com/contact/users");
            const data = await res.json();
            const roleOrder = { admin: 0, user: 1, expired: 2 };
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

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (userId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this user? This action cannot be undone.");
        if (!confirmDelete) return;

        try {
            // const res = await fetch(`http://localhost:8081/users/${userId}`, {
            const res = await fetch(`https://daytonleader.onrender.com//users/${userId}`, {
                method: 'DELETE',
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
            // const res = await fetch("http://localhost:8081/users", {
            const res = await fetch("https://daytonleader.onrender.com/contact/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
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
                            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                        />
                    </div>
                    <div className="col-md-3">
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Password"
                            required
                            value={newUser.password}
                            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        />
                    </div>
                    <div className="col-md-2">
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Email"
                            required
                            value={newUser.email}
                            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
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
        </div >
    );
};

export default UsersPage;

const formatDate = (dateStr) => {
    const [year, month, day] = dateStr.split("-");
    return new Date(year, month - 1, day).toLocaleDateString('en-US');
};


