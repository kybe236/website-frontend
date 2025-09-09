import { useState, useEffect, useRef } from "react";
import "./DotFiles.css";

const images = ["/dot1.png", "/dot2.png", "/dot3.png"];

function DotFiles() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;
        const { left, width } = containerRef.current.getBoundingClientRect();
        const clickX = e.clientX - left;

        if (clickX > width / 2) {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        } else {
            setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
        }
    };

    return (
        <div className="main-container">
            <h1>My Dot Files</h1>

            <div className="images-container" ref={containerRef} onClick={handleClick}>
                <img src={images[currentIndex]} alt={`Image ${currentIndex + 1}`} />
            </div>

            <div className="buttons-container">
                <a
                    href="https://github.com/kybe236/dotfiles/archive/refs/heads/main.zip"
                    className="nav-link"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Download ZIP
                </a>
                <a
                    href="https://github.com/kybe236/dotfiles"
                    className="nav-link"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Repository
                </a>
            </div>
        </div>
    );
}

export default DotFiles;