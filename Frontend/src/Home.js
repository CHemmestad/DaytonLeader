import React, { useEffect, useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import banner from "./Images/daytonSign.jpg";
import image from "./Images/logo.jpg";

const Home = ({ username }) => {
    const [weather, setWeather] = useState(null);
    const [aboutText, setAboutText] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [articles, setArticles] = useState([]);
    const [loadingArticles, setLoadingArticles] = useState(true);
    const [newComment, setNewComment] = useState('');
    const [commentName, setCommentName] = useState('');
    const [comments, setComments] = useState([
        // { user: "Jane Doe", text: "Great article! Very informative.", timestamp: new Date().toLocaleString() },
        // { user: "John Smith something something", text: "I learned a lot, thanks for posting this.", timestamp: new Date().toLocaleString() },
        // { user: "Emily", text: "Could you elaborate more on the last section?", timestamp: new Date().toLocaleString() },
        // { user: "Tom", text: "I disagree with a few points, but overall good read.", timestamp: new Date().toLocaleString() },
        // { user: "Alice", text: "Nice writing style. Looking forward to more.", timestamp: new Date().toLocaleString() },
        // { user: "Michael", text: "This was very helpful for my research!", timestamp: new Date().toLocaleString() },
        // { user: "Luna", text: "Loved it. Keep it coming!", timestamp: new Date().toLocaleString() },
        // { user: "David", text: "Not sure I follow the argument about the community impact.", timestamp: new Date().toLocaleString() },
        // { user: "Maria", text: "Please add more sources next time.", timestamp: new Date().toLocaleString() },
        // { user: "Jordan", text: "🔥🔥🔥", timestamp: new Date().toLocaleString() },
    ]);




    const moreArticles = [
        {
            title: "Jaguar Article",
            image: "/images/community.jpg",
            content: "Here’s what’s happening around town this week plus some more informations so ican see where text starts wrapping and how good it looks with everything this some more and some more and some more and more filler",
            author: "Staff Writer",
            date: "2025-07-20T10:30:00",
        },
        {
            title: "Library Article",
            image: "/images/events.jpg",
            content: "Check out our roundup of local weekend events.",
            author: "Local Librarian",
            date: "2025-07-19T09:00:00",
        },
    ];

    // const handleAddComment = () => {
    //     if (newComment.trim() === '' || commentName.trim() === '') return;

    //     const newEntry = {
    //         user: commentName,
    //         text: newComment,
    //         timestamp: new Date().toLocaleString(),
    //     };

    //     setComments([...comments, newEntry]);
    //     setNewComment('');
    //     setCommentName('');
    // };

    const defaultArticle = {
        title: "Default",
        image: banner, // or a default image like '/default.jpg'
        content: "Default",
        author: "Dayton Leader",
        date: "2025-01-01T08:00:00",
    };

    const errorArticle = {
        title: "Something went wrong while loading",
        image: image, // or a default image like '/default.jpg'
        content: "Error",
        author: "Dayton Leader",
        date: "2025-01-01T08:00:00",
    };

    const handleClose = () => {
        setShowModal(false);
        setSelectedArticle(null);
    };

    const handleOpen = (article) => {
        setSelectedArticle(article);
        setShowModal(true);
    };

    const handleAddComment = async () => {
        if (newComment.trim() === '' || commentName.trim() === '') return;

        const timestamp = new Date().toLocaleString();

        const newEntry = {
            user: commentName,
            text: newComment,
            timestamp
        };

        try {
            // const res = await fetch("http://0.0.0.0:8081/comments", {
            const res = await fetch("https://daytonleader.onrender.com/comments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newEntry),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Failed to save comment");
            }

            setComments([...comments, newEntry]);
            setNewComment('');
            setCommentName('');
        } catch (err) {
            console.error("Comment post error:", err);
        }
    };

    useEffect(() => {
        setCommentName(username || '');
    }, [username]);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                // const res = await fetch("http://localhost:8081/comments");
                const res = await fetch("https://daytonleader.onrender.com/comments");
                const data = await res.json();

                const sorted = data.sort((a, b) => {
                    return new Date(a.timestamp) - new Date(b.timestamp);
                });

                setComments(data);
            } catch (err) {
                console.error("Failed to load comments", err);
            }
        };

        fetchComments();
    }, []);

    // Lock body scroll when modal is open
    useEffect(() => {
        if (showModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        // Cleanup on unmount
        return () => {
            document.body.style.overflow = '';
        };
    }, [showModal]);

    useEffect(() => {
        fetch("https://daytonleader.onrender.com/about")
            // fetch('http://0.0.0.0:8081/about')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to load About section');
                }
                return response.json();
            })
            .then((data) => {
                setAboutText(data.text || '');
            })
            .catch((err) => {
                console.error('Error loading About section:', err);
                setAboutText("We couldn't load the About section at this time.");
            });
    }, []);

    // useEffect(() => {
    //     // fetch('https://daytonleader.onrender.com/articles')
    //     fetch('http://0.0.0.0:8081/article')
    //         .then(res => {
    //             if (!res.ok) {
    //                 throw new Error('Failed to load articles section');
    //             }
    //             return res.json();
    //         })
    //         .then(data => {
    //             setArticles(data);
    //         })
    //         .catch(err => {
    //             console.error('Failed to fetch articles:', err);
    //             setArticles.content("We couldn't load the article section at this time.");
    //         });
    // }, []);

    useEffect(() => {
        setLoadingArticles(true);

        fetch("https://daytonleader.onrender.com/article")
            // fetch('http://0.0.0.0:8081/article')
            .then(res => {
                if (!res.ok) {
                    throw new Error('Failed to load articles section');
                }
                return res.json();
            })
            .then(data => {
                const filledArticles = [...data];

                while (filledArticles.length < 3) {
                    filledArticles.push(defaultArticle);
                }
                setArticles(filledArticles);
            })
            .catch(err => {
                console.error('Failed to fetch articles:', err);
                setArticles([errorArticle, errorArticle, errorArticle]);
            })
            .finally(() => {
                setLoadingArticles(false);
            });
    }, []);

    useEffect(() => {
        Promise.all(
            articles.map((articles) =>
                fetch(articles.textFile)
                    .then((res) => res.text())
                    .then((text) => ({ ...articles, text }))
            )
        ).then((updatedArticles) => {
            setArticles(updatedArticles);
        });
    }, []);

    useEffect(() => {
        const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
        const location = 'Dayton,IA';

        fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=us&key=${apiKey}&include=days,current`)
            .then(res => res.json())
            .then(data => {
                const current = data.currentConditions;
                const forecast = data.days.slice(1, 8); // skip today, show next 7 days

                setWeather({
                    current: {
                        temp: Math.round(current.temp),
                        feelslike: Math.round(current.feelslike),
                        humidity: current.humidity,
                        windspeed: current.windspeed,
                        condition: current.conditions,
                        icon: current.icon,
                        description: current.description,
                        precipitation: current.precip
                    },
                    forecast: forecast.map(day => ({
                        date: day.datetime,
                        icon: day.icon,
                        high: Math.round(day.tempmax),
                        low: Math.round(day.tempmin),
                        condition: day.conditions,
                    })),
                });
            })
            .catch(err => console.error("Weather fetch error:", err));
    }, []);

    return (
        <div>
            <div
                className="home-banner"
                style={{
                    width: '100%',
                    // transform: 'translateY(10px)',
                    aspectRatio: '45 / 9',
                    maxHeight: '25vh',
                    backgroundImage: `url(${banner})`,
                    backgroundSize: 'cover',
                    // backgroundPosition: 'center',
                    backgroundPosition: 'center 42%',
                }}
            ></div>
            {weather && (
                <div className="weather-bar row g-0 p-1">
                    {/* Left: Current Weather */}
                    <div className="col-md-5 h-100">
                        <div className="card d-flex flex-row align-items-center m-1 p-1">
                            {/* Big Icon on the left */}
                            <div className="display-4 me-4" style={{ fontSize: '3rem' }}>
                                {getIcon(weather.current.icon)}
                            </div>
                            {/* Weather Info on the right */}
                            <div className="text-start">
                                <h6 className="mb-1">Currently in Dayton, IA</h6>
                                <p className="mb-0">
                                    Temp: {weather.current.temp}°F (Feels like {weather.current.feelslike}°F)
                                </p>
                                <p className="mb-0">
                                    Humidity: {weather.current.humidity}% | Wind: {weather.current.windspeed} mph
                                </p>
                                <p className="mb-0">
                                    Condition: {weather.current.condition} | Precipitation: {weather.current.precipitation}%
                                </p>
                            </div>
                        </div>
                    </div>
                    {/* Right: 6-Day Forecast */}
                    <div className="col row g-0">
                        {weather.forecast.map((day, index) => (
                            <div key={index} className="col card m-1 justify-content-center">
                                <div style={{ fontSize: '0.9rem', fontWeight: '500' }}>
                                    {new Date(`${day.date}T12:00:00`).toLocaleDateString('en-US', { weekday: 'short' })}
                                </div>
                                <div style={{ fontSize: '1.2rem' }}>
                                    {getIcon(day.icon)} {/* Optional icon map */}
                                </div>
                                <div style={{ fontSize: '0.9rem' }}>
                                    H: {day.high}°<br />L: {day.low}°
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            <div className="about centered mt-3">
                <div className="col">
                    <h3>
                        <strong className="title large-font">The Dayton Leader</strong>
                    </h3>
                    {/* <p style={{ whiteSpace: 'pre-line' }} dangerouslySetInnerHTML={{ __html: aboutText }}></p> */}
                    {/* <a className="btn" href="https://jhdaytonleader.wixsite.com/israelatwar/news" target="_blank" rel="noopener noreferrer" role="button">Link</a> */}
                </div>
            </div>
            <div className="article-divider d-flex align-items-center m-3 mt-0 ">
                <div className="flex-grow-1 line-left" />
                <span className="px-3 title">Featured</span>
                <div className="flex-grow-1 line-right" />
            </div>
            {loadingArticles ? (
                <div className="text-center my-5">
                    <div className="text-center m-3 p-3">
                        <div
                            className="article-image placeholder-glow"
                            style={{
                                height: '300px',
                                backgroundColor: '#e0e0e0',
                                borderRadius: '8px',
                            }}
                        ></div>
                        <div className="placeholder-glow mt-3">
                            <h5 className="placeholder col-6"></h5>
                            <p className="placeholder col-8"></p>
                            <p className="placeholder col-4"></p>
                            <button className="btn btn-secondary disabled placeholder col-4 mt-2"></button>
                        </div>
                        <div className="card-footer text-muted placeholder col-3 mt-3 mx-auto"></div>
                    </div>
                </div>
            ) : articles.length >= 3 && (
                <>
                    {/* Featured Article */}
                    <div className="row g-0" style={{ minHeight: '100%' }}>
                        {/* Left column: large article */}
                        <div className="col-lg-7 d-flex">
                            <div className="text-center m-3 p-3 article-card flex-grow-1 d-flex flex-column">
                                <div
                                    className="article-image article-image-lg"
                                    style={{
                                        // backgroundImage: `url(https://daytonleader.onrender.com${articles[0].image})`,
                                        backgroundImage: `url(${banner})`,
                                    }}
                                ></div>
                                <div>
                                    <h5 className="article-title">{articles[0].title}</h5>
                                    <p className="card-text article-content-lg article-content-fade">{articles[0].content}</p>
                                    <p className="card-text">
                                        <strong>By {articles[0].author}</strong>
                                    </p>
                                    <button
                                        onClick={() =>
                                            handleOpen({
                                                title: articles[0].title,
                                                image: articles[0].image,
                                                text: articles[0].content,
                                                author: articles[0].author,
                                            })
                                        }
                                        className="btn"
                                    >
                                        Read More
                                    </button>
                                    <div className="card-footer text-muted mt-auto">{getRelativeTime(articles[0].date)}</div>
                                </div>
                                <div
                                    className="d-flex flex-column flex-grow-1 overflow-auto rounded p-3 scroll"
                                    style={{
                                        height: '250px',
                                        backgroundColor: '#f3f0f2',
                                    }}
                                >
                                    <h6 className="sm-title mb-3 text-center">
                                        <strong>{articles[0].title}</strong> — Comment Section
                                    </h6>
                                    {comments.map((comment, index) => (
                                        <div key={index} className="d-flex align-items-center mb-3">
                                            <div
                                                className="me-2 text-truncate"
                                                style={{
                                                    minWidth: '100px',
                                                    width: '100px',
                                                    fontWeight: 'bold',
                                                    color: '#570335',
                                                }}
                                            >
                                                {comment.user}
                                            </div>
                                            <div
                                                className="p-2 rounded"
                                                style={{
                                                    backgroundColor: '#e0d6dc',
                                                    borderRadius: '1rem',
                                                    color: '#2e2e2e',
                                                }}
                                            >
                                                <div>{comment.text}</div>
                                                <div style={{ fontSize: '0.75rem', color: '#555', textAlign: 'left' }}>
                                                    {comment.timestamp}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <form
                                    className="mt-3 d-flex"
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        handleAddComment();
                                    }}
                                >
                                    <input
                                        type="text"
                                        className="form-control me-2"
                                        placeholder="Your name"
                                        value={commentName}
                                        readOnly
                                        // onChange={(e) => setCommentName(e.target.value)}
                                        style={{ maxWidth: '150px' }}
                                    />
                                    <input
                                        type="text"
                                        className="form-control me-2"
                                        placeholder="Add a comment..."
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        maxLength={150}
                                    />
                                    <button type="submit" className="btn">
                                        Post
                                    </button>
                                </form>
                            </div>
                        </div>
                        {/* Right column: two stacked articles */}
                        <div className="col-lg-5 d-flex flex-column">
                            {[1, 2].map((i) => (
                                <div
                                    key={i}
                                    className="text-center m-3 p-3 article-card d-flex flex-column flex-fill"
                                    style={{ flex: '1 1 0' }}
                                >
                                    <div
                                        className="article-image article-image-sm"
                                        style={{
                                            // backgroundImage: `url(https://daytonleader.onrender.com${articles[i].image})`,
                                            backgroundImage: `url(${banner})`,
                                        }}
                                    ></div>
                                    <div>
                                        <h5 className="article-title">{articles[i].title}</h5>
                                        <p className="card-text article-content-sm article-content-fade">{articles[i].content}</p>
                                        <p className="card-text">
                                            <strong>By {articles[i].author}</strong>
                                        </p>
                                        <button
                                            onClick={() =>
                                                handleOpen({
                                                    title: articles[i].title,
                                                    image: articles[i].image,
                                                    text: articles[i].content,
                                                    author: articles[i].author,
                                                })
                                            }
                                            className="btn"
                                        >
                                            Read More
                                        </button>
                                        <div className="card-footer text-muted mt-auto">{getRelativeTime(articles[i].date)}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* More Articles */}
                    <div className="article-divider d-flex align-items-center m-3">
                        <div className="flex-grow-1 line-left" />
                        <span className="px-3 title">More</span>
                        <div className="flex-grow-1 line-right" />
                    </div>
                    <div className="row justify-content-center g-0">
                        <div className="col-lg-5 text-center m-3 p-3 article-card d-flex flex-column">
                            <div
                                className="article-image article-image-sm"
                                style={{
                                    backgroundImage: `url(${banner})`, // or: `url(https://daytonleader.onrender.com${moreArticles[0].image})`
                                }}
                            ></div>
                            <div>
                                <h5 className="article-title">{moreArticles[0].title}</h5>
                                <p className="card-text article-content-sm article-content-fade">{moreArticles[0].content}</p>
                                <p className="card-text"><strong>By {moreArticles[0].author}</strong></p>
                                <button
                                    onClick={() =>
                                        handleOpen({
                                            title: moreArticles[0].title,
                                            image: moreArticles[0].image,
                                            text: moreArticles[0].content,
                                            author: moreArticles[0].author,
                                        })
                                    }
                                    className="btn"
                                >
                                    Read More
                                </button>
                                <div className="card-footer text-muted mt-auto">{getRelativeTime(moreArticles[0].date)}</div>
                            </div>
                        </div>

                        <div className="col-lg-5 text-center m-3 p-3 article-card d-flex flex-column">
                            <div
                                className="article-image article-image-sm"
                                style={{
                                    backgroundImage: `url(${banner})`, // or: `url(https://daytonleader.onrender.com${moreArticles[1].image})`
                                }}
                            ></div>
                            <div>
                                <h5 className="article-title">{moreArticles[1].title}</h5>
                                <p className="card-text article-content-sm article-content-fade">{moreArticles[1].content}</p>
                                <p className="card-text"><strong>By {moreArticles[1].author}</strong></p>
                                <button
                                    onClick={() =>
                                        handleOpen({
                                            title: moreArticles[1].title,
                                            image: moreArticles[1].image,
                                            text: moreArticles[1].content,
                                            author: moreArticles[1].author,
                                        })
                                    }
                                    className="btn"
                                >
                                    Read More
                                </button>
                                <div className="card-footer text-muted mt-auto">{getRelativeTime(moreArticles[1].date)}</div>
                            </div>
                        </div>
                    </div>
                </>
            )}
            {showModal && (
                <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title article-title">{selectedArticle.title}</h5>
                                <button type="button" className="btn-close" onClick={handleClose}></button>
                            </div>
                            <div className="modal-body text-center">
                                <img src={`https://daytonleader.onrender.com${selectedArticle.image}`} alt="Article" style={{ maxHeight: '400px', maxWidth: '100%', borderRadius: '8px', marginBottom: '1rem' }} />
                                <p>{selectedArticle.text}</p>
                                <p><strong>By {selectedArticle.author}</strong></p>
                            </div>
                            <div className="modal-footer">
                                <button className="btn" onClick={handleClose}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
export default Home;

function getRelativeTime(dateString) {
    const now = new Date();
    const date = new Date(dateString);
    const diff = now - date;

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days === 0) {
        if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        return `Just now`;
    }

    if (days === 1) return `1 day ago`;
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} week${Math.floor(days / 7) > 1 ? 's' : ''} ago`;
    if (days < 365) return `${Math.floor(days / 30)} month${Math.floor(days / 30) > 1 ? 's' : ''} ago`;

    return `${Math.floor(days / 365)} year${Math.floor(days / 365) > 1 ? 's' : ''} ago`;
}

function getIcon(icon) {
    const icons = {
        'clear-day': '☀️',
        'clear-night': '🌙',
        'partly-cloudy-day': '⛅',
        'partly-cloudy-night': '🌙☁️',
        'rain': '🌧️',
        'snow': '❄️',
        'cloudy': '☁️',
        'fog': '🌫️',
        'wind': '🌬️',
        'thunder-storm': '⛈️',
    };
    return icons[icon] || '❓';
}
