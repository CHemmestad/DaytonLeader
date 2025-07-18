import React, { useState, useEffect } from 'react';

const Edit = () => {
    const [page, setPage] = useState('Home');
    const [homeSection, setHomeSection] = useState('About');
    const [selectedColumn, setSelectedColumn] = useState(0);
    const [formData, setFormData] = useState({});
    const [success, setSuccess] = useState(false);
    const columns = [
        { title: "Israel at War", content: "", label: "Israel" },
        { title: "Historical Perspectives", content: "", label: "Historical" },
        { title: "Readers Corner", content: "", label: "Readers" },
        { title: "Coffee Break", content: "", label: "Coffee" },
        { title: "Coffee Therapy", content: "", label: "Therapy" },
        { title: "Conservative Corner", content: "", label: "Conservative" },
        { title: "Ryann's Reviews", content: "", label: "Review" },
        { title: "Liberal Librarian", content: "", label: "Librarian" },
        { title: "Local Eats", content: "", label: "Local" },
        { title: "Pastor Kay", content: "", label: "Pastor" },
    ];

    useEffect(() => {
        setFormData({
            columnTitle: '',
            columnContent: '',
        });
        setSuccess(false);
    }, [selectedColumn]);

    useEffect(() => {
        setFormData({});
        setSuccess(false);
    }, [page, homeSection]);


    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
    };

    const handleSubmit = () => {
        if (page === 'Columns') {
            const id = columns[selectedColumn].label;

            // fetch('http://0.0.0.0:8081/columns', {
            fetch("https://daytonleader.onrender.com/columns", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    column: id,
                    title: formData.columnTitle || '',
                    content: formData.columnContent || '',
                    date: new Date().toISOString(),
                }),
            })
                .then(res => res.ok ? setSuccess(true) : alert('Failed to save'))
                .catch(err => {
                    console.error('Error saving column:', err);
                    alert('An error occurred while saving.');
                });
        }

        if (page === 'Home' && homeSection === 'About') {
            // fetch('http://0.0.0.0:8081/about', {
            fetch("https://daytonleader.onrender.com/about", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: formData.about || '',
                }),
            })
                .then(res => res.ok ? setSuccess(true) : alert('Failed to save About section'))
                .catch(err => {
                    console.error('Error saving about section:', err);
                    alert('An error occurred while saving about section.');
                });
        }

        if (page === 'Home' && homeSection === 'Article') {
            const articleForm = new FormData();
            articleForm.append('title', formData.title || '');
            articleForm.append('author', formData.author || '');
            articleForm.append('content', formData.content || '');
            articleForm.append('date', new Date().toISOString());
            if (formData.image) {
                articleForm.append('image', formData.image);
            }

            // fetch('http://0.0.0.0:8081/article', {
            fetch("https://daytonleader.onrender.com/article", {
                method: 'POST',
                body: articleForm,
            })
                .then(res => res.ok ? setSuccess(true) : alert('Failed to save article'))
                .catch(err => {
                    console.error('Error saving article:', err);
                    alert('An error occurred while saving article.');
                });
        }
    };

    return (
        <div className="container">
            <h2 className="title mb-4">Admin Edit Page</h2>

            {/* Page Selector */}
            <div className="mb-3">
                <label className="form-label">Select Page:</label>
                <select className="form-select" value={page} onChange={(e) => setPage(e.target.value)}>
                    <option value="Home">Home</option>
                    <option value="Columns">Columns</option>
                    <option value="Paper">Paper</option>
                </select>
            </div>

            {/* Section Selector */}
            {page === 'Home' && (
                <div className="mb-3">
                    <label className="form-label">Edit Section:</label>
                    <select className="form-select" value={homeSection} onChange={(e) => setHomeSection(e.target.value)}>
                        <option value="About">About Section</option>
                        <option value="Article">Add Article</option>
                    </select>
                </div>
            )}

            {page === 'Columns' && (
                <div className="mb-3">
                    <label className="form-label">Select Column:</label>
                    <select className="form-select" value={selectedColumn} onChange={(e) => setSelectedColumn(Number(e.target.value))}>
                        {columns.map((col, i) => (
                            <option key={i} value={i}>{col.title}</option>
                        ))}
                    </select>
                </div>
            )}

            {/* Editable Fields */}
            <div className="mb-3">
                {page === 'Home' && homeSection === 'About' && (
                    <textarea
                        className="form-control"
                        name="about"
                        placeholder="Edit About Text"
                        rows={5}
                        onChange={handleInputChange}
                    />
                )}

                {page === 'Home' && homeSection === 'Article' && (
                    <>
                        <input className="form-control mb-2" name="title" placeholder="Article Title" onChange={handleInputChange} />
                        <input className="form-control mb-2" name="author" placeholder="Author" onChange={handleInputChange} />
                        <textarea className="form-control mb-2" name="content" placeholder="Article Content" rows={4} onChange={handleInputChange} />
                        <input className="form-control" type="file" name="image" onChange={handleInputChange} />
                    </>
                )}

                {page === 'Columns' && (
                    <>
                        <input
                            className="form-control mb-2"
                            name="columnTitle"
                            placeholder="Column Title"
                            value={formData.columnTitle || ''}
                            onChange={handleInputChange}
                        />

                        <textarea
                            className="form-control"
                            name="columnContent"
                            placeholder="Column Content"
                            rows={5}
                            value={formData.columnContent || ''}
                            onChange={handleInputChange}
                        />
                    </>
                )}

                {page === 'Paper' && (
                    <input className="form-control" type="file" name="paperImage" onChange={handleInputChange} />
                )}
            </div>

            <button className="btn" onClick={handleSubmit}>Save Changes</button>

            {success && <div className="alert alert-success mt-3">Changes saved successfully!</div>}
        </div>
    );
};

export default Edit;
