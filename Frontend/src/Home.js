import React, { useEffect, useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "./Images/Logo.webp"

function Home() {
    const [aboutMovieReview, setAboutMovieReview] = useState('');

    useEffect(() => {
        fetch('./Reviews/aboutMovieReviews.txt') // Path to your text file
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then((data) => {
                setAboutMovieReview(data);
            })
            .catch((error) => console.error('Error loading text file:', error));
    }, []);
    return (
        <main>
            <h1>Home</h1>
            <div
                className="row mb-3 center"
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <div
                    className="col-3 themed-grid-col"
                    style={{
                        backgroundImage: `url(${logo})`,
                        backgroundSize: 'cover',
                        borderRadius: '50%',
                    }}
                ></div>
            </div>
            <div
                className="row mb-3 center"
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <div className="col-8 themed-grid-par" style={{ borderRadius: '2%' }}>
                    <h3>
                        <strong>About Movie Reviews</strong>
                    </h3>
                    <p id="aboutMovieReview">Welcome to Movie Reviews, the ultimate destination for movie lovers! Whether you're a casual viewer or a cinema fanatic, our website brings you fresh, insightful, and spoiler-free reviews of the latest blockbusters, indie gems, and timeless classics. Dive deep into thoughtful critiques, discover hidden cinematic treasures, and join a community of passionate moviegoers who love to discuss, debate, and celebrate the art of film. With Movie Reviews, you’ll always know what’s worth watching next. Lights, camera, action—let the reviews roll!</p>
                </div>
            </div>
        </main>
    );
}
export default Home;