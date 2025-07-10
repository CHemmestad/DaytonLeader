import React, { useRef, useEffect, useState } from 'react';
import YouTube from 'react-youtube';

const AutoPauseYouTube = ({ videoId }) => {
    const playerRef = useRef(null);
    const containerRef = useRef(null);
    const [isInView, setIsInView] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsInView(entry.isIntersecting);
            },
            { threshold: 0.5 }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => {
            observer.disconnect();
        };
    }, []);

    useEffect(() => {
        const player = playerRef.current;
        if (player) {
            if (isInView) {
                player.playVideo();
            } else {
                player.pauseVideo();
            }
        }
    }, [isInView]);

    const onReady = (event) => {
        playerRef.current = event.target;
        playerRef.current.mute(); // Auto mute if autoplaying
    };

    return (
        <div className="video-container" ref={containerRef}>
            <YouTube
                videoId={videoId}
                opts={{
                    width: '100%',
                    height: '500',
                    playerVars: {
                        autoplay: 0,
                        controls: 1,
                        modestbranding: 1,
                        rel: 0,
                    },
                }}
                onReady={onReady}
            />
        </div>
    );
};

export default AutoPauseYouTube;