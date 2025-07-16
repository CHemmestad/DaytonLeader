import React, { useEffect, useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import banner from "./Images/daytonSign.jpg";
import image1 from "./Images/Articles/article1Image.jpg";
import image2 from "./Images/Articles/article2Image.jpg";
import image3 from "./Images/Articles/article3Image.jpg";

function Home() {
    const [weather, setWeather] = useState(null);
    const [aboutText, setAboutText] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [articles, setArticles] = useState([
        {
            title: "The Trial",
            image: image1,
            textFile: "/DaytonLeader/article1Text.txt",
            author: "Justine Hemmestad",
            date: "2025-07-09T08:00:00",
        },
        {
            title: "Knowing Your Community",
            image: image2,
            textFile: "/DaytonLeader/article2Text.txt",
            author: "Justine Hemmestad",
            date: "2025-07-02T08:00:00",
        },
        {
            title: "Knowing Your Community",
            image: image2,
            textFile: "/DaytonLeader/article2Text.txt",
            author: "Justine Hemmestad",
            date: "2025-07-02T08:00:00",
        },
    ]);

    const handleClose = () => {
        setShowModal(false);
        setSelectedArticle(null);
    };

    const handleOpen = (article) => {
        setSelectedArticle(article);
        setShowModal(true);
    };

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
        fetch('/DaytonLeader/aboutText.txt')
            .then((response) => response.text())
            .then((text) => setAboutText(text));
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
                    aspectRatio: '30 / 9',
                    backgroundImage: `url(${banner})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            ></div>
            {weather && (
                <div className="weather-bar row g-0 p-1">
                    {/* Left: Current Weather */}
                    <div className="col-md-5">
                        <div className="card p-3 d-flex flex-row align-items-center m-1">
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
                    <div className="col row">
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
            <div className="about centered m-3 p-3">
                <div className="col">
                    <h3>
                        <strong className="title large-font">The Dayton Leader</strong>
                    </h3>
                    <p style={{ whiteSpace: 'pre-line' }} dangerouslySetInnerHTML={{ __html: aboutText }}></p>
                    <a className="btn" href="https://jhdaytonleader.wixsite.com/israelatwar/news" target="_blank" rel="noopener noreferrer" role="button">Link</a>
                </div>
            </div>
            <div className="article-divider d-flex align-items-center m-3">
                <div className="flex-grow-1 line-left" />
                <span className="px-3 title">Featured</span>
                <div className="flex-grow-1 line-right" />
            </div>
            <div className="text-center m-3 p-3">
                <div
                    className="article-image" style={{ backgroundImage: `url(${articles[0].image})` }}
                ></div>
                <div>
                    <h5 className="article-title">{articles[0].title}</h5>
                    <p className="card-text article-content article-content-fade">{articles[0].text}</p>
                    <p className="card-text"><strong>By {articles[0].author}</strong></p>
                    <button onClick={() => handleOpen({
                        title: articles[0].title,
                        image: articles[0].image,
                        text: articles[0].text,
                        author: articles[0].author
                    })} className="btn">Read More</button>
                </div>
                <div className="card-footer text-muted">
                    {getRelativeTime(articles[0].date)}
                </div>
            </div>
            <div className="article-divider d-flex align-items-center m-3">
                <div className="flex-grow-1 line-left" />
                <span className="px-3 title">More</span>
                <div className="flex-grow-1 line-right" />
            </div>
            <div className="container-fluid">
                <div className="row justify-content-center">
                    <div className="col-sm-5 p-3 m-3">
                        <div
                            className="article-image" style={{ backgroundImage: `url(${articles[1].image})` }}
                        ></div>
                        <div>
                            <h5 className="article-title">{articles[1].title}</h5>
                            <p className="card-text article-content article-content-fade">{articles[1].text}</p>
                            <p className="card-text"><strong>By {articles[1].author}</strong></p>
                            <button onClick={() => handleOpen({
                                title: articles[1].title,
                                image: articles[1].image,
                                text: articles[1].text,
                                author: articles[1].author
                            })} className="btn">Read More</button>
                        </div>
                        <div className="card-footer text-muted">
                            {getRelativeTime(articles[1].date)}
                        </div>
                    </div>
                    <div className="col-sm-5 p-3 m-3">
                        <div
                            className="article-image" style={{ backgroundImage: `url(${articles[2].image})` }}
                        ></div>
                        <div>
                            <h5 className="article-title">{articles[2].title}</h5>
                            <p className="card-text article-content article-content-fade">{articles[2].text}</p>
                            <p className="card-text"><strong>By {articles[2].author}</strong></p>
                            <button onClick={() => handleOpen({
                                title: articles[2].title,
                                image: articles[2].image,
                                text: articles[2].text,
                                author: articles[2].author
                            })} className="btn">Read More</button>
                        </div>
                        <div className="card-footer text-muted">
                            {getRelativeTime(articles[2].date)}
                        </div>
                    </div>
                    {showModal && (
                        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                            <div className="modal-dialog modal-lg" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title article-title">{selectedArticle.title}</h5>
                                        <button type="button" className="btn-close" onClick={handleClose}></button>
                                    </div>
                                    <div className="modal-body text-center">
                                        <img src={selectedArticle.image} alt="Article" style={{ maxHeight: '400px', maxWidth: '100%', borderRadius: '8px', marginBottom: '1rem' }} />
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
            </div>
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
        'partly-cloudy-night': '🌤️',
        'rain': '🌧️',
        'snow': '❄️',
        'cloudy': '☁️',
        'fog': '🌫️',
        'wind': '🌬️',
        'thunder-storm': '⛈️',
    };
    return icons[icon] || '❓';
}
